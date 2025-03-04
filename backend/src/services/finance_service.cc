#include "services/finance_service.h"
#include <sstream>
#include <algorithm>
#include <random>
#include <chrono>
#include <iomanip>
#include <iostream>
namespace services
{
    FinanceService::FinanceService()
    {
        InitializeMockData();
    }

    void FinanceService::InitializeMockData()
    {
        // 生成模拟结算数据
        for (int i = 0; i < 20; ++i)
        {
            mock_settlements_.push_back(models::StoreSettlement::CreateMockSettlement(i));
        }

        // 生成模拟报表配置
        for (int i = 0; i < 10; ++i)
        {
            mock_report_configs_.push_back(models::ReportConfig::CreateMockConfig(i));
        }
    }
    // 获取财务统计数据
    models::FinancialStats FinanceService::GetFinancialStats(
        const std::string &start_date,
        const std::string &end_date,
        const std::string &store_id)
    {
        std::cout << start_date << std::endl;
        std::cout << end_date << std::endl;
        std::cout << store_id << std::endl;
        // 模拟数据生成
        std::random_device rd;
        std::mt19937 gen(rd());
        std::uniform_real_distribution<> revenue_dis(50000.0, 100000.0);
        std::uniform_real_distribution<> profit_rate_dis(0.2, 0.4);
        std::uniform_int_distribution<> order_dis(500, 1000);

        double total_revenue = revenue_dis(gen);
        double profit_rate = profit_rate_dis(gen);
        double total_profit = total_revenue * profit_rate;
        double total_cost = total_revenue - total_profit;
        int order_count = order_dis(gen);
        double average_order_value = total_revenue / order_count;

        return models::FinancialStats(
            total_revenue,
            total_profit,
            total_cost,
            order_count,
            average_order_value);
    }
    // 获取销售趋势数据
    std::vector<std::pair<std::string, double>> FinanceService::GetSalesTrend(
        const std::string &start_date,
        const std::string &end_date,
        const std::string &store_id)
    {
        std::vector<std::pair<std::string, double>> trend;

        std::cout << start_date << std::endl;
        std::cout << end_date << std::endl;
        std::cout << store_id << std::endl;
        // 生成最近7天的销售趋势数据
        for (int i = 0; i < 7; ++i)
        {
            auto now = std::chrono::system_clock::now();
            auto time = now - std::chrono::hours(24 * i);
            auto time_t = std::chrono::system_clock::to_time_t(time);

            std::stringstream ss;
            ss << std::put_time(std::localtime(&time_t), "%Y-%m-%d");

            // 生成随机销售额
            std::random_device rd;
            std::mt19937 gen(rd());
            std::uniform_real_distribution<> dis(8000.0, 15000.0);

            trend.push_back({ss.str(), dis(gen)});
        }

        return trend;
    }
    // 获取支付方式统计数据
    std::vector<std::pair<std::string, double>> FinanceService::GetPaymentStats(
        const std::string &start_date,
        const std::string &end_date,
        const std::string &store_id)
    {
        std::vector<std::pair<std::string, double>> stats;

        std::cout << start_date << std::endl;
        std::cout << end_date << std::endl;
        std::cout << store_id << std::endl;
        // 模拟支付方式统计数据
        stats.push_back({"微信支付", 45.0});
        stats.push_back({"支付宝", 35.0});
        stats.push_back({"现金", 15.0});
        stats.push_back({"银行卡", 5.0});

        return stats;
    }
    // 获取门店结算列表
    std::vector<models::StoreSettlement> FinanceService::GetSettlementList(
        const std::string &start_date,
        const std::string &end_date,
        const std::string &store_id)
    {
        std::vector<models::StoreSettlement> filtered_settlements;

        // 根据条件筛选结算记录
        for (const auto &settlement : mock_settlements_)
        {
            bool match = true;

            if (!start_date.empty() && settlement.GetPeriodStart() < start_date)
            {
                match = false;
            }
            if (!end_date.empty() && settlement.GetPeriodEnd() > end_date)
            {
                match = false;
            }
            if (!store_id.empty() && settlement.GetStoreId() != store_id)
            {
                match = false;
            }

            if (match)
            {
                filtered_settlements.push_back(settlement);
            }
        }

        return filtered_settlements;
    }
    // 创建门店结算
    std::string FinanceService::CreateSettlement(const models::StoreSettlement &settlement)
    {
        if (!ValidateSettlement(settlement))
        {
            return "";
        }

        mock_settlements_.push_back(settlement);
        return settlement.GetId();
    }
    // 更新门店结算状态
    bool FinanceService::UpdateSettlementStatus(const std::string &id, models::StoreSettlement::Status status)
    {
        auto it = std::find_if(mock_settlements_.begin(), mock_settlements_.end(),
                               [&id](const models::StoreSettlement &s)
                               {
                                   return s.GetId() == id;
                               });

        if (it == mock_settlements_.end())
        {
            return false;
        }

        // 在实际项目中,这里应该创建一个新的Settlement对象
        // 现在为了演示,我们直接修改status
        const_cast<models::StoreSettlement &>(*it) =
            models::StoreSettlement(
                it->GetId(),
                it->GetStoreId(),
                it->GetPeriodStart(),
                it->GetPeriodEnd(),
                it->GetAmount(),
                status,
                it->GetBankAccount(),
                it->GetBankName(),
                it->GetRemark());

        return true;
    }
    // 获取门店结算详情
    models::StoreSettlement FinanceService::GetSettlementById(const std::string &id)
    {
        auto it = std::find_if(mock_settlements_.begin(), mock_settlements_.end(),
                               [&id](const models::StoreSettlement &s)
                               {
                                   return s.GetId() == id;
                               });

        if (it != mock_settlements_.end())
        {
            return *it;
        }

        return models::StoreSettlement();
    }
    // 获取报表配置列表
    std::vector<models::ReportConfig> FinanceService::GetReportConfigs()
    {
        return mock_report_configs_;
    }

