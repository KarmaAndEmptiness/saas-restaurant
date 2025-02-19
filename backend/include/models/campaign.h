#ifndef MODELS_CAMPAIGN_H_
#define MODELS_CAMPAIGN_H_

#include <string>
#include <vector>

namespace models
{
    class Campaign
    {
    public:
        enum class Type
        {
            DISCOUNT, // 折扣
            POINTS,   // 积分
            GIFT      // 赠品
        };

        enum class Status
        {
            SCHEDULED, // 未开始
            ACTIVE,    // 进行中
            ENDED      // 已结束
        };

        Campaign() = default;
        Campaign(const std::string &id,
                 const std::string &name,
                 const std::string &description,
                 const std::string &start_date,
                 const std::string &end_date,
                 Type type,
                 Status status,
                 const std::vector<std::string> &target_members,
                 double discount_rate,
                 int participant_count,
                 double conversion_rate);

        // Getters
        std::string GetId() const { return id_; }
        std::string GetName() const { return name_; }
        std::string GetDescription() const { return description_; }
        std::string GetStartDate() const { return start_date_; }
        std::string GetEndDate() const { return end_date_; }
        Type GetType() const { return type_; }
        Status GetStatus() const { return status_; }
        const std::vector<std::string> &GetTargetMembers() const { return target_members_; }
        double GetDiscountRate() const { return discount_rate_; }
        int GetParticipantCount() const { return participant_count_; }
        double GetConversionRate() const { return conversion_rate_; }

        // Setters
        void SetStatus(Status status) { status_ = status; }
        void SetParticipantCount(int count) { participant_count_ = count; }
        void SetConversionRate(double rate) { conversion_rate_ = rate; }

        // For mock data
        static Campaign CreateMockCampaign(int index);

    private:
        std::string id_;
        std::string name_;
        std::string description_;
        std::string start_date_;
        std::string end_date_;
        Type type_;
        Status status_;
        std::vector<std::string> target_members_;
        double discount_rate_;
        int participant_count_;
        double conversion_rate_;
    };

} // namespace models

#endif // MODELS_CAMPAIGN_H_