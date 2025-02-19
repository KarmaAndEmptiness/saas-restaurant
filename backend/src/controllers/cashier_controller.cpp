#include "controllers/cashier_controller.h"
#include <nlohmann/json.hpp>
#include <regex>
#include "middleware/error_middleware.h"
#include "utils/receipt_generator.h"
#include "utils/date_validator.h"

using json = nlohmann::json;

namespace controllers
{
    CashierController::CashierController()
        : cashier_service_(std::make_unique<services::CashierService>()) {}

    void CashierController::HandleSearchProducts(const httplib::Request &req, httplib::Response &res)
    {
        try
        {
            std::string keyword = req.get_header_value("keyword");
            auto products = cashier_service_->SearchProducts(keyword);

            json response = json::array();
            for (const auto &product : products)
            {
                response.push_back(ProductToJson(product));
            }

            res.body = response.dump();
        }
        catch (const json::parse_error &e)
        {
            std::cerr << "Error: " << __FILE__ << ":" << __LINE__ << " " << e.what() << std::endl;
            res.status = 400;
            json error = {{"message", "JSON解析错误"}};
            res.body = error.dump();
        }
        catch (const std::exception &e)
        {
            std::cerr << "Error: " << __FILE__ << ":" << __LINE__ << " " << e.what() << std::endl;
            throw middleware::ApiException(500, "搜索商品失败");
        }
    }

    void CashierController::HandleGetProductByCode(const httplib::Request &req, httplib::Response &res)
    {
        try
        {
            std::string code = ExtractIdFromPath(req.path);
            if (code.empty())
            {
                throw middleware::ValidationException("商品编码不能为空");
            }

            auto product = cashier_service_->GetProductByCode(code);
            if (product.GetId().empty())
            {
                throw middleware::NotFoundException("商品不存在");
            }

            res.body = ProductToJson(product).dump();
        }
        catch (const middleware::ApiException &)
        {
            throw;
        }
        catch (const std::exception &e)
        {
            std::cerr << "Error: " << __FILE__ << ":" << __LINE__ << " " << e.what() << std::endl;
            throw middleware::ApiException(500, "获取商品信息失败");
        }
    }

    void CashierController::HandleCreateTransaction(const httplib::Request &req, httplib::Response &res)
    {
        try
        {
            auto data = json::parse(req.body);
            if (!ValidateTransactionData(data))
            {
                throw middleware::ValidationException("交易数据格式错误");
            }

            // 验证操作员
            std::string operator_id = data.value("operator_id", "");
            if (!ValidateOperatorId(operator_id))
            {
                throw middleware::ValidationException("无效的操作员ID");
            }

            // 验证商品库存
            for (const auto &item : data["items"])
            {
                if (!ValidateProductStock(item["product_id"], item["quantity"]))
                {
                    throw middleware::ValidationException("商品库存不足");
                }
            }

            // 验证积分使用
            double points_used = data.value("points_used", 0.0);
            double total_amount = data.value("total_amount", 0.0);
            if (!ValidatePaymentAmount(total_amount, points_used))
            {
                throw middleware::ValidationException("积分抵扣金额超出限制");
            }

            if (points_used > 0)
            {
                std::string member_id = data.value("member_id", "");
                if (!ValidatePointsOperation(member_id, -points_used))
                {
                    throw middleware::ValidationException("会员积分不足");
                }
            }

            // 创建交易
            auto transaction = JsonToTransaction(data);
            std::string id = cashier_service_->CreateTransaction(transaction);
            if (id.empty())
            {
                throw middleware::ApiException(500, "创建交易失败");
            }

            // 返回成功响应
            json response = {
                {"id", id},
                {"message", "交易创建成功"},
                {"success", true}};
            res.status = 201;
            res.body = response.dump();
        }
        catch (const json::parse_error &e)
        {
            std::cerr << "Error: " << __FILE__ << ":" << __LINE__ << " " << e.what() << std::endl;
            res.status = 400;
            json error = {{"message", "JSON解析错误"}};
            res.body = error.dump();
        }
        catch (const middleware::ApiException &)
        {
            throw;
        }
        catch (const std::exception &e)
        {
            std::cerr << "Error: " << __FILE__ << ":" << __LINE__ << " " << e.what() << std::endl;
            throw middleware::ApiException(500, "创建交易失败: " + std::string(e.what()));
        }
    }

