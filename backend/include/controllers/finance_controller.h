#ifndef CONTROLLERS_FINANCE_CONTROLLER_H_
#define CONTROLLERS_FINANCE_CONTROLLER_H_

#include <memory>
#include "services/finance_service.h"
#include <nlohmann/json.hpp>
#include "httplib.h"
namespace controllers
{
    class FinanceController
    {
    public:
        FinanceController();

        // 财务统计接口
        void GetFinancialStats(const httplib::Request &req, httplib::Response &res);
        // 收入统计接口
        void GetRevenueStats(const httplib::Request &req, httplib::Response &res);
        // 支出统计接口
        void GetExpenseStats(const httplib::Request &req, httplib::Response &res);
        // 利润统计接口
        void GetProfitStats(const httplib::Request &req, httplib::Response &res);
        // 支付方式统计接口
        void GetPaymentStats(const httplib::Request &req, httplib::Response &res);
        // 每日记录接口
        void GetDailyRecords(const httplib::Request &req, httplib::Response &res);
        // 导出财务报表接口
        void ExportFinancialReport(const httplib::Request &req, httplib::Response &res);

        // 门店结算接口
        void GetSettlements(const httplib::Request &req, httplib::Response &res);
        void CreateSettlement(const httplib::Request &req, httplib::Response &res);
        void UpdateSettlementStatus(const httplib::Request &req, httplib::Response &res);
        void GetSettlementById(const httplib::Request &req, httplib::Response &res);

        // 报表接口
        void GetReportConfigs(const httplib::Request &req, httplib::Response &res);
        void CreateReportConfig(const httplib::Request &req, httplib::Response &res);
        void UpdateReportConfig(const httplib::Request &req, httplib::Response &res);
        void DeleteReportConfig(const httplib::Request &req, httplib::Response &res);
        void GenerateReport(const httplib::Request &req, httplib::Response &res);
        void GetReportHistory(const httplib::Request &req, httplib::Response &res);
        void GetSalesTrend(const httplib::Request &req, httplib::Response &res);

    private:
        std::unique_ptr<services::FinanceService> finance_service_;

        // 工具方法
        std::string ExtractIdFromPath(const std::string &path);
        bool ValidateSettlementData(const nlohmann::json &data);
        bool ValidateReportConfigData(const nlohmann::json &data);
        bool ValidateDateRange(const std::string &start_date, const std::string &end_date);
        nlohmann::json FinancialStatsToJson(const models::FinancialStats &stats);
        nlohmann::json SettlementToJson(const models::StoreSettlement &settlement);
        nlohmann::json ReportConfigToJson(const models::ReportConfig &config);

        // 辅助方法
        models::ReportConfig::Type StringToReportType(const std::string &type);
        models::ReportConfig::Frequency StringToReportFrequency(const std::string &frequency);
        std::string ReportTypeToString(models::ReportConfig::Type type);
        std::string ReportFrequencyToString(models::ReportConfig::Frequency frequency);
    };

} // namespace controllers

#endif // CONTROLLERS_FINANCE_CONTROLLER_H_