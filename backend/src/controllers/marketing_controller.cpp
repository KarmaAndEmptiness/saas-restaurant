#include "controllers/marketing_controller.h"
#include <nlohmann/json.hpp>
#include "middleware/error_middleware.h"
#include "utils/date_validator.h"
#include "utils/id_generator.h"
#include <iostream>
using json = nlohmann::json;

namespace controllers
{
    MarketingController::MarketingController()
        : marketing_service_(std::make_unique<services::MarketingService>()) {}

    void MarketingController::HandleGetMemberAnalytics(const httplib::Request &req, httplib::Response &res)
    {
        try
        {
            std::string start_date = req.get_header_value("startDate");
            std::string end_date = req.get_header_value("endDate");
            std::string segment_id = req.get_header_value("segmentId");

            if (!ValidateDateRange(start_date, end_date))
            {
                throw middleware::ValidationException("无效的日期范围");
            }

            auto analytics = marketing_service_->GetMemberAnalytics(start_date, end_date, segment_id);
            res.body = MemberAnalyticsToJson(analytics).dump();
        }
        catch (const middleware::ApiException &)
        {
            throw;
        }
        catch (const std::exception &e)
        {
            std::cerr << "Error: " << __FILE__ << ":" << __LINE__ << " " << e.what() << std::endl;
            throw middleware::ApiException(500, "获取会员分析数据失败: " + std::string(e.what()));
        }
    }

    void MarketingController::HandleGetMemberSegments(const httplib::Request &req, httplib::Response &res)
    {
        std::cout << req.path << std::endl;
        try
        {
            auto segments = marketing_service_->GetMemberSegments();
            json response = json::array();
            for (const auto &segment : segments)
            {
                response.push_back(MemberSegmentToJson(segment));
            }
            res.body = response.dump();
        }
        catch (const std::exception &e)
        {
            std::cerr << "Error: " << __FILE__ << ":" << __LINE__ << " " << e.what() << std::endl;
            throw middleware::ApiException(500, "获取会员分群列表失败: " + std::string(e.what()));
        }
    }

    void MarketingController::HandleCreateMemberSegment(const httplib::Request &req, httplib::Response &res)
    {
        try
        {
            auto request_data = json::parse(req.body);
            if (!ValidateMemberSegmentData(request_data))
            {
                throw middleware::ValidationException("会员分群数据验证失败");
            }

            // 构造分群规则
            std::vector<models::MemberSegment::Rule> rules;
            for (const auto &rule_data : request_data["rules"])
            {
                models::MemberSegment::Rule rule;
                rule.condition = StringToSegmentCondition(rule_data["condition"]);
                rule.operator_ = rule_data["operator"];
                rule.values = rule_data["values"].get<std::vector<std::string>>();
                rules.push_back(rule);
            }

            models::MemberSegment segment(
                utils::GenerateId("SEG"),
                request_data["name"],
                request_data["description"],
                rules,
                0, // member_count 初始为0
                GetCurrentTime(),
                GetCurrentTime());

            std::string id = marketing_service_->CreateMemberSegment(segment);
            if (id.empty())
            {
                throw middleware::ApiException(500, "创建会员分群失败");
            }

            json response = {{"id", id},
                             {"message", "会员分群创建成功"}};
            res.status = 201;
            res.body = response.dump();
        }
        catch (const middleware::ApiException &)
        {
            throw;
        }
        catch (const json::exception &e)
        {
            std::cerr << "Error: " << __FILE__ << ":" << __LINE__ << " " << e.what() << std::endl;
            throw middleware::ValidationException("无效的请求数据格式");
        }
        catch (const std::exception &e)
        {
            std::cerr << "Error: " << __FILE__ << ":" << __LINE__ << " " << e.what() << std::endl;
            throw middleware::ApiException(500, "创建会员分群失败: " + std::string(e.what()));
        }
    }

