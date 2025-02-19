#ifndef SERVICES_CASHIER_SERVICE_H_
#define SERVICES_CASHIER_SERVICE_H_

#include <string>
#include <vector>
#include <memory>
#include "models/transaction.h"
#include "models/member.h"
#include "models/product.h"

namespace services
{
    class CashierService
    {
    public:
        CashierService();

        // 交易相关
        std::vector<models::Product> SearchProducts(const std::string &keyword);
        models::Product GetProductByCode(const std::string &code);
        std::string CreateTransaction(const models::Transaction &transaction);
        bool UpdateStock(const std::string &product_id, int quantity);
        std::string GenerateReceipt(const std::string &transaction_id);
        std::vector<models::Transaction> GetTransactionHistory(const std::string &operator_id,
                                                               const std::string &start_date = "",
                                                               const std::string &end_date = "");
        models::Transaction GetTransactionById(const std::string &transaction_id);

        // 会员相关
        models::Member GetMemberByCard(const std::string &card_number);
        models::Member GetMemberByPhone(const std::string &phone);
        models::Member GetMemberById(const std::string &member_id);
        models::Member GetMemberById(const std::string &&member_id);
        std::string CreateMember(const models::Member &member);
        bool UpdateMemberPoints(const std::string &member_id, double points_change);
        std::vector<models::Member> SearchMembers(const std::string &keyword);

        // 积分相关
        double CalculatePointsDiscount(double points);
        double CalculateEarnedPoints(const std::vector<models::TransactionItem> &items);
        std::vector<models::Transaction> GetMemberTransactions(const std::string &member_id,
                                                               const std::string &start_date = "",
                                                               const std::string &end_date = "");

    private:
        // 模拟数据存储
        std::vector<models::Product> mock_products_;
        std::vector<models::Member> mock_members_;
        std::vector<models::Transaction> mock_transactions_;

        // 工具方法
        void InitializeMockData();
        std::string GenerateId(const std::string &prefix);
        bool ValidateTransaction(const models::Transaction &transaction);
        bool ValidateMember(const models::Member &member);
    };

} // namespace services

#endif // SERVICES_CASHIER_SERVICE_H_