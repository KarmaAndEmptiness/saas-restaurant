#include "models/member.h"
#include <sstream>

namespace models
{
    Member::Member(const std::string &id,
                   const std::string &name,
                   const std::string &phone,
                   const std::string &gender,
                   MemberLevel level,
                   double points,
                   const std::string &card_number,
                   const std::string &join_date)
        : id_(id),
          name_(name),
          phone_(phone),
          gender_(gender),
          level_(level),
          points_(points),
          card_number_(card_number),
          join_date_(join_date) {}

    void Member::AddPoints(double points)
    {
        points_ += points;
        UpdateLevel();
    }

    bool Member::UsePoints(double points)
    {
        if (points_ >= points)
        {
            points_ -= points;
            UpdateLevel();
            return true;
        }
        return false;
    }

    void Member::UpdateLevel()
    {
        // 根据积分更新会员等级
        if (points_ >= 10000)
        {
            level_ = MemberLevel::PLATINUM;
        }
        else if (points_ >= 5000)
        {
            level_ = MemberLevel::GOLD;
        }
        else if (points_ >= 1000)
        {
            level_ = MemberLevel::SILVER;
        }
        else
        {
            level_ = MemberLevel::REGULAR;
        }
    }

    Member Member::CreateMockMember(int index)
    {
        std::stringstream ss;
        ss << index;
        std::string idx = ss.str();

        MemberLevel level;
        double points;

        switch (index % 4)
        {
        case 0:
            level = MemberLevel::REGULAR;
            points = 500;
            break;
        case 1:
            level = MemberLevel::SILVER;
            points = 2000;
            break;
        case 2:
            level = MemberLevel::GOLD;
            points = 6000;
            break;
        default:
            level = MemberLevel::PLATINUM;
            points = 12000;
            break;
        }

        return Member(
            "m" + idx,                      // id
            "会员" + idx,                   // name
            "138" + idx + idx + idx,        // phone
            (index % 2 == 0) ? "男" : "女", // gender
            level,                          // level
            points,                         // points
            "C" + idx + idx + idx,          // card_number
            "2023-" +
                std::to_string(1 + index % 12) +
                "-" + std::to_string(1 + index % 28) // join_date
        );
    }

} // namespace models