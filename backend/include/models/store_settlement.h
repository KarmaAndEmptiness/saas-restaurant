#ifndef MODELS_STORE_SETTLEMENT_H_
#define MODELS_STORE_SETTLEMENT_H_

#include <string>

namespace models
{

    class StoreSettlement
    {
    public:
        enum class Status
        {
            PENDING,
            COMPLETED,
            FAILED
        };

        StoreSettlement() = default;
        StoreSettlement(const std::string &id,
                        const std::string &store_id,
                        const std::string &period_start,
                        const std::string &period_end,
                        double amount,
                        Status status,
                        const std::string &bank_account,
                        const std::string &bank_name,
                        const std::string &remark);

        // Getters
        std::string GetId() const { return id_; }
        std::string GetStoreId() const { return store_id_; }
        std::string GetPeriodStart() const { return period_start_; }
        std::string GetPeriodEnd() const { return period_end_; }
        double GetAmount() const { return amount_; }
        Status GetStatus() const { return status_; }
        std::string GetBankAccount() const { return bank_account_; }
        std::string GetBankName() const { return bank_name_; }
        std::string GetRemark() const { return remark_; }

        // For mock data
        static StoreSettlement CreateMockSettlement(int index);

    private:
        std::string id_;
        std::string store_id_;
        std::string period_start_;
        std::string period_end_;
        double amount_;
        Status status_;
        std::string bank_account_;
        std::string bank_name_;
        std::string remark_;
    };

} // namespace models

#endif // MODELS_STORE_SETTLEMENT_H_