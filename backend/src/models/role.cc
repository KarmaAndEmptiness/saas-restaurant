#include "models/role.h"
#include <sstream>

namespace models
{
    Role::Role(const std::string &id,
               const std::string &name,
               const std::string &description,
               const std::vector<std::string> &permissions,
               int user_count)
        : id_(id),
          name_(name),
          description_(description),
          permissions_(permissions),
          user_count_(user_count) {}

    Role Role::CreateMockRole(int index)
    {
        std::stringstream ss;
        ss << index;
        std::string idx = ss.str();

        // 模拟不同角色数据
        if (index % 4 == 0)
        {
            return Role("r" + idx,
                        "系统管理员",
                        "拥有系统所有权限",
                        {"admin:*", "system:*"},
                        5);
        }
        else if (index % 4 == 1)
        {
            return Role("r" + idx,
                        "收银员",
                        "负责前台收银和会员管理",
                        {"cashier:transaction", "cashier:member"},
                        10);
        }
        else if (index % 4 == 2)
        {
            return Role("r" + idx,
                        "财务主管",
                        "负责财务管理和报表",
                        {"finance:*"},
                        3);
        }
        else
        {
            return Role("r" + idx,
                        "营销经理",
                        "负责营销活动和会员分析",
                        {"marketing:*"},
                        2);
        }
    }

} // namespace models