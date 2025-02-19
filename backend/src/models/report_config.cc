#include "models/report_config.h"
#include <sstream>

namespace models
{
    ReportConfig::ReportConfig(const std::string &id,
                               const std::string &name,
                               Type type,
                               const std::vector<std::string> &metrics,
                               bool include_date_range,
                               bool include_store,
                               bool include_category,
                               bool include_payment_method,
                               Frequency schedule_frequency,
                               const std::vector<std::string> &recipients)
        : id_(id),
          name_(name),
          type_(type),
          metrics_(metrics),
          include_date_range_(include_date_range),
          include_store_(include_store),
          include_category_(include_category),
          include_payment_method_(include_payment_method),
          schedule_frequency_(schedule_frequency),
          recipients_(recipients) {}

    ReportConfig ReportConfig::CreateMockConfig(int index)
    {
        std::stringstream ss;
        ss << index;
        std::string idx = ss.str();

        std::vector<std::string> metrics;
        std::vector<std::string> recipients;

        // 根据不同类型生成不同的配置
        switch (index % 3)
        {
        case 0: // 收入报表
            metrics = {"date", "store", "revenue", "order_count"};
            recipients = {"finance@example.com"};
            return ReportConfig(
                "r" + idx,
                "收入日报表",
                Type::REVENUE,
                metrics,
                true,  // include_date_range
                true,  // include_store
                false, // include_category
                false, // include_payment_method
                Frequency::DAILY,
                recipients);

        case 1: // 结算报表
            metrics = {"store", "period", "amount", "status"};
            recipients = {"finance@example.com", "store@example.com"};
            return ReportConfig(
                "r" + idx,
                "门店结算月报",
                Type::SETTLEMENT,
                metrics,
                true,  // include_date_range
                true,  // include_store
                false, // include_category
                false, // include_payment_method
                Frequency::MONTHLY,
                recipients);

        default: // 自定义报表
            metrics = {"date", "store", "category", "payment_method", "amount"};
            recipients = {"manager@example.com"};
            return ReportConfig(
                "r" + idx,
                "销售分析报表",
                Type::CUSTOM,
                metrics,
                true, // include_date_range
                true, // include_store
                true, // include_category
                true, // include_payment_method
                Frequency::WEEKLY,
                recipients);
        }
    }

} // namespace models