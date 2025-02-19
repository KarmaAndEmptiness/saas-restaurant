#include "services/auth_service.h"
#include <random>
#include <sstream>
#include <iostream>
namespace services
{

    bool AuthService::ValidateLogin(const std::string &username,
                                    const std::string &password,
                                    const std::string &captcha,
                                    const std::string &session_id)
    {
        // 验证验证码
        auto it = captcha_store_.find(session_id);
        if (it == captcha_store_.end() ||
            it->second != captcha)
        {
            return false;
        }

        // 验证完成后删除验证码
        captcha_store_.erase(it);

        // 模拟密码验证 - 在实际项目中应该查询数据库
        return (username == "admin" && password == "123456") ||
               (username == "cashier" && password == "123456") ||
               (username == "finance" && password == "123456") ||
               (username == "marketing" && password == "123456");
    }

    std::pair<std::string, std::string> AuthService::GenerateCaptcha()
    {
        // 生成随机验证码
        const std::string chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        std::random_device rd;
        std::mt19937 gen(rd());
        std::uniform_int_distribution<> dis(0, chars.size() - 1);

        std::stringstream ss;
        for (int i = 0; i < 6; ++i)
        {
            ss << chars[dis(gen)];
        }
        std::string captcha = ss.str();

        // 生成session_id
        std::stringstream session_ss;
        for (int i = 0; i < 16; ++i)
        {
            session_ss << chars[dis(gen)];
        }
        std::string session_id = session_ss.str();

        // 存储验证码
        captcha_store_[session_id] = captcha;

        return {session_id, captcha};
    }

    std::shared_ptr<models::User> AuthService::GetUserInfo(const std::string &token)
    {
        // 在实际项目中应该解析token获取用户信息
        std::cout << token << std::endl;
        // 这里简单返回mock数据
        return std::make_shared<models::User>(
            models::User::CreateMockUser("admin"));
    }

    std::string AuthService::GenerateToken(const models::User &user)
    {
        // 在实际项目中应该使用JWT库生成token
        std::cout << user.GetUsername() << std::endl;
        // 这里简单返回mock token
        return "mock-jwt-token";
    }

    bool AuthService::ValidateToken(const std::string &token)
    {
        // 在实际项目中应该验证JWT token
        return token == "mock-jwt-token";
    }

    std::string AuthService::RefreshToken(const std::string &old_token)
    {
        // 在实际项目中应该验证旧token并生成新token
        if (ValidateToken(old_token))
        {
            return "new-mock-jwt-token";
        }
        return "";
    }

} // namespace services