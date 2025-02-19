#include "models/user.h"

namespace models
{

    User::User(const std::string &id, const std::string &username,
               const std::string &name, const std::string &role)
        : id_(id), username_(username), name_(name), role_(role) {}

    User User::CreateMockUser(const std::string &username)
    {
        if (username == "admin")
        {
            return User("1", "admin", "管理员", "admin");
        }
        else if (username == "cashier")
        {
            return User("2", "cashier", "收银员", "cashier");
        }
        else if (username == "finance")
        {
            return User("3", "finance", "财务主管", "finance");
        }
        return User("4", "marketing", "营销经理", "marketing");
    }

} // namespace models