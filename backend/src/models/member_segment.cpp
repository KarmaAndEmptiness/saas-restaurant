#include "models/member_segment.h"
#include <sstream>
#include <chrono>
#include <iomanip>

namespace models
{
    MemberSegment::MemberSegment(const std::string &id,
                                 const std::string &name,
                                 const std::string &description,
                                 const std::vector<Rule> &rules,
                                 int member_count,
                                 const std::string &create_time,
                                 const std::string &update_time)
        : id_(id),
          name_(name),
          description_(description),
          rules_(rules),
          member_count_(member_count),
          create_time_(create_time),
          update_time_(update_time) {}

    MemberSegment MemberSegment::CreateMockSegment(int index)
    {
        std::stringstream ss;
        ss << index;
        std::string idx = ss.str();

        // 获取当前时间
        auto now = std::chrono::system_clock::now();
        auto time_t = std::chrono::system_clock::to_time_t(now);
        std::stringstream time_ss;
        time_ss << std::put_time(std::localtime(&time_t), "%Y-%m-%d %H:%M:%S");

        std::vector<Rule> rules;
        switch (index % 3)
        {
        case 0: // 高价值客户
            rules = {
                {Condition::CONSUMPTION_AMOUNT, ">=", {"10000"}},
                {Condition::MEMBER_LEVEL, "in", {"GOLD", "PLATINUM"}}};
            return MemberSegment(
                "s" + idx,                         // id
                "高价值客户" + idx,                // name
                "消费金额大于1万的金卡及以上会员", // description
                rules,                             // rules
                200,                               // member_count
                time_ss.str(),                     // create_time
                time_ss.str()                      // update_time
            );

        case 1: // 沉睡客户
            rules = {
                {Condition::LAST_PURCHASE_DATE, "<=", {"2023-12-31"}},
                {Condition::POINTS_BALANCE, ">=", {"1000"}}};
            return MemberSegment(
                "s" + idx,                             // id
                "沉睡客户" + idx,                      // name
                "超过3个月未消费且积分大于1000的会员", // description
                rules,                                 // rules
                500,                                   // member_count
                time_ss.str(),                         // create_time
                time_ss.str()                          // update_time
            );

        default: // 新客户
            rules = {
                {Condition::REGISTRATION_DATE, ">=", {"2024-01-01"}},
                {Condition::CONSUMPTION_AMOUNT, "<", {"1000"}}};
            return MemberSegment(
                "s" + idx,                            // id
                "新客户" + idx,                       // name
                "2024年注册且消费金额小于1000的会员", // description
                rules,                                // rules
                300,                                  // member_count
                time_ss.str(),                        // create_time
                time_ss.str()                         // update_time
            );
        }
    }

    MemberSegment::Condition MemberSegment::StringToCondition(const std::string &condition)
    {
        if (condition == "CONSUMPTION_AMOUNT")
        {
            return Condition::CONSUMPTION_AMOUNT;
        }
        else if (condition == "MEMBER_LEVEL")
        {
            return Condition::MEMBER_LEVEL;
        }
        else if (condition == "LAST_PURCHASE_DATE")
        {
            return Condition::LAST_PURCHASE_DATE;
        }
        else if (condition == "POINTS_BALANCE")
        {
            return Condition::POINTS_BALANCE;
        }
        else if (condition == "REGISTRATION_DATE")
        {
            return Condition::REGISTRATION_DATE;
        }
        else
        {
            throw std::invalid_argument("无效的条件: " + condition);
        }
    }

    std::string MemberSegment::ConditionToString(Condition condition)
    {
        switch (condition)
        {
        case Condition::CONSUMPTION_AMOUNT:
            return "CONSUMPTION_AMOUNT";
        case Condition::MEMBER_LEVEL:
            return "MEMBER_LEVEL";
        case Condition::LAST_PURCHASE_DATE:
            return "LAST_PURCHASE_DATE";
        case Condition::POINTS_BALANCE:
            return "POINTS_BALANCE";
        case Condition::REGISTRATION_DATE:
            return "REGISTRATION_DATE";
        default:
            throw std::invalid_argument("无效的条件: " + std::to_string(static_cast<int>(condition)));
        }
    }
} // namespace models