    // 营销活动相关的处理方法
    void MarketingController::HandleGetCampaignList(const httplib::Request &req, httplib::Response &res)
    {
        try
        {
            std::string start_date = req.get_header_value("startDate");
            std::string end_date = req.get_header_value("endDate");
            std::string type = req.get_header_value("type");

            if (!ValidateDateRange(start_date, end_date))
            {
                throw middleware::ValidationException("无效的日期范围");
            }

            auto campaigns = marketing_service_->GetCampaignList(start_date, end_date, type);
            json response = json::array();
            for (const auto &campaign : campaigns)
            {
                response.push_back(CampaignToJson(campaign));
            }
            res.body = response.dump();
        }
        catch (const middleware::ApiException &)
        {
            throw;
        }
        catch (const std::exception &e)
        {
            std::cerr << "Error: " << __FILE__ << ":" << __LINE__ << " " << e.what() << std::endl;
            throw middleware::ApiException(500, "获取营销活动列表失败: " + std::string(e.what()));
        }
    }

    void MarketingController::HandleCreateCampaign(const httplib::Request &req, httplib::Response &res)
    {
        try
        {
            auto request_data = json::parse(req.body);
            if (!ValidateCampaignData(request_data))
            {
                throw middleware::ValidationException("营销活动数据验证失败");
            }

            models::Campaign campaign(
                utils::GenerateId("CMP"),
                request_data["name"],
                request_data["description"],
                request_data["startDate"],
                request_data["endDate"],
                StringToCampaignType(request_data["type"]),
                models::Campaign::Status::SCHEDULED,
                request_data["targetMembers"].get<std::vector<std::string>>(),
                request_data["discountRate"],
                0,  // participant_count 初始为0
                0.0 // conversion_rate 初始为0
            );

            std::string id = marketing_service_->CreateCampaign(campaign);
            if (id.empty())
            {
                throw middleware::ApiException(500, "创建营销活动失败");
            }

            json response = {{"id", id},
                             {"message", "营销活动创建成功"}};
            res.status = 201;
            res.body = response.dump();
        }
        catch (const middleware::ApiException &)
        {
            throw;
        }
        catch (const json::exception &e)
        {
            std::cerr << "Error: " << __FILE__ << ":" << __LINE__ << " " << e.what() << std::endl;
            throw middleware::ValidationException("无效的请求数据格式");
        }
        catch (const std::exception &e)
        {
            std::cerr << "Error: " << __FILE__ << ":" << __LINE__ << " " << e.what() << std::endl;
            throw middleware::ApiException(500, "创建营销活动失败: " + std::string(e.what()));
        }
    }

    // 效果分析相关的处理方法
    void MarketingController::HandleGetCampaignEffect(const httplib::Request &req, httplib::Response &res)
    {
        try
        {
            std::string campaign_id = ExtractIdFromPath(req.path);
            std::string start_date = req.get_header_value("startDate");
            std::string end_date = req.get_header_value("endDate");

            if (!ValidateDateRange(start_date, end_date))
            {
                throw middleware::ValidationException("无效的日期范围");
            }

            auto effect = marketing_service_->GetCampaignEffect(campaign_id, start_date, end_date);
            res.body = MarketingEffectToJson(effect).dump();
        }
        catch (const middleware::ApiException &)
        {
            throw;
        }
        catch (const std::exception &e)
        {
            std::cerr << "Error: " << __FILE__ << ":" << __LINE__ << " " << e.what() << std::endl;
            throw middleware::ApiException(500, "获取活动效果数据失败: " + std::string(e.what()));
        }
    }

    // 工具方法实现
    bool MarketingController::ValidateMemberSegmentData(const json &data)
    {
        return data.contains("name") &&
               data.contains("description") &&
               data.contains("rules") &&
               data["rules"].is_array() &&
               !data["rules"].empty();
    }

