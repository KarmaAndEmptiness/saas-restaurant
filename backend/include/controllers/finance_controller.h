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
        void HandleGetFinancialStats(const httplib::Request &req, httplib::Response &res);
        void HandleGetSalesTrend(const httplib::Request &req, httplib::Response &res);
        void HandleGetPaymentStats(const httplib::Request &req, httplib::Response &res);

        // 门店结算接口
        void HandleGetSettlementList(const httplib::Request &req, httplib::Response &res);
        void HandleCreateSettlement(const httplib::Request &req, httplib::Response &res);
        void HandleUpdateSettlementStatus(const httplib::Request &req, httplib::Response &res);
        void HandleGetSettlementById(const httplib::Request &req, httplib::Response &res);

        // 报表接口
        void HandleGetReportConfigs(const httplib::Request &req, httplib::Response &res);
        void HandleCreateReportConfig(const httplib::Request &req, httplib::Response &res);
        void HandleUpdateReportConfig(const httplib::Request &req, httplib::Response &res);
        void HandleDeleteReportConfig(const httplib::Request &req, httplib::Response &res);
        void HandleGenerateReport(const httplib::Request &req, httplib::Response &res);

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