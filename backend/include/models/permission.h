#ifndef MODELS_PERMISSION_H_
#define MODELS_PERMISSION_H_

#include <string>

namespace models
{
    class Permission
    {
    public:
        Permission() = default;
        Permission(const std::string &id,
                   const std::string &name,
                   const std::string &code,
                   const std::string &description,
                   const std::string &type);

        // Getters
        std::string GetId() const { return id_; }
        std::string GetName() const { return name_; }
        std::string GetCode() const { return code_; }
        std::string GetDescription() const { return description_; }
        std::string GetType() const { return type_; }

        // For mock data
        static Permission CreateMockPermission(int index);

    private:
        std::string id_;
        std::string name_;
        std::string code_;
        std::string description_;
        std::string type_; // menu or operation
    };

} // namespace models

#endif // MODELS_PERMISSION_H_