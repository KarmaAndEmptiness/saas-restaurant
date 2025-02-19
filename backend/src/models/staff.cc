#include "models/staff.h"
#include <sstream>

namespace models
{
    Staff::Staff(const std::string &id,
                 const std::string &name,
                 const std::string &role,
                 const std::string &email,
                 const std::string &phone,
                 const std::string &status,
                 const std::string &department,
                 const std::string &join_date)
        : id_(id),
          name_(name),
          role_(role),
          email_(email),
          phone_(phone),
          status_(status),
          department_(department),
          join_date_(join_date) {}

    Staff Staff::CreateMockStaff(int index)
    {
        std::stringstream ss;
        ss << index;
        std::string idx = ss.str();

        // 模拟不同角色的员工数据
        if (index % 4 == 0)
        {
            return Staff("s" + idx,
                         "管理员" + idx,
                         "admin",
                         "admin" + idx + "@example.com",
                         "1380000" + (idx.length() < 4 ? std::string(4 - idx.length(), '0') : "") + idx,
                         "active",
                         "管理部",
                         "2023-01-01");
        }
        else if (index % 4 == 1)
        {
            return Staff("s" + idx,
                         "收银员" + idx,
                         "cashier",
                         "cashier" + idx + "@example.com",
                         "1381111" + (idx.length() < 4 ? std::string(4 - idx.length(), '0') : "") + idx,
                         "active",
                         "收银部",
                         "2023-02-01");
        }
        else if (index % 4 == 2)
        {
            return Staff("s" + idx,
                         "财务" + idx,
                         "finance",
                         "finance" + idx + "@example.com",
                         "1382222" + (idx.length() < 4 ? std::string(4 - idx.length(), '0') : "") + idx,
                         "active",
                         "财务部",
                         "2023-03-01");
        }
        else
        {
            return Staff("s" + idx,
                         "营销" + idx,
                         "marketing",
                         "marketing" + idx + "@example.com",
                         "1383333" + (idx.length() < 4 ? std::string(4 - idx.length(), '0') : "") + idx,
                         "active",
                         "营销部",
                         "2023-04-01");
        }
    }

} // namespace models