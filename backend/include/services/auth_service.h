#ifndef SERVICES_AUTH_SERVICE_H_
#define SERVICES_AUTH_SERVICE_H_

#include <string>
#include <memory>
#include <unordered_map>
#include "models/user.h"

namespace services
{

    class AuthService
    {
    public:
        AuthService() = default;

        // 登录验证
        bool ValidateLogin(const std::string &username,
                           const std::string &password,
                           const std::string &captcha,
                           const std::string &session_id);

        // 生成验证码
        std::pair<std::string, std::string> GenerateCaptcha();

        // 获取用户信息
        std::shared_ptr<models::User> GetUserInfo(const std::string &token);

        // 生成JWT Token
        std::string GenerateToken(const models::User &user);

        // 验证Token
        bool ValidateToken(const std::string &token);

        // 刷新Token
        std::string RefreshToken(const std::string &old_token);

    private:
        // 存储验证码和session_id的映射关系
        // 在实际项目中应该使用Redis等缓存服务
        std::unordered_map<std::string, std::string> captcha_store_;
    };

} // namespace services

#endif // SERVICES_AUTH_SERVICE_H_