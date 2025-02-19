#ifndef SERVICES_FINANCE_SERVICE_H_
#define SERVICES_FINANCE_SERVICE_H_

#include <string>
#include <vector>
#include <memory>
#include "models/financial_stats.h"
#include "models/store_settlement.h"
#include "models/report_config.h"

namespace services
{
    class FinanceService
    {
    public:
        FinanceService();

        // 财务统计相关
        models::FinancialStats GetFinancialStats(const std::string &start_date = "",
                                                 const std::string &end_date = "",
                                                 const std::string &store_id = "");

        std::vector<std::pair<std::string, double>> GetSalesTrend(
            const std::string &start_date,
            const std::string &end_date,
            const std::string &store_id = "");

        std::vector<std::pair<std::string, double>> GetPaymentStats(
            const std::string &start_date,
            const std::string &end_date,
            const std::string &store_id = "");

        // 门店结算相关
        std::vector<models::StoreSettlement> GetSettlementList(
            const std::string &start_date = "",
            const std::string &end_date = "",
            const std::string &store_id = "");

        std::string CreateSettlement(const models::StoreSettlement &settlement);
        bool UpdateSettlementStatus(const std::string &id, models::StoreSettlement::Status status);
        models::StoreSettlement GetSettlementById(const std::string &id);

        // 报表相关
        std::vector<models::ReportConfig> GetReportConfigs();
        std::string CreateReportConfig(const models::ReportConfig &config);
        bool UpdateReportConfig(const std::string &id, const models::ReportConfig &config);
        bool DeleteReportConfig(const std::string &id);
        std::string GenerateReport(const std::string &config_id,
                                   const std::string &start_date,
                                   const std::string &end_date);

    private:
        // 模拟数据存储
        std::vector<models::StoreSettlement> mock_settlements_;
        std::vector<models::ReportConfig> mock_report_configs_;

        // 工具方法
        void InitializeMockData();
        std::string GenerateId(const std::string &prefix);
        bool ValidateSettlement(const models::StoreSettlement &settlement);
        bool ValidateReportConfig(const models::ReportConfig &config);
    };

} // namespace services

#endif // SERVICES_FINANCE_SERVICE_H_