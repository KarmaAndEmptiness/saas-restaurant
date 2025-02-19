#ifndef MODELS_REPORT_CONFIG_H_
#define MODELS_REPORT_CONFIG_H_

#include <string>
#include <vector>

namespace models
{

    class ReportConfig
    {
    public:
        enum class Type
        {
            REVENUE,
            SETTLEMENT,
            CUSTOM
        };

        enum class Frequency
        {
            DAILY,
            WEEKLY,
            MONTHLY
        };

        ReportConfig() = default;
        ReportConfig(const std::string &id,
                     const std::string &name,
                     Type type,
                     const std::vector<std::string> &metrics,
                     bool include_date_range,
                     bool include_store,
                     bool include_category,
                     bool include_payment_method,
                     Frequency schedule_frequency,
                     const std::vector<std::string> &recipients);

        // Getters
        std::string GetId() const { return id_; }
        std::string GetName() const { return name_; }
        Type GetType() const { return type_; }
        const std::vector<std::string> &GetMetrics() const { return metrics_; }
        bool IncludeDateRange() const { return include_date_range_; }
        bool IncludeStore() const { return include_store_; }
        bool IncludeCategory() const { return include_category_; }
        bool IncludePaymentMethod() const { return include_payment_method_; }
        Frequency GetScheduleFrequency() const { return schedule_frequency_; }
        const std::vector<std::string> &GetRecipients() const { return recipients_; }

        // For mock data
        static ReportConfig CreateMockConfig(int index);

    private:
        std::string id_;
        std::string name_;
        Type type_;
        std::vector<std::string> metrics_;
        bool include_date_range_;
        bool include_store_;
        bool include_category_;
        bool include_payment_method_;
        Frequency schedule_frequency_;
        std::vector<std::string> recipients_;
    };

} // namespace models

#endif // MODELS_REPORT_CONFIG_H_