    void CashierController::HandleCreateMember(const httplib::Request &req, httplib::Response &res)
    {
        try
        {
            auto data = json::parse(req.body);
            if (!ValidateMemberData(data))
            {
                throw middleware::ValidationException("会员数据格式错误");
            }

            auto member = JsonToMember(data);
            std::string id = cashier_service_->CreateMember(member);
            if (id.empty())
            {
                throw middleware::ApiException(500, "创建会员失败");
            }

            json response = {
                {"id", id},
                {"message", "会员创建成功"},
                {"success", true}};
            res.status = 201;
            res.body = response.dump();
        }
        catch (const json::parse_error &e)
        {
            std::cerr << "Error: " << __FILE__ << ":" << __LINE__ << " " << e.what() << std::endl;
            res.status = 400;
            json error = {{"message", "JSON解析错误"}};
            res.body = error.dump();
        }
        catch (const middleware::ApiException &)
        {
            throw;
        }
        catch (const std::exception &e)
        {
            std::cerr << "Error: " << __FILE__ << ":" << __LINE__ << " " << e.what() << std::endl;
            throw middleware::ApiException(500, "创建会员失败");
        }
    }

    void CashierController::HandleGenerateReceipt(const httplib::Request &req, httplib::Response &res)
    {
        try
        {
            std::string transaction_id = ExtractIdFromPath(req.path);
            if (transaction_id.empty())
            {
                throw middleware::ValidationException("交易ID不能为空");
            }

            // 获取交易信息
            auto transaction = cashier_service_->GetTransactionById(transaction_id);
            if (transaction.GetId().empty())
            {
                throw middleware::NotFoundException("交易不存在");
            }

            // 获取会员信息（如果有）
            const models::Member *member = nullptr;
            if (!transaction.GetMemberId().empty())
            {
                // Store the member object in a variable
                auto member_obj = cashier_service_->GetMemberById(transaction.GetMemberId());
                member = &member_obj; // Now take the address of the variable
            }

            // 生成小票
            std::string receipt = utils::ReceiptGenerator::GenerateReceipt(transaction, member);

            // 设置响应
            res.set_header("Content-Type", "text/plain; charset=utf-8");
            res.body = receipt;
        }
        catch (const middleware::ApiException &)
        {
            throw;
        }
        catch (const std::exception &e)
        {
            std::cerr << "Error: " << __FILE__ << ":" << __LINE__ << " " << e.what() << std::endl;
            throw middleware::ApiException(500, "生成小票失败");
        }
    }

    void CashierController::HandleGetMemberByCard(const httplib::Request &req, httplib::Response &res)
    {
        try
        {
            std::string card_number = ExtractIdFromPath(req.path);
            if (card_number.empty())
            {
                throw middleware::ValidationException("会员卡号不能为空");
            }

            auto member = cashier_service_->GetMemberByCard(card_number);
            if (member.GetId().empty())
            {
                throw middleware::NotFoundException("会员不存在");
            }

            res.body = MemberToJson(member).dump();
        }
        catch (const middleware::ApiException &)
        {
            throw;
        }
        catch (const std::exception &e)
        {
            std::cerr << "Error: " << __FILE__ << ":" << __LINE__ << " " << e.what() << std::endl;
            throw middleware::ApiException(500, "获取会员信息失败");
        }
    }

    void CashierController::HandleGetMemberByPhone(const httplib::Request &req, httplib::Response &res)
    {
        try
        {
            std::string phone = ExtractIdFromPath(req.path);
            if (phone.empty())
            {
                throw middleware::ValidationException("手机号不能为空");
            }

            auto member = cashier_service_->GetMemberByPhone(phone);
            if (member.GetId().empty())
            {
                throw middleware::NotFoundException("会员不存在");
            }

            res.body = MemberToJson(member).dump();
        }
        catch (const middleware::ApiException &)
        {
            throw;
        }
        catch (const std::exception &e)
        {
            std::cerr << "Error: " << __FILE__ << ":" << __LINE__ << " " << e.what() << std::endl;
            throw middleware::ApiException(500, "获取会员信息失败");
        }
    }

