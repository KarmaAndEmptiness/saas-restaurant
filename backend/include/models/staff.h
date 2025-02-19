#ifndef MODELS_STAFF_H_
#define MODELS_STAFF_H_

#include <string>

namespace models
{
    class Staff
    {
    public:
        Staff() = default;
        Staff(const std::string &id,
              const std::string &name,
              const std::string &role,
              const std::string &email,
              const std::string &phone,
              const std::string &status,
              const std::string &department,
              const std::string &join_date);

        // Getters
        std::string GetId() const { return id_; }
        std::string GetName() const { return name_; }
        std::string GetRole() const { return role_; }
        std::string GetEmail() const { return email_; }
        std::string GetPhone() const { return phone_; }
        std::string GetStatus() const { return status_; }
        std::string GetDepartment() const { return department_; }
        std::string GetJoinDate() const { return join_date_; }

        // For mock data
        static Staff CreateMockStaff(int index);

    private:
        std::string id_;
        std::string name_;
        std::string role_;
        std::string email_;
        std::string phone_;
        std::string status_;
        std::string department_;
        std::string join_date_;
    };

} // namespace models

#endif // MODELS_STAFF_H_