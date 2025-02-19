#ifndef SERVICES_MARKETING_SERVICE_H_
#define SERVICES_MARKETING_SERVICE_H_

#include <string>
#include <vector>
#include <memory>
#include "models/campaign.h"
#include "models/member_analytics.h"
#include "models/member_segment.h"
#include "models/marketing_effect.h"

namespace services
{
    class MarketingService
    {
    public:
        MarketingService();

        // 会员分析相关
        models::MemberAnalytics GetMemberAnalytics(const std::string &start_date = "",
                                                   const std::string &end_date = "",
                                                   const std::string &segment_id = "");

        std::vector<models::MemberSegment> GetMemberSegments();
        std::string CreateMemberSegment(const models::MemberSegment &segment);
        bool UpdateMemberSegment(const std::string &id, const models::MemberSegment &segment);
        bool DeleteMemberSegment(const std::string &id);
        models::MemberSegment GetMemberSegmentById(const std::string &id);

        // 营销活动相关
        std::vector<models::Campaign> GetCampaignList(const std::string &start_date = "",
                                                      const std::string &end_date = "",
                                                      const std::string &type = "");
        std::string CreateCampaign(const models::Campaign &campaign);
        bool UpdateCampaign(const std::string &id, const models::Campaign &campaign);
        bool DeleteCampaign(const std::string &id);
        models::Campaign GetCampaignById(const std::string &id);

        // 效果分析相关
        models::MarketingEffect GetCampaignEffect(const std::string &campaign_id,
                                                  const std::string &start_date = "",
                                                  const std::string &end_date = "");
        double GetMarketingROI(const std::string &start_date,
                               const std::string &end_date);
        std::vector<std::pair<std::string, double>> GetConversionMetrics(
            const std::string &start_date,
            const std::string &end_date);
        models::MemberSegment::Condition StringToSegmentCondition(const std::string &condition);
        std::string SegmentConditionToString(models::MemberSegment::Condition condition);

    private:
        // 模拟数据存储
        std::vector<models::Campaign> mock_campaigns_;
        std::vector<models::MemberSegment> mock_segments_;

        // 工具方法
        void InitializeMockData();
        std::string GenerateId(const std::string &prefix);
        bool ValidateCampaign(const models::Campaign &campaign);
        bool ValidateMemberSegment(const models::MemberSegment &segment);
        bool ValidateDateRange(const std::string &start_date, const std::string &end_date);
    };

} // namespace services

#endif // SERVICES_MARKETING_SERVICE_H_