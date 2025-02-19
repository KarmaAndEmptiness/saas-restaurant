#ifndef CONTROLLERS_MARKETING_CONTROLLER_H_
#define CONTROLLERS_MARKETING_CONTROLLER_H_

#include <memory>
#include "services/marketing_service.h"
#include <nlohmann/json.hpp>
#include "httplib.h"
namespace controllers
{
    class MarketingController
    {
    public:
        MarketingController();

        // 会员分析接口
        void HandleGetMemberAnalytics(const httplib::Request &req, httplib::Response &res);
        void HandleGetMemberSegments(const httplib::Request &req, httplib::Response &res);
        void HandleCreateMemberSegment(const httplib::Request &req, httplib::Response &res);
        void HandleUpdateMemberSegment(const httplib::Request &req, httplib::Response &res);
        void HandleDeleteMemberSegment(const httplib::Request &req, httplib::Response &res);
        void HandleGetMemberSegmentById(const httplib::Request &req, httplib::Response &res);

        // 营销活动接口
        void HandleGetCampaignList(const httplib::Request &req, httplib::Response &res);
        void HandleCreateCampaign(const httplib::Request &req, httplib::Response &res);
        void HandleUpdateCampaign(const httplib::Request &req, httplib::Response &res);
        void HandleDeleteCampaign(const httplib::Request &req, httplib::Response &res);
        void HandleGetCampaignById(const httplib::Request &req, httplib::Response &res);

        // 效果分析接口
        void HandleGetCampaignEffect(const httplib::Request &req, httplib::Response &res);
        void HandleGetMarketingROI(const httplib::Request &req, httplib::Response &res);
        void HandleGetConversionMetrics(const httplib::Request &req, httplib::Response &res);

    private:
        std::unique_ptr<services::MarketingService> marketing_service_;

        // 工具方法
        std::string ExtractIdFromPath(const std::string &path);
        bool ValidateCampaignData(const nlohmann::json &data);
        bool ValidateMemberSegmentData(const nlohmann::json &data);
        bool ValidateDateRange(const std::string &start_date, const std::string &end_date);
        nlohmann::json CampaignToJson(const models::Campaign &campaign);
        nlohmann::json MemberSegmentToJson(const models::MemberSegment &segment);
        models::MemberSegment::Condition StringToSegmentCondition(const std::string &condition);
        std::string SegmentConditionToString(models::MemberSegment::Condition condition);
        nlohmann::json MemberAnalyticsToJson(const models::MemberAnalytics &analytics);
        nlohmann::json MarketingEffectToJson(const models::MarketingEffect &effect);
        models::Campaign::Type StringToCampaignType(const std::string &type);
        std::string CampaignTypeToString(models::Campaign::Type type);
        models::Campaign::Status StringToCampaignStatus(const std::string &status);
        std::string CampaignStatusToString(models::Campaign::Status status);
        std::string GetCurrentTime();
    };

} // namespace controllers

#endif // CONTROLLERS_MARKETING_CONTROLLER_H_