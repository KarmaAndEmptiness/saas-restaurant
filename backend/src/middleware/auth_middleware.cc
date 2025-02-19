#include "middleware/auth_middleware.h"
#include <nlohmann/json.hpp>

using json = nlohmann::json;

namespace middleware
{
    AuthMiddleware::AuthMiddleware()
        : auth_service_(std::make_unique<services::AuthService>())
    {
        // 初始化公开路径
        public_paths_ = {
            "/api/auth/login",
            "/api/auth/captcha",
            "/api/auth/refresh-token"};
    }

    void AuthMiddleware::Handle(const httplib::Request &req, httplib::Response &res, NextHandler next)
    {
        try
        {
            // 检查是否是公开路径
            if (IsPublicPath(req.path))
            {
                next();
                return;
            }

            // 获取并验证token
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
                json error = {{"message", "token无效或已过期"}};
                res.body = error.dump();
                return;
            }

            // 验证权限
            if (!ValidatePermission(token, req.path))
            {
                res.status = 403;
                json error = {{"message", "没有访问权限"}};
                res.body = error.dump();
                return;
            }

            next();
        }
        catch (const std::exception &e)
        {
            std::cerr << "Error: " << __FILE__ << ":" << __LINE__ << " " << e.what() << std::endl;
            throw;
        }
    }

    bool AuthMiddleware::IsPublicPath(const std::string &path) const
    {
        return std::find(public_paths_.begin(), public_paths_.end(), path) != public_paths_.end();
    }

    bool AuthMiddleware::ValidatePermission(const std::string &token, const std::string &path) const
    {
        // 获取用户信息
        auto user = auth_service_->GetUserInfo(token);
        if (!user)
        {
            return false;
        }

        // 根据路径和用户角色判断权限
        std::string role = user->GetRole();

        // admin角色拥有所有权限
        if (role == "admin")
        {
            return true;
        }

        // 其他角色的权限判断
        if (path.find("/api/admin/") == 0)
        {
            return role == "admin";
        }
        else if (path.find("/api/cashier/") == 0)
        {
            return role == "cashier";
        }
        else if (path.find("/api/finance/") == 0)
        {
            return role == "finance";
        }
        else if (path.find("/api/marketing/") == 0)
        {
            return role == "marketing";
        }

        return false;
    }

} // namespace middleware