#ifndef CONTROLLERS_AUTH_CONTROLLER_H_
#define CONTROLLERS_AUTH_CONTROLLER_H_

#include <memory>
#include "services/auth_service.h"
#include "httplib.h"
namespace controllers
{

    class AuthController
    {
    public:
        AuthController();

        // 处理登录请求
        void HandleLogin(const httplib::Request &req, httplib::Response &res);

        // 处理登出请求
        void HandleLogout(const httplib::Request &req, httplib::Response &res);

        // 处理获取验证码请求
        void HandleGetCaptcha(const httplib::Request &req, httplib::Response &res);

        // 处理获取用户信息请求
        void HandleGetUserInfo(const httplib::Request &req, httplib::Response &res);

        // 处理刷新token请求
        void HandleRefreshToken(const httplib::Request &req, httplib::Response &res);

    private:
        std::unique_ptr<services::AuthService> auth_service_;
    };

} // namespace controllers

#endif // CONTROLLERS_AUTH_CONTROLLER_H_