#include "services/marketing_service.h"
#include <sstream>
#include <algorithm>
#include <random>
#include <chrono>
#include <iomanip>
#include "utils/date_validator.h"
#include <iostream>
namespace services
{
    MarketingService::MarketingService()
    {
        InitializeMockData();
    }

    void MarketingService::InitializeMockData()
    {
        // 生成模拟营销活动数据
        for (int i = 0; i < 20; ++i)
        {
            mock_campaigns_.push_back(models::Campaign::CreateMockCampaign(i));
        }

        // 生成模拟会员分群数据
        for (int i = 0; i < 10; ++i)
        {
            mock_segments_.push_back(models::MemberSegment::CreateMockSegment(i));
        }
    }

    models::MemberAnalytics MarketingService::GetMemberAnalytics(
        const std::string &start_date,
        const std::string &end_date,
        const std::string &segment_id)
    {
        // 在实际项目中,这里应该根据日期范围和分群ID查询数据
        std::cout << start_date << std::endl;
        std::cout << end_date << std::endl;
        std::cout << segment_id << std::endl;
        // 现在返回模拟数据
        return models::MemberAnalytics::CreateMockAnalytics();
    }

    std::vector<models::MemberSegment> MarketingService::GetMemberSegments()
    {
        return mock_segments_;
    }

    std::string MarketingService::CreateMemberSegment(const models::MemberSegment &segment)
    {
        if (!ValidateMemberSegment(segment))
        {
            return "";
        }

        mock_segments_.push_back(segment);
        return segment.GetId();
    }

    bool MarketingService::UpdateMemberSegment(const std::string &id, const models::MemberSegment &segment)
    {
        if (!ValidateMemberSegment(segment))
        {
            return false;
        }

        auto it = std::find_if(mock_segments_.begin(), mock_segments_.end(),
                               [&id](const models::MemberSegment &s)
                               {
                                   return s.GetId() == id;
                               });

        if (it == mock_segments_.end())
        {
            return false;
        }

        *it = segment;
        return true;
    }

    bool MarketingService::DeleteMemberSegment(const std::string &id)
    {
        auto it = std::find_if(mock_segments_.begin(), mock_segments_.end(),
                               [&id](const models::MemberSegment &s)
                               {
                                   return s.GetId() == id;
                               });

        if (it == mock_segments_.end())
        {
            return false;
        }

        mock_segments_.erase(it);
        return true;
    }

    models::MemberSegment MarketingService::GetMemberSegmentById(const std::string &id)
    {
        auto it = std::find_if(mock_segments_.begin(), mock_segments_.end(),
                               [&id](const models::MemberSegment &s)
                               {
                                   return s.GetId() == id;
                               });

        if (it != mock_segments_.end())
        {
            return *it;
        }

        return models::MemberSegment();
    }

    std::vector<models::Campaign> MarketingService::GetCampaignList(
        const std::string &start_date,
        const std::string &end_date,
        const std::string &type)
    {
        std::vector<models::Campaign> filtered_campaigns;

        // 根据条件筛选活动
        for (const auto &campaign : mock_campaigns_)
        {
            bool match = true;

            if (!start_date.empty() && campaign.GetStartDate() < start_date)
            {
                match = false;
            }
            if (!end_date.empty() && campaign.GetEndDate() > end_date)
            {
                match = false;
            }
            if (!type.empty())
            {
                // 这里需要根据实际需求实现类型匹配逻辑
                // 暂时简单返回所有数据
            }

            if (match)
            {
                filtered_campaigns.push_back(campaign);
            }
        }

        return filtered_campaigns;
    }

    std::string MarketingService::CreateCampaign(const models::Campaign &campaign)
    {
        if (!ValidateCampaign(campaign))
        {
            return "";
        }

        mock_campaigns_.push_back(campaign);
        return campaign.GetId();
    }

    bool MarketingService::UpdateCampaign(const std::string &id, const models::Campaign &campaign)
    {
        if (!ValidateCampaign(campaign))
        {
            return false;
        }

        auto it = std::find_if(mock_campaigns_.begin(), mock_campaigns_.end(),
                               [&id](const models::Campaign &c)
                               {
                                   return c.GetId() == id;
                               });

        if (it == mock_campaigns_.end())
        {
            return false;
        }

        *it = campaign;
        return true;
    }

    bool MarketingService::DeleteCampaign(const std::string &id)
    {
        auto it = std::find_if(mock_campaigns_.begin(), mock_campaigns_.end(),
                               [&id](const models::Campaign &c)
                               {
                                   return c.GetId() == id;
                               });

        if (it == mock_campaigns_.end())
        {
            return false;
        }

        mock_campaigns_.erase(it);
        return true;
    }

    models::Campaign MarketingService::GetCampaignById(const std::string &id)
    {
        auto it = std::find_if(mock_campaigns_.begin(), mock_campaigns_.end(),
                               [&id](const models::Campaign &c)
                               {
                                   return c.GetId() == id;
                               });

        if (it != mock_campaigns_.end())
        {
            return *it;
        }

        return models::Campaign();
    }

    models::MarketingEffect MarketingService::GetCampaignEffect(
        const std::string &campaign_id,
        const std::string &start_date,
        const std::string &end_date)
    {
        std::cout << campaign_id << std::endl;
        std::cout << start_date << std::endl;
        std::cout << end_date << std::endl;
        // 在实际项目中,这里应该根据活动ID和日期范围查询数据
        // 现在返回模拟数据
        return models::MarketingEffect::CreateMockEffect(campaign_id);
    }

    double MarketingService::GetMarketingROI(
        const std::string &start_date,
        const std::string &end_date)
    {
        std::cout << start_date << std::endl;
        std::cout << end_date << std::endl;
        // 在实际项目中,这里应该计算指定日期范围内的营销ROI
        // 现在返回模拟数据
        return 2.5; // 250% ROI
    }

    std::vector<std::pair<std::string, double>> MarketingService::GetConversionMetrics(
        const std::string &start_date,
        const std::string &end_date)
    {
        // 在实际项目中,这里应该计算指定日期范围内的转化指标
        std::cout << start_date << std::endl;
        std::cout << end_date << std::endl;
        // 现在返回模拟数据
        return {
            {"浏览量", 10000},
            {"点击量", 5000},
            {"转化量", 1000},
            {"点击率", 0.5},
            {"转化率", 0.2}};
    }

    bool MarketingService::ValidateCampaign(const models::Campaign &campaign)
    {
        return !campaign.GetName().empty() &&
               !campaign.GetStartDate().empty() &&
               !campaign.GetEndDate().empty() &&
               campaign.GetStartDate() <= campaign.GetEndDate();
    }

    bool MarketingService::ValidateMemberSegment(const models::MemberSegment &segment)
    {
        return !segment.GetName().empty() &&
               !segment.GetRules().empty();
    }

    bool MarketingService::ValidateDateRange(const std::string &start_date, const std::string &end_date)
    {
        return utils::DateValidator::IsValidDateRange(start_date, end_date);
    }

    models::MemberSegment::Condition MarketingService::StringToSegmentCondition(const std::string &condition)
    {
        return models::MemberSegment::StringToCondition(condition);
    }

    std::string MarketingService::SegmentConditionToString(models::MemberSegment::Condition condition)
    {
        return models::MemberSegment::ConditionToString(condition);
    }
} // namespace services