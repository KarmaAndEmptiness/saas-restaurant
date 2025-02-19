#include "models/marketing_effect.h"
#include <chrono>
#include <iomanip>
#include <random>

namespace models
{
    MarketingEffect::MarketingEffect(const std::string &campaign_id,
                                     const std::vector<DailyEffect> &daily_effects,
                                     double total_cost,
                                     double total_revenue,
                                     double roi,
                                     int total_participants,
                                     double average_conversion_rate)
        : campaign_id_(campaign_id),
          daily_effects_(daily_effects),
          total_cost_(total_cost),
          total_revenue_(total_revenue),
          roi_(roi),
          total_participants_(total_participants),
          average_conversion_rate_(average_conversion_rate) {}

    MarketingEffect MarketingEffect::CreateMockEffect(const std::string &campaign_id)
    {
        std::vector<DailyEffect> daily_effects;

        // 生成最近7天的效果数据
        for (int i = 0; i < 7; ++i)
        {
            auto now = std::chrono::system_clock::now();
            auto time = now - std::chrono::hours(24 * i);
            auto time_t = std::chrono::system_clock::to_time_t(time);

            std::stringstream ss;
            ss << std::put_time(std::localtime(&time_t), "%Y-%m-%d");

            // 生成随机数据
            std::random_device rd;
            std::mt19937 gen(rd());
            std::uniform_int_distribution<> participant_dis(50, 200);
            std::uniform_real_distribution<> sales_dis(5000.0, 20000.0);
            std::uniform_real_distribution<> discount_dis(500.0, 2000.0);
            std::uniform_real_distribution<> conversion_dis(0.1, 0.4);

            DailyEffect effect;
            effect.date = ss.str();
            effect.participant_count = participant_dis(gen);
            effect.total_sales = sales_dis(gen);
            effect.discount_amount = discount_dis(gen);
            effect.conversion_rate = conversion_dis(gen);

            daily_effects.push_back(effect);
        }

        // 计算总计数据
        double total_cost = 0;
        double total_revenue = 0;
        int total_participants = 0;
        double total_conversion_rate = 0;

        for (const auto &effect : daily_effects)
        {
            total_cost += effect.discount_amount;
            total_revenue += effect.total_sales;
            total_participants += effect.participant_count;
            total_conversion_rate += effect.conversion_rate;
        }

        double roi = (total_revenue - total_cost) / total_cost;
        double average_conversion_rate = total_conversion_rate / daily_effects.size();

        return MarketingEffect(
            campaign_id,
            daily_effects,
            total_cost,
            total_revenue,
            roi,
            total_participants,
            average_conversion_rate);
    }

} // namespace models