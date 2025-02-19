#include "models/member_analytics.h"
#include <chrono>
#include <iomanip>
#include <random>

namespace models
{
    MemberAnalytics::MemberAnalytics(const std::vector<DailyStats> &growth_trend,
                                     const std::vector<LevelDistribution> &level_distribution,
                                     double total_members,
                                     double active_rate,
                                     double retention_rate,
                                     double average_points)
        : growth_trend_(growth_trend),
          level_distribution_(level_distribution),
          total_members_(total_members),
          active_rate_(active_rate),
          retention_rate_(retention_rate),
          average_points_(average_points) {}

    MemberAnalytics MemberAnalytics::CreateMockAnalytics()
    {
        std::vector<DailyStats> growth_trend;
        std::vector<LevelDistribution> level_distribution;

        // 生成最近7天的增长趋势
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
            std::uniform_int_distribution<> new_members_dis(10, 50);
            std::uniform_int_distribution<> active_members_dis(100, 500);
            std::uniform_real_distribution<> consumption_dis(5000.0, 20000.0);

            DailyStats stats;
            stats.date = ss.str();
            stats.new_members = new_members_dis(gen);
            stats.active_members = active_members_dis(gen);
            stats.total_consumption = consumption_dis(gen);
            stats.average_consumption = stats.total_consumption / stats.active_members;

            growth_trend.push_back(stats);
        }

        // 生成会员等级分布
        level_distribution = {
            {"普通会员", 1000, 0.5},
            {"银卡会员", 500, 0.25},
            {"金卡会员", 300, 0.15},
            {"白金会员", 200, 0.1}};

        return MemberAnalytics(
            growth_trend,
            level_distribution,
            2000,  // total_members
            0.35,  // active_rate
            0.8,   // retention_rate
            1500.0 // average_points
        );
    }

} // namespace models