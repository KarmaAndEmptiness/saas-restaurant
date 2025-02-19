#ifndef MODELS_USER_H_
#define MODELS_USER_H_

#include <string>

namespace models
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

} // namespace models

#endif // MODELS_USER_H_