    json MarketingController::MemberSegmentToJson(const models::MemberSegment &segment)
    {
        try
        {
            json rules = json::array();
            for (const auto &rule : segment.GetRules())
            {
                rules.push_back({{"condition", SegmentConditionToString(rule.condition)},
                                 {"operator", rule.operator_},
                                 {"values", rule.values}});
            }

            return {
                {"id", segment.GetId()},
                {"name", segment.GetName()},
                {"description", segment.GetDescription()},
                {"rules", rules},
                {"memberCount", segment.GetMemberCount()},
                {"createTime", segment.GetCreateTime()},
                {"updateTime", segment.GetUpdateTime()}};
        }
        catch (const std::exception &e)
        {
            std::cerr << "Error: " << __FILE__ << ":" << __LINE__ << " " << e.what() << std::endl;
            throw middleware::ApiException(500, "获取会员分群数据失败: " + std::string(e.what()));
        }
    }

    json MarketingController::MemberAnalyticsToJson(const models::MemberAnalytics &analytics)
    {
        try
        {
            json growth_trend = json::array();
            for (const auto &stats : analytics.GetGrowthTrend())
            {
                growth_trend.push_back({{"date", stats.date},
                                        {"newMembers", stats.new_members},
                                        {"activeMembers", stats.active_members},
                                        {"totalConsumption", stats.total_consumption},
                                        {"averageConsumption", stats.average_consumption}});
            }

            json level_distribution = json::array();
            for (const auto &level : analytics.GetLevelDistribution())
            {
                level_distribution.push_back({{"level", level.level},
                                              {"count", level.count},
                                              {"percentage", level.percentage}});
            }

            return {
                {"growthTrend", growth_trend},
                {"levelDistribution", level_distribution},
                {"totalMembers", analytics.GetTotalMembers()},
                {"activeRate", analytics.GetActiveRate()},
                {"retentionRate", analytics.GetRetentionRate()},
                {"averagePoints", analytics.GetAveragePoints()}};
        }
        catch (const std::exception &e)
        {
            std::cerr << "Error: " << __FILE__ << ":" << __LINE__ << " " << e.what() << std::endl;
            throw middleware::ApiException(500, "获取会员分析数据失败: " + std::string(e.what()));
        }
    }

    std::string MarketingController::GetCurrentTime()
    {
        try
        {
            auto now = std::chrono::system_clock::now();
            auto time_t = std::chrono::system_clock::to_time_t(now);
            std::stringstream ss;
            ss << std::put_time(std::localtime(&time_t), "%Y-%m-%d %H:%M:%S");
            return ss.str();
        }
        catch (const std::exception &e)
        {
            std::cerr << "Error: " << __FILE__ << ":" << __LINE__ << " " << e.what() << std::endl;
            throw middleware::ApiException(500, "获取当前时间失败: " + std::string(e.what()));
        }
    }

    bool MarketingController::ValidateCampaignData(const json &data)
    {
        return data.contains("name") &&
               data.contains("description") &&
               data.contains("startDate") &&
               data.contains("endDate") &&
               data.contains("type") &&
               data.contains("targetMembers") &&
               data.contains("discountRate") &&
               data["targetMembers"].is_array() &&
               data["discountRate"].is_number() &&
               data["discountRate"].get<double>() > 0 &&
               data["discountRate"].get<double>() <= 1;
    }

    json MarketingController::CampaignToJson(const models::Campaign &campaign)
    {
        try
        {
            return {
                {"id", campaign.GetId()},
                {"name", campaign.GetName()},
                {"description", campaign.GetDescription()},
                {"startDate", campaign.GetStartDate()},
                {"endDate", campaign.GetEndDate()},
                {"type", CampaignTypeToString(campaign.GetType())},
                {"status", CampaignStatusToString(campaign.GetStatus())},
                {"targetMembers", campaign.GetTargetMembers()},
                {"discountRate", campaign.GetDiscountRate()},
                {"participantCount", campaign.GetParticipantCount()},
                {"conversionRate", campaign.GetConversionRate()}};
        }
        catch (const std::exception &e)
        {
            std::cerr << "Error: " << __FILE__ << ":" << __LINE__ << " " << e.what() << std::endl;
            throw middleware::ApiException(500, "获取营销活动数据失败: " + std::string(e.what()));
        }
    }