    void CashierController::HandleSearchMembers(const httplib::Request &req, httplib::Response &res)
    {
        try
        {
            std::string keyword = req.get_header_value("keyword");
            auto members = cashier_service_->SearchMembers(keyword);

            json response = json::array();
            for (const auto &member : members)
            {
                response.push_back(MemberToJson(member));
            }

            res.body = response.dump();
        }
        catch (const json::parse_error &e)
        {
            std::cerr << "Error: " << __FILE__ << ":" << __LINE__ << " " << e.what() << std::endl;
            res.status = 400;
            json error = {{"message", "JSON解析错误"}};
            res.body = error.dump();
        }
        catch (const std::exception &e)
        {
            std::cerr << "Error: " << __FILE__ << ":" << __LINE__ << " " << e.what() << std::endl;
            throw middleware::ApiException(500, "搜索会员失败");
        }
    }

    void CashierController::HandleCalculatePointsDiscount(const httplib::Request &req, httplib::Response &res)
    {
        try
        {
            auto data = json::parse(req.body);
            if (!data.contains("points") || !data["points"].is_number())
            {
                throw middleware::ValidationException("积分数据格式错误");
            }

            double points = data["points"].get<double>();
            double discount = cashier_service_->CalculatePointsDiscount(points);

            json response = {
                {"discount", discount},
                {"points", points},
                {"success", true}};
            res.body = response.dump();
        }
        catch (const json::parse_error &e)
        {
            std::cerr << "Error: " << __FILE__ << ":" << __LINE__ << " " << e.what() << std::endl;
            res.status = 400;
            json error = {{"message", "JSON解析错误"}};
            res.body = error.dump();
        }
        catch (const middleware::ApiException &)
        {
            throw;
        }
        catch (const std::exception &e)
        {
            std::cerr << "Error: " << __FILE__ << ":" << __LINE__ << " " << e.what() << std::endl;
            throw middleware::ApiException(500, "计算积分抵扣失败");
        }
    }

    void CashierController::HandleGetMemberTransactions(const httplib::Request &req, httplib::Response &res)
    {
        try
        {
            std::string member_id = ExtractIdFromPath(req.path);
            if (member_id.empty())
            {
                throw middleware::ValidationException("会员ID不能为空");
            }

            std::string start_date = req.get_header_value("start_date");
            std::string end_date = req.get_header_value("end_date");

            // 验证日期范围
            if (!utils::DateValidator::IsValidDateRange(start_date, end_date))
            {
                throw middleware::ValidationException("日期范围无效");
            }

            auto transactions = cashier_service_->GetMemberTransactions(member_id, start_date, end_date);

            json response = json::array();
            for (const auto &transaction : transactions)
            {
                response.push_back(TransactionToJson(transaction));
            }

            res.body = response.dump();
        }
        catch (const json::parse_error &e)
        {
            std::cerr << "Error: " << __FILE__ << ":" << __LINE__ << " " << e.what() << std::endl;
            res.status = 400;
            json error = {{"message", "JSON解析错误"}};
            res.body = error.dump();
        }
        catch (const middleware::ApiException &)
        {
            throw;
        }
        catch (const std::exception &e)
        {
            std::cerr << "Error: " << __FILE__ << ":" << __LINE__ << " " << e.what() << std::endl;
            throw middleware::ApiException(500, "获取会员交易记录失败");
        }
    }

    void CashierController::HandleUpdateMemberPoints(const httplib::Request &req, httplib::Response &res)
    {
        try
        {
            std::string member_id = ExtractIdFromPath(req.path);
            if (member_id.empty())
            {
                throw middleware::ValidationException("会员ID不能为空");
            }

            auto data = json::parse(req.body);
            if (!data.contains("points_change") || !data["points_change"].is_number())
            {
                throw middleware::ValidationException("积分变更数据格式错误");
            }

            double points_change = data["points_change"].get<double>();
            if (!cashier_service_->UpdateMemberPoints(member_id, points_change))
            {
                throw middleware::ApiException(400, "积分更新失败");
            }

            json response = {
                {"message", "积分更新成功"},
                {"success", true}};
            res.body = response.dump();
        }
        catch (const json::parse_error &e)
        {
            std::cerr << "Error: " << __FILE__ << ":" << __LINE__ << " " << e.what() << std::endl;
            res.status = 400;
            json error = {{"message", "JSON解析错误"}};
            res.body = error.dump();
        }
        catch (const middleware::ApiException &)
        {
            throw;
        }
        catch (const std::exception &e)
        {
            std::cerr << "Error: " << __FILE__ << ":" << __LINE__ << " " << e.what() << std::endl;
            throw middleware::ApiException(500, "更新会员积分失败");
        }
    }

