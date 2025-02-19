#include "models/financial_stats.h"

namespace models
{
    FinancialStats::FinancialStats(double total_revenue,
                                   double total_profit,
                                   double total_cost,
                                   int order_count,
                                   double average_order_value)
        : total_revenue_(total_revenue),
          total_profit_(total_profit),
          total_cost_(total_cost),
          order_count_(order_count),
          average_order_value_(average_order_value) {}

} // namespace models