    json MarketingController::MarketingEffectToJson(const models::MarketingEffect &effect)
    {
        try
        {
            json daily_effects = json::array();
            for (const auto &daily : effect.GetDailyEffects())
            {
                daily_effects.push_back({{"date", daily.date},
                                         {"participantCount", daily.participant_count},
                                         {"totalSales", daily.total_sales},
                                         {"discountAmount", daily.discount_amount},
                                         {"conversionRate", daily.conversion_rate}});
            }

            return {
                {"campaignId", effect.GetCampaignId()},
                {"dailyEffects", daily_effects},
                {"totalCost", effect.GetTotalCost()},
                {"totalRevenue", effect.GetTotalRevenue()},
                {"roi", effect.GetROI()},
                {"totalParticipants", effect.GetTotalParticipants()},
                {"averageConversionRate", effect.GetAverageConversionRate()}};
        }
        catch (const std::exception &e)
        {
            std::cerr << "Error: " << __FILE__ << ":" << __LINE__ << " " << e.what() << std::endl;
            throw middleware::ApiException(500, "获取营销效果数据失败: " + std::string(e.what()));
        }
    }

    models::Campaign::Type MarketingController::StringToCampaignType(const std::string &type)
    {
        if (type == "discount")
            return models::Campaign::Type::DISCOUNT;
        else if (type == "points")
            return models::Campaign::Type::POINTS;
        else if (type == "gift")
            return models::Campaign::Type::GIFT;
        throw middleware::ValidationException("无效的活动类型");
    }

    std::string MarketingController::CampaignTypeToString(models::Campaign::Type type)
    {
        switch (type)
        {
        case models::Campaign::Type::DISCOUNT:
            return "discount";
        case models::Campaign::Type::POINTS:
            return "points";
        case models::Campaign::Type::GIFT:
            return "gift";
        default:
            return "unknown";
        }
    }

    models::Campaign::Status MarketingController::StringToCampaignStatus(const std::string &status)
    {
        if (status == "scheduled")
            return models::Campaign::Status::SCHEDULED;
        else if (status == "active")
            return models::Campaign::Status::ACTIVE;
        else if (status == "ended")
            return models::Campaign::Status::ENDED;
        throw middleware::ValidationException("无效的活动状态");
    }

    std::string MarketingController::CampaignStatusToString(models::Campaign::Status status)
    {
        switch (status)
        {
        case models::Campaign::Status::SCHEDULED:
            return "scheduled";
        case models::Campaign::Status::ACTIVE:
            return "active";
        case models::Campaign::Status::ENDED:
            return "ended";
        default:
            return "unknown";
        }
    }

    void MarketingController::HandleUpdateCampaign(const httplib::Request &req, httplib::Response &res)
    {
        try
        {
            std::string id = ExtractIdFromPath(req.path);
            auto request_data = json::parse(req.body);

            if (!ValidateCampaignData(request_data))
            {
                throw middleware::ValidationException("营销活动数据验证失败");
            }

            models::Campaign campaign(
                id,
                request_data["name"],
                request_data["description"],
                request_data["startDate"],
                request_data["endDate"],
                StringToCampaignType(request_data["type"]),
                StringToCampaignStatus(request_data["status"]),
                request_data["targetMembers"].get<std::vector<std::string>>(),
                request_data["discountRate"],
                request_data["participantCount"],
                request_data["conversionRate"]);

            if (!marketing_service_->UpdateCampaign(id, campaign))
            {
                throw middleware::ApiException(404, "营销活动不存在");
            }

            json response = {{"message", "营销活动更新成功"}};
            res.body = response.dump();
        }
        catch (const middleware::ApiException &)
        {
            throw;
        }
        catch (const json::exception &e)
        {
            std::cerr << "Error: " << __FILE__ << ":" << __LINE__ << " " << e.what() << std::endl;
            throw middleware::ValidationException("无效的请求数据格式");
        }
        catch (const std::exception &e)
        {
            std::cerr << "Error: " << __FILE__ << ":" << __LINE__ << " " << e.what() << std::endl;
            throw middleware::ApiException(500, "更新营销活动失败: " + std::string(e.what()));
        }
    }

