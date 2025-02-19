#ifndef MODELS_MARKETING_EFFECT_H_
#define MODELS_MARKETING_EFFECT_H_

#include <string>
#include <vector>

namespace models
{
    class MarketingEffect
    {
    public:
        struct DailyEffect
        {
            std::string date;
            int participant_count;
            double total_sales;
            double discount_amount;
            double conversion_rate;
        };

        MarketingEffect() = default;
        MarketingEffect(const std::string &campaign_id,
                        const std::vector<DailyEffect> &daily_effects,
                        double total_cost,
                        double total_revenue,
                        double roi,
                        int total_participants,
                        double average_conversion_rate);

        // Getters
        std::string GetCampaignId() const { return campaign_id_; }
        const std::vector<DailyEffect> &GetDailyEffects() const { return daily_effects_; }
        double GetTotalCost() const { return total_cost_; }
        double GetTotalRevenue() const { return total_revenue_; }
        double GetROI() const { return roi_; }
        int GetTotalParticipants() const { return total_participants_; }
        double GetAverageConversionRate() const { return average_conversion_rate_; }

        // For mock data
        static MarketingEffect CreateMockEffect(const std::string &campaign_id);

    private:
        std::string campaign_id_;
        std::vector<DailyEffect> daily_effects_;
        double total_cost_;
        double total_revenue_;
        double roi_;
        int total_participants_;
        double average_conversion_rate_;
    };

} // namespace models

#endif // MODELS_MARKETING_EFFECT_H_