    std::string FinanceService::CreateReportConfig(const models::ReportConfig &config)
    {
        if (!ValidateReportConfig(config))
        {
            return "";
        }

        mock_report_configs_.push_back(config);
        return config.GetId();
    }
    // 更新报表配置
    bool FinanceService::UpdateReportConfig(const std::string &id, const models::ReportConfig &config)
    {
        auto it = std::find_if(mock_report_configs_.begin(), mock_report_configs_.end(),
                               [&id](const models::ReportConfig &c)
                               {
                                   return c.GetId() == id;
                               });

        if (it == mock_report_configs_.end())
        {
            return false;
        }

        *it = config;
        return true;
    }
    // 删除报表配置
    bool FinanceService::DeleteReportConfig(const std::string &id)
    {
        auto it = std::find_if(mock_report_configs_.begin(), mock_report_configs_.end(),
                               [&id](const models::ReportConfig &c)
                               {
                                   return c.GetId() == id;
                               });

        if (it == mock_report_configs_.end())
        {
            return false;
        }

        mock_report_configs_.erase(it);
        return true;
    }
    // 生成报表
    std::string FinanceService::GenerateReport(
        const std::string &config_id,
        const std::string &start_date,
        const std::string &end_date)
    {
        // 在实际项目中,这里应该根据配置生成报表
        // 现在返回一个模拟的报表ID
        return "REPORT" + config_id + "_" + start_date + "_" + end_date;
    }
    // 获取报表历史
    std::vector<models::ReportConfig> FinanceService::GetReportHistory(const std::string &config_id)
    {
        std::vector<models::ReportConfig> history;
        for (const auto &config : mock_report_configs_)
        {
            if (config.GetId() == config_id)
            {
                history.push_back(config);
            }
        }
        return history;
    }
    // 验证结算数据
    bool FinanceService::ValidateSettlement(const models::StoreSettlement &settlement)
    {
        // 验证结算数据
        if (settlement.GetStoreId().empty() ||
            settlement.GetPeriodStart().empty() ||
            settlement.GetPeriodEnd().empty() ||
            settlement.GetAmount() <= 0)
        {
            return false;
        }
        return true;
    }

    bool FinanceService::ValidateReportConfig(const models::ReportConfig &config)
    {
        // 验证报表配置
        if (config.GetName().empty() ||
            config.GetMetrics().empty())
        {
            return false;
        }
        return true;
    }

} // namespace services