    void MarketingController::HandleDeleteCampaign(const httplib::Request &req, httplib::Response &res)
    {
        try
        {
            std::string id = ExtractIdFromPath(req.path);

            if (!marketing_service_->DeleteCampaign(id))
            {
                throw middleware::ApiException(404, "营销活动不存在");
            }

            json response = {{"message", "营销活动删除成功"}};
            res.body = response.dump();
        }
        catch (const std::exception &e)
        {
            std::cerr << "Error: " << __FILE__ << ":" << __LINE__ << " " << e.what() << std::endl;
            throw middleware::ApiException(500, "删除营销活动失败: " + std::string(e.what()));
        }
    }

    void MarketingController::HandleGetCampaignById(const httplib::Request &req, httplib::Response &res)
    {
        try
        {
            std::string id = ExtractIdFromPath(req.path);
            auto campaign = marketing_service_->GetCampaignById(id);

            if (campaign.GetId().empty())
            {
                throw middleware::ApiException(404, "营销活动不存在");
            }

            res.body = CampaignToJson(campaign).dump();
        }
        catch (const middleware::ApiException &)
        {
            throw;
        }
        catch (const std::exception &e)
        {
            std::cerr << "Error: " << __FILE__ << ":" << __LINE__ << " " << e.what() << std::endl;
            throw middleware::ApiException(500, "获取营销活动详情失败: " + std::string(e.what()));
        }
    }

    void MarketingController::HandleGetMarketingROI(const httplib::Request &req, httplib::Response &res)
    {
        try
        {
            std::string start_date = req.get_header_value("startDate");
            std::string end_date = req.get_header_value("endDate");

            if (!ValidateDateRange(start_date, end_date))
            {
                throw middleware::ValidationException("无效的日期范围");
            }

            double roi = marketing_service_->GetMarketingROI(start_date, end_date);
            json response = {{"roi", roi}};
            res.body = response.dump();
        }
        catch (const middleware::ApiException &)
        {
            throw;
        }
        catch (const std::exception &e)
        {
            std::cerr << "Error: " << __FILE__ << ":" << __LINE__ << " " << e.what() << std::endl;
            throw middleware::ApiException(500, "获取营销ROI失败: " + std::string(e.what()));
        }
    }

    void MarketingController::HandleGetConversionMetrics(const httplib::Request &req, httplib::Response &res)
    {
        try
        {
            std::string start_date = req.get_header_value("startDate");
            std::string end_date = req.get_header_value("endDate");

            if (!ValidateDateRange(start_date, end_date))
            {
                throw middleware::ValidationException("无效的日期范围");
            }

            auto metrics = marketing_service_->GetConversionMetrics(start_date, end_date);
            json response = json::array();
            for (const auto &metric : metrics)
            {
                response.push_back({{"name", metric.first},
                                    {"value", metric.second}});
            }
            res.body = response.dump();
        }
        catch (const middleware::ApiException &)
        {
            throw;
        }
        catch (const std::exception &e)
        {
            std::cerr << "Error: " << __FILE__ << ":" << __LINE__ << " " << e.what() << std::endl;
            throw middleware::ApiException(500, "获取转化指标失败: " + std::string(e.what()));
        }
    }

    std::string MarketingController::ExtractIdFromPath(const std::string &path)
    {
        auto pos = path.find_last_of('/');
        if (pos != std::string::npos)
        {
            return path.substr(pos + 1);
        }
        return "";
    }

    bool MarketingController::ValidateDateRange(const std::string &start_date, const std::string &end_date)
    {
        return utils::DateValidator::IsValidDateRange(start_date, end_date);
    }

