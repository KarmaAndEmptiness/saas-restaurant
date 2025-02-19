#include "controllers/finance_controller.h"
#include <nlohmann/json.hpp>
#include "middleware/error_middleware.h"
#include "utils/date_validator.h"
#include "utils/id_generator.h"
#include <iostream>
using json = nlohmann::json;

namespace controllers
{
    FinanceController::FinanceController()
        : finance_service_(std::make_unique<services::FinanceService>()) {}

    void FinanceController::HandleGetFinancialStats(const httplib::Request &req, httplib::Response &res)
    {
        try
        {
            std::string start_date = req.get_header_value("startDate");
            std::string end_date = req.get_header_value("endDate");
            std::string store_id = req.get_header_value("storeId");

            if (!ValidateDateRange(start_date, end_date))
            {
                throw middleware::ValidationException("无效的日期范围");
            }

            auto stats = finance_service_->GetFinancialStats(start_date, end_date, store_id);
            res.body = FinancialStatsToJson(stats).dump();
        }
        catch (const middleware::ApiException &)
        {
            throw;
        }
        catch (const std::exception &e)
        {
            std::cerr << "Error: " << __FILE__ << ":" << __LINE__ << " " << e.what() << std::endl;
            throw middleware::ApiException(500, "获取财务统计失败: " + std::string(e.what()));
        }
    }

