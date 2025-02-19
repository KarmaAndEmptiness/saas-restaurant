#ifndef MODELS_MEMBER_SEGMENT_H_
#define MODELS_MEMBER_SEGMENT_H_

#include <string>
#include <vector>

namespace models
{
    class MemberSegment
    {
    public:
        enum class Condition
        {
            CONSUMPTION_AMOUNT, // 消费金额
            POINTS_BALANCE,     // 积分余额
            MEMBER_LEVEL,       // 会员等级
            REGISTRATION_DATE,  // 注册日期
            LAST_PURCHASE_DATE  // 最近购买日期
        };

        struct Rule
        {
            Condition condition;
            std::string operator_; // >, <, =, >=, <=, between
            std::vector<std::string> values;
        };

        MemberSegment() = default;
        MemberSegment(const std::string &id,
                      const std::string &name,
                      const std::string &description,
                      const std::vector<Rule> &rules,
                      int member_count,
                      const std::string &create_time,
                      const std::string &update_time);

        // Getters
        std::string GetId() const { return id_; }
        std::string GetName() const { return name_; }
        std::string GetDescription() const { return description_; }
        const std::vector<Rule> &GetRules() const { return rules_; }
        int GetMemberCount() const { return member_count_; }
        std::string GetCreateTime() const { return create_time_; }
        std::string GetUpdateTime() const { return update_time_; }

        // Setters
        void SetMemberCount(int count) { member_count_ = count; }
        void SetUpdateTime(const std::string &time) { update_time_ = time; }

        // For mock data
        static MemberSegment CreateMockSegment(int index);

        // 工具方法
        static MemberSegment::Condition StringToCondition(const std::string &condition);
        static std::string ConditionToString(MemberSegment::Condition condition);

    private:
        std::string id_;
        std::string name_;
        std::string description_;
        std::vector<Rule> rules_;
        int member_count_;
        std::string create_time_;
        std::string update_time_;
    };

} // namespace models

#endif // MODELS_MEMBER_SEGMENT_H_