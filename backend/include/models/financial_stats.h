#ifndef MODELS_FINANCIAL_STATS_H_
#define MODELS_FINANCIAL_STATS_H_

#include <string>
#include <vector>

namespace models
{

    class FinancialStats
    {
    public:
        FinancialStats() = default;
        FinancialStats(double total_revenue,
                       double total_profit,
                       double total_cost,
                       int order_count,
                       double average_order_value);

        // Getters
        double GetTotalRevenue() const { return total_revenue_; }
        double GetTotalProfit() const { return total_profit_; }
        double GetTotalCost() const { return total_cost_; }
        int GetOrderCount() const { return order_count_; }
        double GetAverageOrderValue() const { return average_order_value_; }

    private:
        double total_revenue_;
        double total_profit_;
        double total_cost_;
        int order_count_;
        double average_order_value_;
    };

} // namespace models

#endif // MODELS_FINANCIAL_STATS_H_