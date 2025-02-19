#ifndef MODELS_TRANSACTION_H_
#define MODELS_TRANSACTION_H_

#include <string>
#include <vector>
#include <ctime>

namespace models
{
    // 支付方式枚举
    enum class PaymentMethod
    {
        CASH,
        WECHAT,
        ALIPAY
    };

    // 交易项
    struct TransactionItem
    {
        std::string product_id;
        std::string product_name;
        double price;
        int quantity;
        double subtotal;
    };

    class Transaction
    {
    public:
        Transaction() = default;
        Transaction(const std::string &id,
                    const std::string &member_id,
                    const std::vector<TransactionItem> &items,
                    double total_amount,
                    double points_used,
                    double points_earned,
                    PaymentMethod payment_method,
                    const std::string &operator_id,
                    const std::string &timestamp);

        // Getters
        std::string GetId() const { return id_; }
        std::string GetMemberId() const { return member_id_; }
        const std::vector<TransactionItem> &GetItems() const { return items_; }
        double GetTotalAmount() const { return total_amount_; }
        double GetPointsUsed() const { return points_used_; }
        double GetPointsEarned() const { return points_earned_; }
        PaymentMethod GetPaymentMethod() const { return payment_method_; }
        std::string GetOperatorId() const { return operator_id_; }
        std::string GetTimestamp() const { return timestamp_; }

        // 业务方法
        void AddItem(const TransactionItem &item);
        void RemoveItem(const std::string &product_id);
        void UpdateItemQuantity(const std::string &product_id, int quantity);
        void CalculateTotal();
        void ApplyPointsDiscount(double points);
        void CalculateEarnedPoints();

        // For mock data
        static Transaction CreateMockTransaction(int index);

    private:
        std::string id_;
        std::string member_id_;
        std::vector<TransactionItem> items_;
        double total_amount_;
        double points_used_;
        double points_earned_;
        PaymentMethod payment_method_;
        std::string operator_id_;
        std::string timestamp_;
    };

} // namespace models

#endif // MODELS_TRANSACTION_H_