    void MarketingController::HandleUpdateMemberSegment(const httplib::Request &req, httplib::Response &res)
    {
        try
        {
            std::string id = ExtractIdFromPath(req.path);
            auto request_data = json::parse(req.body);

            if (!ValidateMemberSegmentData(request_data))
            {
                throw middleware::ValidationException("会员分群数据验证失败");
            }

            // 构造分群规则
            std::vector<models::MemberSegment::Rule> rules;
            for (const auto &rule_data : request_data["rules"])
            {
                models::MemberSegment::Rule rule;
                rule.condition = StringToSegmentCondition(rule_data["condition"]);
                rule.operator_ = rule_data["operator"];
                rule.values = rule_data["values"].get<std::vector<std::string>>();
                rules.push_back(rule);
            }

            models::MemberSegment segment(
                id,
                request_data["name"],
                request_data["description"],
                rules,
                request_data["memberCount"],
                request_data["createTime"],
                GetCurrentTime());

            if (!marketing_service_->UpdateMemberSegment(id, segment))
            {
                throw middleware::ApiException(404, "会员分群不存在");
            }

            json response = {{"message", "会员分群更新成功"}};
            res.body = response.dump();
        }
        catch (const middleware::ApiException &)
        {
            throw;
        }
        catch (const json::exception &e)
        {
            std::cerr << "Error: " << __FILE__ << ":" << __LINE__ << " " << e.what() << std::endl;
            throw middleware::ValidationException("无效的请求数据格式");
        }
        catch (const std::exception &e)
        {
            std::cerr << "Error: " << __FILE__ << ":" << __LINE__ << " " << e.what() << std::endl;
            throw middleware::ApiException(500, "更新会员分群失败: " + std::string(e.what()));
        }
    }

    void MarketingController::HandleDeleteMemberSegment(const httplib::Request &req, httplib::Response &res)
    {
        try
        {
            std::string id = ExtractIdFromPath(req.path);

            if (!marketing_service_->DeleteMemberSegment(id))
            {
                throw middleware::ApiException(404, "会员分群不存在");
            }

            json response = {{"message", "会员分群删除成功"}};
            res.body = response.dump();
        }
        catch (const std::exception &e)
        {
            std::cerr << "Error: " << __FILE__ << ":" << __LINE__ << " " << e.what() << std::endl;
            throw middleware::ApiException(500, "删除会员分群失败: " + std::string(e.what()));
        }
    }

    void MarketingController::HandleGetMemberSegmentById(const httplib::Request &req, httplib::Response &res)
    {
        try
        {
            std::string id = ExtractIdFromPath(req.path);
            auto segment = marketing_service_->GetMemberSegmentById(id);

            if (segment.GetId().empty())
            {
                throw middleware::ApiException(404, "会员分群不存在");
            }

            res.body = MemberSegmentToJson(segment).dump();
        }
        catch (const middleware::ApiException &)
        {
            throw;
        }
        catch (const std::exception &e)
        {
            std::cerr << "Error: " << __FILE__ << ":" << __LINE__ << " " << e.what() << std::endl;
            throw middleware::ApiException(500, "获取会员分群详情失败: " + std::string(e.what()));
        }
    }

    // 会员分群条件枚举转换方法
    models::MemberSegment::Condition MarketingController::StringToSegmentCondition(const std::string &condition)
    {
        if (condition == "consumption_amount")
            return models::MemberSegment::Condition::CONSUMPTION_AMOUNT;
        else if (condition == "points_balance")
            return models::MemberSegment::Condition::POINTS_BALANCE;
        else if (condition == "member_level")
            return models::MemberSegment::Condition::MEMBER_LEVEL;
        else if (condition == "registration_date")
            return models::MemberSegment::Condition::REGISTRATION_DATE;
        else if (condition == "last_purchase_date")
            return models::MemberSegment::Condition::LAST_PURCHASE_DATE;
        throw middleware::ValidationException("无效的分群条件");
    }

    std::string MarketingController::SegmentConditionToString(models::MemberSegment::Condition condition)
    {
        switch (condition)
        {
        case models::MemberSegment::Condition::CONSUMPTION_AMOUNT:
            return "consumption_amount";
        case models::MemberSegment::Condition::POINTS_BALANCE:
            return "points_balance";
        case models::MemberSegment::Condition::MEMBER_LEVEL:
            return "member_level";
        case models::MemberSegment::Condition::REGISTRATION_DATE:
            return "registration_date";
        case models::MemberSegment::Condition::LAST_PURCHASE_DATE:
            return "last_purchase_date";
        default:
            return "unknown";
        }
    }

    // ... 其他方法的实现 ...
}