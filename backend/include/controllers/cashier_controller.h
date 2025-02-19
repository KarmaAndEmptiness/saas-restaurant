#ifndef CONTROLLERS_CASHIER_CONTROLLER_H_
#define CONTROLLERS_CASHIER_CONTROLLER_H_

#include <memory>
#include "services/cashier_service.h"
#include "nlohmann/json.hpp"
#include "httplib.h"
namespace controllers
{
    class CashierController
    {
    public:
        CashierController();

        // 交易相关接口
        void HandleSearchProducts(const httplib::Request &req, httplib::Response &res);
        void HandleGetProductByCode(const httplib::Request &req, httplib::Response &res);
        void HandleCreateTransaction(const httplib::Request &req, httplib::Response &res);
        void HandleGetTransactionHistory(const httplib::Request &req, httplib::Response &res);
        void HandleGenerateReceipt(const httplib::Request &req, httplib::Response &res);

        // 会员相关接口
        void HandleGetMemberByCard(const httplib::Request &req, httplib::Response &res);
        void HandleGetMemberByPhone(const httplib::Request &req, httplib::Response &res);
        void HandleCreateMember(const httplib::Request &req, httplib::Response &res);
        void HandleSearchMembers(const httplib::Request &req, httplib::Response &res);

        // 积分相关接口
        void HandleCalculatePointsDiscount(const httplib::Request &req, httplib::Response &res);
        void HandleGetMemberTransactions(const httplib::Request &req, httplib::Response &res);
        void HandleUpdateMemberPoints(const httplib::Request &req, httplib::Response &res);

    private:
        std::unique_ptr<services::CashierService> cashier_service_;

        // 工具方法
        bool ValidateTransactionData(const nlohmann::json &data);
        bool ValidateMemberData(const nlohmann::json &data);
        std::string ExtractIdFromPath(const std::string &path);
        models::Transaction JsonToTransaction(const nlohmann::json &data);
        models::Member JsonToMember(const nlohmann::json &data);
        nlohmann::json TransactionToJson(const models::Transaction &transaction);
        nlohmann::json MemberToJson(const models::Member &member);
        nlohmann::json ProductToJson(const models::Product &product);

        // 新增验证方法
        bool ValidatePointsOperation(const std::string &member_id, double points);
        bool ValidateOperatorId(const std::string &operator_id);
        bool ValidateProductStock(const std::string &product_id, int quantity);
        bool ValidatePaymentAmount(double total_amount, double points_used);
    };

} // namespace controllers

#endif // CONTROLLERS_CASHIER_CONTROLLER_H_