    void CashierController::HandleGetTransactionHistory(const httplib::Request &req, httplib::Response &res)
    {
        try
        {
            std::string operator_id = req.get_header_value("operator_id");
            if (operator_id.empty())
            {
                throw middleware::ValidationException("收银员ID不能为空");
            }

            std::string start_date = req.get_header_value("start_date");
            std::string end_date = req.get_header_value("end_date");

            // 验证日期范围
            if (!utils::DateValidator::IsValidDateRange(start_date, end_date))
            {
                throw middleware::ValidationException("日期范围无效");
            }

            auto transactions = cashier_service_->GetTransactionHistory(operator_id, start_date, end_date);

            json response = json::array();
            for (const auto &transaction : transactions)
            {
                response.push_back(TransactionToJson(transaction));
            }

            res.body = response.dump();
        }
        catch (const json::parse_error &e)
        {
            std::cerr << "Error: " << __FILE__ << ":" << __LINE__ << " " << e.what() << std::endl;
            res.status = 400;
            json error = {{"message", "JSON解析错误"}};
            res.body = error.dump();
        }
        catch (const middleware::ApiException &)
        {
            throw;
        }
        catch (const std::exception &e)
        {
            throw middleware::ApiException(500, "获取交易历史失败");
        }
    }

    // 工具方法实现
    bool CashierController::ValidateTransactionData(const json &data)
    {
        // 基本字段验证
        if (!data.contains("items") || !data["items"].is_array() ||
            !data.contains("payment_method") || !data["payment_method"].is_number())
        {
            return false;
        }

        // 验证商品项
        for (const auto &item : data["items"])
        {
            if (!item.contains("product_id") || !item["product_id"].is_string() ||
                !item.contains("product_name") || !item["product_name"].is_string() ||
                !item.contains("price") || !item["price"].is_number() ||
                !item.contains("quantity") || !item["quantity"].is_number() ||
                !item.contains("subtotal") || !item["subtotal"].is_number())
            {
                return false;
            }

            // 验证数量和小计
            if (item["quantity"].get<int>() <= 0 ||
                item["subtotal"].get<double>() != item["price"].get<double>() * item["quantity"].get<int>())
            {
                return false;
            }
        }

        // 验证会员ID（如果存在）
        if (data.contains("member_id") && !data["member_id"].is_string())
        {
            return false;
        }

        // 验证支付方式
        int payment_method = data["payment_method"].get<int>();
        if (payment_method < 0 || payment_method > 2) // 假设0=现金，1=微信，2=支付宝
        {
            return false;
        }

        return true;
    }

    bool CashierController::ValidateMemberData(const json &data)
    {
        // 基本字段验证
        if (!data.contains("name") || !data["name"].is_string() ||
            !data.contains("phone") || !data["phone"].is_string() ||
            !data.contains("gender") || !data["gender"].is_string() ||
            !data.contains("card_number") || !data["card_number"].is_string())
        {
            return false;
        }

        // 验证手机号格式
        std::regex phone_pattern("^1[3-9]\\d{9}$");
        if (!std::regex_match(data["phone"].get<std::string>(), phone_pattern))
        {
            return false;
        }

        // 验证性别
        std::string gender = data["gender"].get<std::string>();
        if (gender != "男" && gender != "女")
        {
            return false;
        }

        // 验证会员卡号格式
        std::regex card_pattern("^C\\d{6}$");
        if (!std::regex_match(data["card_number"].get<std::string>(), card_pattern))
        {
            return false;
        }

        // 验证姓名长度
        std::string name = data["name"].get<std::string>();
        if (name.empty() || name.length() > 50)
        {
            return false;
        }

        return true;
    }

    std::string CashierController::ExtractIdFromPath(const std::string &path)
    {
        std::regex id_pattern("/([^/]+)$");
        std::smatch matches;
        if (std::regex_search(path, matches, id_pattern))
        {
            return matches[1].str();
        }
        return "";
    }