    void FinanceController::HandleGetSalesTrend(const httplib::Request &req, httplib::Response &res)
    {
        try
        {
            std::string start_date = req.get_header_value("startDate");
            std::string end_date = req.get_header_value("endDate");
            std::string store_id = req.get_header_value("storeId");

            if (!ValidateDateRange(start_date, end_date))
            {
                throw middleware::ValidationException("无效的日期范围");
            }

            auto trend = finance_service_->GetSalesTrend(start_date, end_date, store_id);
            json response = json::array();
            for (const auto &[date, amount] : trend)
            {
                response.push_back({{"date", date},
                                    {"amount", amount}});
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
            throw middleware::ApiException(500, "获取销售趋势失败: " + std::string(e.what()));
        }
    }

    void FinanceController::HandleGetPaymentStats(const httplib::Request &req, httplib::Response &res)
    {
        try
        {
            std::string start_date = req.get_header_value("startDate");
            std::string end_date = req.get_header_value("endDate");
            std::string store_id = req.get_header_value("storeId");

            if (!ValidateDateRange(start_date, end_date))
            {
                throw middleware::ValidationException("无效的日期范围");
            }

            auto stats = finance_service_->GetPaymentStats(start_date, end_date, store_id);
            json response = json::array();
            for (const auto &[method, percentage] : stats)
            {
                response.push_back({{"method", method},
                                    {"percentage", percentage}});
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
            throw middleware::ApiException(500, "获取支付统计失败: " + std::string(e.what()));
        }
    }

    void FinanceController::HandleGetSettlementList(const httplib::Request &req, httplib::Response &res)
    {
        try
        {
            std::string start_date = req.get_header_value("startDate");
            std::string end_date = req.get_header_value("endDate");
            std::string store_id = req.get_header_value("storeId");

            if (!ValidateDateRange(start_date, end_date))
            {
                throw middleware::ValidationException("无效的日期范围");
            }

            auto settlements = finance_service_->GetSettlementList(start_date, end_date, store_id);
            json response = json::array();
            for (const auto &settlement : settlements)
            {
                response.push_back(SettlementToJson(settlement));
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
            throw middleware::ApiException(500, "获取结算列表失败: " + std::string(e.what()));
        }
    }

    void FinanceController::HandleCreateSettlement(const httplib::Request &req, httplib::Response &res)
    {
        try
        {
            auto request_data = json::parse(req.body);
            if (!ValidateSettlementData(request_data))
            {
                throw middleware::ValidationException("结算数据验证失败");
            }

            models::StoreSettlement settlement(
                utils::GenerateId("SET"),
                request_data["storeId"],
                request_data["periodStart"],
                request_data["periodEnd"],
                request_data["amount"],
                models::StoreSettlement::Status::PENDING,
                request_data["bankAccount"],
                request_data["bankName"],
                request_data["remark"]);

            std::string id = finance_service_->CreateSettlement(settlement);
            if (id.empty())
            {
                throw middleware::ApiException(500, "创建结算记录失败");
            }

            json response = {{"id", id},
                             {"message", "结算记录创建成功"}};
            res.status = 201;
            res.body = response.dump();
        }
        catch (const middleware::ApiException &)
        {
            throw;
        }
        catch (const json::parse_error &e)
        {
            std::cerr << "Error: " << __FILE__ << ":" << __LINE__ << " " << e.what() << std::endl;
            res.status = 400;
            json error = {{"message", "JSON解析错误"}};
            res.body = error.dump();
        }
        catch (const json::exception &e)
        {
            std::cerr << "Error: " << __FILE__ << ":" << __LINE__ << " " << e.what() << std::endl;
            throw middleware::ValidationException("无效的请求数据格式");
        }
        catch (const std::exception &e)
        {
            std::cerr << "Error: " << __FILE__ << ":" << __LINE__ << " " << e.what() << std::endl;
            throw middleware::ApiException(500, "创建结算记录失败: " + std::string(e.what()));
        }
    }

    void FinanceController::HandleUpdateSettlementStatus(const httplib::Request &req, httplib::Response &res)
    {
        try
        {
            std::string id = ExtractIdFromPath(req.path);
            auto request_data = json::parse(req.body);

            if (!request_data.contains("status"))
            {
                throw middleware::ValidationException("缺少状态参数");
            }

            std::string status_str = request_data["status"];
            models::StoreSettlement::Status status;

            if (status_str == "completed")
            {
                status = models::StoreSettlement::Status::COMPLETED;
            }
            else if (status_str == "failed")
            {
                status = models::StoreSettlement::Status::FAILED;
            }
            else
            {
                throw middleware::ValidationException("无效的状态值");
            }

            if (!finance_service_->UpdateSettlementStatus(id, status))
            {
                throw middleware::ApiException(404, "结算记录不存在");
            }

            json response = {{"message", "结算状态更新成功"}};
            res.body = response.dump();
        }
        catch (const middleware::ApiException &)
        {
            throw;
        }
        catch (const json::exception &e)
        {
            std::cerr << "Error: " << __FILE__ << ":" << __LINE__ << " " << e.what() << std::endl;
            throw middleware::ValidationException("无效的请求数据格式");
        }
        catch (const std::exception &e)
        {
            std::cerr << "Error: " << __FILE__ << ":" << __LINE__ << " " << e.what() << std::endl;
            throw middleware::ApiException(500, "更新结算状态失败: " + std::string(e.what()));
        }
    }

    void FinanceController::HandleGetSettlementById(const httplib::Request &req, httplib::Response &res)
    {
        try
        {
            std::string id = ExtractIdFromPath(req.path);
            auto settlement = finance_service_->GetSettlementById(id);

            if (settlement.GetId().empty())
            {
                throw middleware::ApiException(404, "结算记录不存在");
            }

            res.body = SettlementToJson(settlement).dump();
        }
        catch (const middleware::ApiException &)
        {
            throw;
        }
        catch (const std::exception &e)
        {
            std::cerr << "Error: " << __FILE__ << ":" << __LINE__ << " " << e.what() << std::endl;
            throw middleware::ApiException(500, "获取结算记录失败: " + std::string(e.what()));
        }
    }

    void FinanceController::HandleGetReportConfigs(const httplib::Request &req, httplib::Response &res)
    {
        std::cout << req.path << std::endl;
        try
        {
            auto configs = finance_service_->GetReportConfigs();
            json response = json::array();
            for (const auto &config : configs)
            {
                response.push_back(ReportConfigToJson(config));
            }
            res.body = response.dump();
        }
        catch (const std::exception &e)
        {
            std::cerr << "Error: " << __FILE__ << ":" << __LINE__ << " " << e.what() << std::endl;
            throw middleware::ApiException(500, "获取报表配置失败: " + std::string(e.what()));
        }
    }

    void FinanceController::HandleCreateReportConfig(const httplib::Request &req, httplib::Response &res)
    {
        try
        {
            auto request_data = json::parse(req.body);
            if (!ValidateReportConfigData(request_data))
            {
                throw middleware::ValidationException("报表配置数据验证失败");
            }

            models::ReportConfig config(
                utils::GenerateId("RPT"),
                request_data["name"],
                StringToReportType(request_data["type"]),
                request_data["metrics"].get<std::vector<std::string>>(),
                request_data["includeDateRange"],
                request_data["includeStore"],
                request_data["includeCategory"],
                request_data["includePaymentMethod"],
                StringToReportFrequency(request_data["scheduleFrequency"]),
                request_data["recipients"].get<std::vector<std::string>>());

            std::string id = finance_service_->CreateReportConfig(config);
            if (id.empty())
            {
                throw middleware::ApiException(500, "创建报表配置失败");
            }

            json response = {{"id", id},
                             {"message", "报表配置创建成功"}};
            res.status = 201;
            res.body = response.dump();
        }
        catch (const middleware::ApiException &)
        {
            throw;
        }
        catch (const json::exception &e)
        {
            std::cerr << "Error: " << __FILE__ << ":" << __LINE__ << " " << e.what() << std::endl;
            throw middleware::ValidationException("无效的请求数据格式");
        }
        catch (const std::exception &e)
        {
            std::cerr << "Error: " << __FILE__ << ":" << __LINE__ << " " << e.what() << std::endl;
            throw middleware::ApiException(500, "创建报表配置失败: " + std::string(e.what()));
        }
    }

    void FinanceController::HandleUpdateReportConfig(const httplib::Request &req, httplib::Response &res)
    {
        try
        {
            std::string id = ExtractIdFromPath(req.path);
            auto request_data = json::parse(req.body);

            if (!ValidateReportConfigData(request_data))
            {
                throw middleware::ValidationException("报表配置数据验证失败");
            }

            models::ReportConfig config(
                id,
                request_data["name"],
                StringToReportType(request_data["type"]),
                request_data["metrics"].get<std::vector<std::string>>(),
                request_data["includeDateRange"],
                request_data["includeStore"],
                request_data["includeCategory"],
                request_data["includePaymentMethod"],
                StringToReportFrequency(request_data["scheduleFrequency"]),
                request_data["recipients"].get<std::vector<std::string>>());

            if (!finance_service_->UpdateReportConfig(id, config))
            {
                throw middleware::ApiException(404, "报表配置不存在");
            }

            json response = {{"message", "报表配置更新成功"}};
            res.body = response.dump();
        }
        catch (const middleware::ApiException &)
        {
            throw;
        }
        catch (const json::exception &e)
        {
            std::cerr << "Error: " << __FILE__ << ":" << __LINE__ << " " << e.what() << std::endl;
            throw middleware::ValidationException("无效的请求数据格式");
        }
        catch (const std::exception &e)
        {
            std::cerr << "Error: " << __FILE__ << ":" << __LINE__ << " " << e.what() << std::endl;
            throw middleware::ApiException(500, "更新报表配置失败: " + std::string(e.what()));
        }
    }

    void FinanceController::HandleDeleteReportConfig(const httplib::Request &req, httplib::Response &res)
    {
        try
        {
            std::string id = ExtractIdFromPath(req.path);

            if (!finance_service_->DeleteReportConfig(id))
            {
                throw middleware::ApiException(404, "报表配置不存在");
            }

            json response = {{"message", "报表配置删除成功"}};
            res.body = response.dump();
        }
        catch (const middleware::ApiException &)
        {
            throw;
        }
        catch (const std::exception &e)
        {
            std::cerr << "Error: " << __FILE__ << ":" << __LINE__ << " " << e.what() << std::endl;
            throw middleware::ApiException(500, "删除报表配置失败: " + std::string(e.what()));
        }
    }

    void FinanceController::HandleGenerateReport(const httplib::Request &req, httplib::Response &res)
    {
        try
        {
            auto request_data = json::parse(req.body);

            if (!request_data.contains("configId") ||
                !request_data.contains("startDate") ||
                !request_data.contains("endDate"))
            {
                throw middleware::ValidationException("缺少必要的参数");
            }

            std::string config_id = request_data["configId"];
            std::string start_date = request_data["startDate"];
            std::string end_date = request_data["endDate"];

            if (!ValidateDateRange(start_date, end_date))
            {
                throw middleware::ValidationException("无效的日期范围");
            }

            std::string report_id = finance_service_->GenerateReport(config_id, start_date, end_date);
            if (report_id.empty())
            {
                throw middleware::ApiException(500, "生成报表失败");
            }

            json response = {
                {"reportId", report_id},
                {"message", "报表生成成功"}};
            res.body = response.dump();
        }
        catch (const middleware::ApiException &)
        {
            throw;
        }
        catch (const json::exception &e)
        {
            std::cerr << "Error: " << __FILE__ << ":" << __LINE__ << " " << e.what() << std::endl;
            throw middleware::ValidationException("无效的请求数据格式");
        }
        catch (const std::exception &e)
        {
            std::cerr << "Error: " << __FILE__ << ":" << __LINE__ << " " << e.what() << std::endl;
            throw middleware::ApiException(500, "生成报表失败: " + std::string(e.what()));
        }
    }

    // 工具方法实现
    std::string FinanceController::ExtractIdFromPath(const std::string &path)
    {
        try
        {
            size_t last_slash = path.find_last_of('/');
            if (last_slash != std::string::npos)
            {
                return path.substr(last_slash + 1);
            }
            return "";
        }
        catch (const std::exception &e)
        {
            std::cerr << "Error: " << __FILE__ << ":" << __LINE__ << " " << e.what() << std::endl;
            throw middleware::ApiException(500, "提取ID失败: " + std::string(e.what()));
        }
    }

    bool FinanceController::ValidateDateRange(const std::string &start_date, const std::string &end_date)
    {
        return utils::DateValidator::IsValidDateRange(start_date, end_date);
    }

    json FinanceController::FinancialStatsToJson(const models::FinancialStats &stats)
    {
        return {
            {"totalRevenue", stats.GetTotalRevenue()},
            {"totalProfit", stats.GetTotalProfit()},
            {"totalCost", stats.GetTotalCost()},
            {"orderCount", stats.GetOrderCount()},
            {"averageOrderValue", stats.GetAverageOrderValue()}};
    }

    bool FinanceController::ValidateSettlementData(const json &data)
    {
        try
        {
            return data.contains("storeId") &&
                   data.contains("periodStart") &&
                   data.contains("periodEnd") &&
                   data.contains("amount") &&
                   data.contains("bankAccount") &&
                   data.contains("bankName") &&
                   data["amount"].is_number() &&
                   data["amount"].get<double>() > 0;
        }
        catch (const std::exception &e)
        {
            std::cerr << "Error: " << __FILE__ << ":" << __LINE__ << " " << e.what() << std::endl;
            throw middleware::ApiException(500, "验证结算数据失败: " + std::string(e.what()));
        }
    }

    json FinanceController::SettlementToJson(const models::StoreSettlement &settlement)
    {
        try
        {
            std::string status;
            switch (settlement.GetStatus())
            {
            case models::StoreSettlement::Status::PENDING:
                status = "pending";
                break;
            case models::StoreSettlement::Status::COMPLETED:
                status = "completed";
                break;
            case models::StoreSettlement::Status::FAILED:
                status = "failed";
                break;
            }

            return {{"id", settlement.GetId()},
                    {"storeId", settlement.GetStoreId()},
                    {"periodStart", settlement.GetPeriodStart()},
                    {"periodEnd", settlement.GetPeriodEnd()},
                    {"amount", settlement.GetAmount()},
                    {"status", status},
                    {"bankAccount", settlement.GetBankAccount()},
                    {"bankName", settlement.GetBankName()},
                    {"remark", settlement.GetRemark()}};
        }
        catch (const std::exception &e)
        {
            std::cerr << "Error: " << __FILE__ << ":" << __LINE__ << " " << e.what() << std::endl;
            throw middleware::ApiException(500, "获取结算记录数据失败: " + std::string(e.what()));
        }
    }

    bool FinanceController::ValidateReportConfigData(const json &data)
    {
        return data.contains("name") &&
               data.contains("type") &&
               data.contains("metrics") &&
               data.contains("includeDateRange") &&
               data.contains("includeStore") &&
               data.contains("includeCategory") &&
               data.contains("includePaymentMethod") &&
               data.contains("scheduleFrequency") &&
               data.contains("recipients") &&
               data["metrics"].is_array() &&
               data["recipients"].is_array();
    }

    json FinanceController::ReportConfigToJson(const models::ReportConfig &config)
    {
        try
        {
            return {
                {"id", config.GetId()},
                {"name", config.GetName()},
                {"type", ReportTypeToString(config.GetType())},
                {"metrics", config.GetMetrics()},
                {"includeDateRange", config.IncludeDateRange()},
                {"includeStore", config.IncludeStore()},
                {"includeCategory", config.IncludeCategory()},
                {"includePaymentMethod", config.IncludePaymentMethod()},
                {"scheduleFrequency", ReportFrequencyToString(config.GetScheduleFrequency())},
                {"recipients", config.GetRecipients()}};
        }
        catch (const std::exception &e)
        {
            std::cerr << "Error: " << __FILE__ << ":" << __LINE__ << " " << e.what() << std::endl;
            throw middleware::ApiException(500, "获取报表配置数据失败: " + std::string(e.what()));
        }
    }

    models::ReportConfig::Type FinanceController::StringToReportType(const std::string &type)
    {
        if (type == "revenue")
            return models::ReportConfig::Type::REVENUE;
        else if (type == "settlement")
            return models::ReportConfig::Type::SETTLEMENT;
        else if (type == "custom")
            return models::ReportConfig::Type::CUSTOM;
        throw middleware::ValidationException("无效的报表类型");
    }

    models::ReportConfig::Frequency FinanceController::StringToReportFrequency(const std::string &frequency)
    {
        if (frequency == "daily")
            return models::ReportConfig::Frequency::DAILY;
        else if (frequency == "weekly")
            return models::ReportConfig::Frequency::WEEKLY;
        else if (frequency == "monthly")
            return models::ReportConfig::Frequency::MONTHLY;
        throw middleware::ValidationException("无效的报表频率");
    }

    std::string FinanceController::ReportTypeToString(models::ReportConfig::Type type)
    {
        switch (type)
        {
        case models::ReportConfig::Type::REVENUE:
            return "revenue";
        case models::ReportConfig::Type::SETTLEMENT:
            return "settlement";
        case models::ReportConfig::Type::CUSTOM:
            return "custom";
        default:
            return "unknown";
        }
    }

    std::string FinanceController::ReportFrequencyToString(models::ReportConfig::Frequency frequency)
    {
        switch (frequency)
        {
        case models::ReportConfig::Frequency::DAILY:
            return "daily";
        case models::ReportConfig::Frequency::WEEKLY:
            return "weekly";
        case models::ReportConfig::Frequency::MONTHLY:
            return "monthly";
        default:
            return "unknown";
        }
    }
}