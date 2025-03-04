#ifndef AUTH_H
#define AUTH_H

#include <string>
#include <vector>
namespace models
{
    namespace auth
    {
      class User
    {
    public:
        User() = default;
        User(const std::string &id, const std::string &username,
             const std::string &name, const std::string &role);

        // Getters
        std::string GetId() const { return id_; }
        std::string GetUsername() const { return username_; }
        std::string GetName() const { return name_; }
        std::string GetRole() const { return role_; }

        // For mock data
        static User CreateMockUser(const std::string &username);

    private:
        std::string id_;
        std::string username_;
        std::string name_;
        std::string role_;
    };
class Role
    {
    public:
        Role() = default;
        Role(const std::string &id,
             const std::string &name,
             const std::string &description,
             const std::vector<std::string> &permissions,
             int user_count);

        // Getters
        std::string GetId() const { return id_; }
        std::string GetName() const { return name_; }
        std::string GetDescription() const { return description_; }
        const std::vector<std::string> &GetPermissions() const { return permissions_; }
        int GetUserCount() const { return user_count_; }

        // Setters
        void SetPermissions(const std::vector<std::string> &permissions) { permissions_ = permissions; }
        void SetUserCount(int count) { user_count_ = count; }

        // For mock data
        static Role CreateMockRole(int index);

    private:
        std::string id_;
        std::string name_;
        std::string description_;
        std::vector<std::string> permissions_;
        int user_count_;
    };
  
    }
}

#endif