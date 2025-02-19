#ifndef MODELS_SYSTEM_LOG_H_
#define MODELS_SYSTEM_LOG_H_

#include <string>

namespace models
{
    class SystemLog
    {
    public:
        SystemLog() = default;
        SystemLog(const std::string &id,
                  const std::string &type,
                  const std::string &action,
                  const std::string &operator_name,
                  const std::string &operator_role,
                  const std::string &ip,
                  const std::string &timestamp,
                  const std::string &details);

        // Getters
        std::string GetId() const { return id_; }
        std::string GetType() const { return type_; }
        std::string GetAction() const { return action_; }
        std::string GetOperator() const { return operator_name_; }
        std::string GetOperatorRole() const { return operator_role_; }
        std::string GetIp() const { return ip_; }
        std::string GetTimestamp() const { return timestamp_; }
        std::string GetDetails() const { return details_; }

        // For mock data
        static SystemLog CreateMockLog(int index);

    private:
        std::string id_;
        std::string type_; // info, warning, error, success
        std::string action_;
        std::string operator_name_;
        std::string operator_role_;
        std::string ip_;
        std::string timestamp_;
        std::string details_;
    };

} // namespace models

#endif // MODELS_SYSTEM_LOG_H_