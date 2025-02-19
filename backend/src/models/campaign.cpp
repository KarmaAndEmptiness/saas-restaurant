#include "models/campaign.h"
#include <sstream>

namespace models
{
    Campaign::Campaign(const std::string &id,
                       const std::string &name,
                       const std::string &description,
                       const std::string &start_date,
                       const std::string &end_date,
                       Type type,
                       Status status,
                       const std::vector<std::string> &target_members,
                       double discount_rate,
                       int participant_count,
                       double conversion_rate)
        : id_(id),
          name_(name),
          description_(description),
          start_date_(start_date),
          end_date_(end_date),
          type_(type),
          status_(status),
          target_members_(target_members),
          discount_rate_(discount_rate),
          participant_count_(participant_count),
          conversion_rate_(conversion_rate) {}

    Campaign Campaign::CreateMockCampaign(int index)
    {
        std::stringstream ss;
        ss << index;
        std::string idx = ss.str();

        std::vector<std::string> target_members = {"GOLD", "PLATINUM"};

        Type type;
        std::string name;
        double discount_rate;

        switch (index % 3)
        {
        case 0:
            type = Type::DISCOUNT;
            name = "折扣活动" + idx;
            discount_rate = 0.8;
            break;
        case 1:
            type = Type::POINTS;
            name = "积分活动" + idx;
            discount_rate = 0.0;
            break;
        default:
            type = Type::GIFT;
            name = "赠品活动" + idx;
            discount_rate = 0.0;
            break;
        }

        return Campaign(
            "c" + idx,              // id
            name,                   // name
            "活动描述" + idx,       // description
            "2024-01-01",           // start_date
            "2024-12-31",           // end_date
            type,                   // type
            Status::ACTIVE,         // status
            target_members,         // target_members
            discount_rate,          // discount_rate
            100 + index * 10,       // participant_count
            0.2 + (index % 5) * 0.1 // conversion_rate
        );
    }

} // namespace models