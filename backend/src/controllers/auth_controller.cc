#include "controllers/auth_controller.h"
#include <nlohmann/json.hpp>
#include <iostream>
using json = nlohmann::json;

namespace controllers
{
    AuthController::AuthController()
        : auth_service_(std::make_unique<services::AuthService>()) {}

    void AuthController::HandleLogin(const httplib::Request &req, httplib::Response &res)
    {
        try
        {
            // 解析请求体
            auto request_data = json::parse(req.body);
            std::string username = request_data["username"];
            std::string password = request_data["password"];
            std::string captcha = request_data["captcha"];
            std::string session_id = request_data["sessionId"];

            // 验证登录
            if (!auth_service_->ValidateLogin(username, password, captcha, session_id))
            {
                res.status = 401;
                json error = {
                    {"message", "用户名或密码错误"}};
                res.body = error.dump();
                return;
            }

            // 创建用户对象
            auto user = models::User::CreateMockUser(username);

            // 生成token
            std::string token = auth_service_->GenerateToken(user);

            // 构造响应
            json response = {
                {"token", token},
                {"user",
                 {{"id", user.GetId()},
                  {"username", user.GetUsername()},
                  {"name", user.GetName()},
                  {"role", user.GetRole()}}}};

            res.body = response.dump();
        }
        catch (const json::parse_error &e)
        {
            std::cerr << "Error: " << __FILE__ << ":" << __LINE__ << " " << e.what() << std::endl;
            res.status = 400;
            json error = {{"message", "JSON解析错误"}};
            res.body = error.dump();
        }
        catch (const std::exception &e)
        {
            std::cerr << "Error: " << __FILE__ << ":" << __LINE__ << " " << e.what() << std::endl;
            res.status = 400;
            json error = {{"message", "请求格式错误"}};
            res.body = error.dump();
        }
    }

    void AuthController::HandleLogout(const httplib::Request &req, httplib::Response &res)
    {
        std::cout << req.path << std::endl;
        // 实际项目中可能需要清理token或session
        res.status = 200;
    }

    void AuthController::HandleGetCaptcha(const httplib::Request &req, httplib::Response &res)
    {
        std::cout << req.path << std::endl;
        auto [session_id, captcha] = auth_service_->GenerateCaptcha();
        std::cout << session_id << std::endl;
        std::cout << captcha << std::endl;
        // 构造验证码图片URL (实际项目中应该生成真实的验证码图片)
        std::string captcha_url = "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"100\" height=\"40\"><text x=\"50%\" y=\"50%\" dominant-baseline=\"middle\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"24\" fill=\"%231677ff\">" + captcha + "</text></svg>";

        json response = {
            {"sessionId", session_id},
            {"captchaUrl", captcha_url}};

        res.body = response.dump();
    }

    void AuthController::HandleGetUserInfo(const httplib::Request &req, httplib::Response &res)
    {
        // 从请求头获取token
        std::string auth_header = req.get_header_value("Authorization");
        if (auth_header.empty() || auth_header.substr(0, 7) != "Bearer ")
        {
            res.status = 401;
            json error = {{"message", "未授权访问"}};
            res.body = error.dump();
            return;
        }

        std::string token = auth_header.substr(7);
        if (!auth_service_->ValidateToken(token))
        {
            res.status = 401;
            json error = {{"message", "token无效"}};
            res.body = error.dump();
            return;
        }

        auto user = auth_service_->GetUserInfo(token);
        json response = {
            {"id", user->GetId()},
            {"username", user->GetUsername()},
            {"name", user->GetName()},
            {"role", user->GetRole()},
            {"permissions", {"admin", "user"}}};

        res.body = response.dump();
    }

    void AuthController::HandleRefreshToken(const httplib::Request &req, httplib::Response &res)
    {
        try
        {
            auto request_data = json::parse(req.body);
            std::string old_token = request_data["token"];

            std::string new_token = auth_service_->RefreshToken(old_token);
            if (new_token.empty())
            {
                res.status = 401;
                json error = {{"message", "token刷新失败"}};
                res.body = error.dump();
                return;
            }

            json response = {{"token", new_token}};
            res.body = response.dump();
        }
        catch (const json::parse_error &e)
        {
            std::cerr << "Error: " << __FILE__ << ":" << __LINE__ << " " << e.what() << std::endl;
            res.status = 400;
            json error = {{"message", "JSON解析错误"}};
            res.body = error.dump();
        }
        catch (const std::exception &e)
        {
            std::cerr << "Error: " << __FILE__ << ":" << __LINE__ << " " << e.what() << std::endl;
            res.status = 400;
            json error = {{"message", "请求格式错误"}};
            res.body = error.dump();
        }
    }

} // namespace controllers