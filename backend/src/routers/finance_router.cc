#include "routers/finance_router.h"

namespace router
{
    FinanceRouter::FinanceRouter(std::shared_ptr<httplib::Server> server)
        : server_(server)
    {
        finance_controller_ = std::make_unique<controllers::FinanceController>();
    }

    void FinanceRouter::InitializeRoutes()
    {
        // 财务统计接口
        server_->Get("/finance/revenue-stats", [this](const httplib::Request &req, httplib::Response &res)
                     { finance_controller_->GetRevenueStats(req, res); });
        // 支出统计接口
        server_->Get("/finance/expense-stats", [this](const httplib::Request &req, httplib::Response &res)
                     { finance_controller_->GetExpenseStats(req, res); });
        // 利润统计接口
        server_->Get("/finance/profit-stats", [this](const httplib::Request &req, httplib::Response &res)
                     { finance_controller_->GetProfitStats(req, res); });
        // 门店结算接口
        server_->Post("/finance/settlements", [this](const httplib::Request &req, httplib::Response &res)
                      { finance_controller_->CreateSettlement(req, res); });
        // 获取门店结算列表
        server_->Get("/finance/settlements", [this](const httplib::Request &req, httplib::Response &res)
                     { finance_controller_->GetSettlements(req, res); });
        // 获取门店结算详情
        server_->Get("/finance/settlements/:id", [this](const httplib::Request &req, httplib::Response &res)
                     { finance_controller_->GetSettlementById(req, res); });
        // 更新门店结算状态
        server_->Put("/finance/settlements/:id", [this](const httplib::Request &req, httplib::Response &res)
                     { finance_controller_->UpdateSettlementStatus(req, res); });
        // 报表配置接口
        server_->Post("/finance/report-configs", [this](const httplib::Request &req, httplib::Response &res)
                      { finance_controller_->CreateReportConfig(req, res); });
        // 获取报表配置列表
        server_->Get("/finance/report-configs", [this](const httplib::Request &req, httplib::Response &res)
                     { finance_controller_->GetReportConfigs(req, res); });
        // 更新报表配置
        server_->Put("/finance/report-configs/:id", [this](const httplib::Request &req, httplib::Response &res)
                     { finance_controller_->UpdateReportConfig(req, res); });
        // 删除报表配置
        server_->Delete("/finance/report-configs/:id", [this](const httplib::Request &req, httplib::Response &res)
                        { finance_controller_->DeleteReportConfig(req, res); });
        // 生成报表
        server_->Post("/finance/reports", [this](const httplib::Request &req, httplib::Response &res)
                      { finance_controller_->GenerateReport(req, res); });
        // 获取报表历史
        server_->Get("/finance/reports/:id", [this](const httplib::Request &req, httplib::Response &res)
                     { finance_controller_->GetReportHistory(req, res); });
        // 财务统计接口
        server_->Get("/finance/stats", [this](const httplib::Request &req, httplib::Response &res)
                     { finance_controller_->GetFinancialStats(req, res); });
        // 支出统计接口
        server_->Get("/finance/payment-stats", [this](const httplib::Request &req, httplib::Response &res)
                     { finance_controller_->GetPaymentStats(req, res); });
        // 每日记录接口
        server_->Get("/finance/daily-records", [this](const httplib::Request &req, httplib::Response &res)
                     { finance_controller_->GetDailyRecords(req, res); });
        // 导出报表接口
        server_->Get("/finance/export-report", [this](const httplib::Request &req, httplib::Response &res)
                     { finance_controller_->ExportFinancialReport(req, res); });
    }
}