    models::Transaction CashierController::JsonToTransaction(const json &data)
    {
        std::vector<models::TransactionItem> items;
        for (const auto &item_data : data["items"])
        {
            items.push_back({item_data["product_id"],
                             item_data["product_name"],
                             item_data["price"],
                             item_data["quantity"],
                             item_data["subtotal"]});
        }

        return models::Transaction(
            "", // ID will be generated
            data.value("member_id", ""),
            items,
            data.value("total_amount", 0.0),
            data.value("points_used", 0.0),
            data.value("points_earned", 0.0),
            static_cast<models::PaymentMethod>(data["payment_method"].get<int>()),
            data.value("operator_id", ""),
            data.value("timestamp", ""));
    }

    models::Member CashierController::JsonToMember(const json &data)
    {
        return models::Member(
            "", // ID will be generated
            data["name"],
            data["phone"],
            data["gender"],
            models::MemberLevel::REGULAR,
            0.0, // Initial points
            data["card_number"],
            data.value("join_date", ""));
    }

    json CashierController::TransactionToJson(const models::Transaction &transaction)
    {
        json items = json::array();
        for (const auto &item : transaction.GetItems())
        {
            items.push_back({{"product_id", item.product_id},
                             {"product_name", item.product_name},
                             {"price", item.price},
                             {"quantity", item.quantity},
                             {"subtotal", item.subtotal}});
        }

        return {
            {"id", transaction.GetId()},
            {"member_id", transaction.GetMemberId()},
            {"items", items},
            {"total_amount", transaction.GetTotalAmount()},
            {"points_used", transaction.GetPointsUsed()},
            {"points_earned", transaction.GetPointsEarned()},
            {"payment_method", static_cast<int>(transaction.GetPaymentMethod())},
            {"operator_id", transaction.GetOperatorId()},
            {"timestamp", transaction.GetTimestamp()}};
    }

    json CashierController::MemberToJson(const models::Member &member)
    {
        return {
            {"id", member.GetId()},
            {"name", member.GetName()},
            {"phone", member.GetPhone()},
            {"gender", member.GetGender()},
            {"level", static_cast<int>(member.GetLevel())},
            {"points", member.GetPoints()},
            {"card_number", member.GetCardNumber()},
            {"join_date", member.GetJoinDate()}};
    }

    json CashierController::ProductToJson(const models::Product &product)
    {
        return {
            {"id", product.GetId()},
            {"name", product.GetName()},
            {"code", product.GetCode()},
            {"price", product.GetPrice()},
            {"stock", product.GetStock()},
            {"category", product.GetCategory()},
            {"points_eligible", product.IsPointsEligible()}};
    }

    bool CashierController::ValidatePointsOperation(const std::string &member_id, double points)
    {
        try
        {
            auto member = cashier_service_->GetMemberById(member_id);
            if (member.GetId().empty())
            {
                return false;
            }

            // 检查积分是否足够（如果是使用积分的情况）
            if (points < 0 && member.GetPoints() < std::abs(points))
            {
                return false;
            }

            // 检查单次积分变更上限
            if (std::abs(points) > 100000) // 假设单次积分变更上限为10万
            {
                return false;
            }

            return true;
        }
        catch (const json::parse_error &e)
        {
            std::cerr << "Error: " << __FILE__ << ":" << __LINE__ << " " << e.what() << std::endl;
            return false;
        }
        catch (const std::exception &e)
        {
            std::cerr << "Error: " << __FILE__ << ":" << __LINE__ << " " << e.what() << std::endl;
            return false;
        }
    }

    bool CashierController::ValidateOperatorId(const std::string &operator_id)
    {
        // 这里可以添加更复杂的操作员验证逻辑
        return !operator_id.empty() && operator_id.length() <= 32;
    }

    bool CashierController::ValidateProductStock(const std::string &product_id, int quantity)
    {
        try
        {
            auto product = cashier_service_->GetProductByCode(product_id);
            return !product.GetId().empty() && product.GetStock() >= quantity;
        }
        catch (const std::exception &e)
        {
            std::cerr << "Error: " << __FILE__ << ":" << __LINE__ << " " << e.what() << std::endl;
            return false;
        }
    }

    bool CashierController::ValidatePaymentAmount(double total_amount, double points_used)
    {
        // 验证支付金额的合理性
        if (total_amount < 0 || points_used < 0)
        {
            return false;
        }

        // 假设积分抵扣不能超过总金额的50%
        double max_points_discount = total_amount * 0.5;
        double points_discount = points_used * 0.1; // 假设1积分=0.1元

        return points_discount <= max_points_discount;
    }

} // namespace controllers