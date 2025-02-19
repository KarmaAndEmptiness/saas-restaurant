#include "models/permission.h"
#include <sstream>

namespace models
{
    Permission::Permission(const std::string &id,
                           const std::string &name,
                           const std::string &code,
                           const std::string &description,
                           const std::string &type)
        : id_(id),
          name_(name),
          code_(code),
          description_(description),
          type_(type) {}

    Permission Permission::CreateMockPermission(int index)
    {
        std::stringstream ss;
        ss << index;
        std::string idx = ss.str();

        // 模拟不同权限数据
        switch (index % 8)
        {
        case 0:
            return Permission("p" + idx,
                              "员工管理",
                              "admin:staff",
                              "管理员工账号和权限",
                              "menu");
        case 1:
            return Permission("p" + idx,
                              "角色管理",
                              "admin:role",
                              "管理系统角色和权限",
                              "menu");
        case 2:
            return Permission("p" + idx,
                              "交易管理",
                              "cashier:transaction",
                              "处理收银和交易",
                              "menu");
        case 3:
            return Permission("p" + idx,
                              "会员管理",
                              "cashier:member",
                              "管理会员信息和积分",
                              "menu");
        case 4:
            return Permission("p" + idx,
                              "财务统计",
                              "finance:stats",
                              "查看财务统计数据",
                              "menu");
        case 5:
            return Permission("p" + idx,
                              "报表管理",
                              "finance:report",
                              "生成和导出财务报表",
                              "menu");
        case 6:
            return Permission("p" + idx,
                              "营销活动",
                              "marketing:campaign",
                              "管理营销活动",
                              "menu");
        default:
            return Permission("p" + idx,
                              "会员分析",
                              "marketing:analysis",
                              "分析会员数据",
                              "menu");
        }
    }

} // namespace models