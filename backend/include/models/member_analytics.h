#ifndef MODELS_MEMBER_ANALYTICS_H_
#define MODELS_MEMBER_ANALYTICS_H_

#include <string>
#include <vector>
#include <map>

namespace models
{
    class MemberAnalytics
    {
    public:
        struct DailyStats
        {
            std::string date;
            int new_members;
            int active_members;
            double total_consumption;
            double average_consumption;
        };

        struct LevelDistribution
        {
            std::string level;
            int count;
            double percentage;
        };

        MemberAnalytics() = default;
        MemberAnalytics(const std::vector<DailyStats> &growth_trend,
                        const std::vector<LevelDistribution> &level_distribution,
                        double total_members,
                        double active_rate,
                        double retention_rate,
                        double average_points);

        // Getters
        const std::vector<DailyStats> &GetGrowthTrend() const { return growth_trend_; }
        const std::vector<LevelDistribution> &GetLevelDistribution() const { return level_distribution_; }
        double GetTotalMembers() const { return total_members_; }
        double GetActiveRate() const { return active_rate_; }
        double GetRetentionRate() const { return retention_rate_; }
        double GetAveragePoints() const { return average_points_; }

        // For mock data
        static MemberAnalytics CreateMockAnalytics();

    private:
        std::vector<DailyStats> growth_trend_;
        std::vector<LevelDistribution> level_distribution_;
        double total_members_;
        double active_rate_;
        double retention_rate_;
        double average_points_;
    };

} // namespace models

#endif // MODELS_MEMBER_ANALYTICS_H_