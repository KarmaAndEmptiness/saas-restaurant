#ifndef MIDDLEWARE_AUTH_MIDDLEWARE_H_
#define MIDDLEWARE_AUTH_MIDDLEWARE_H_

#include "middleware/middleware.h"
#include "services/auth_service.h"
#include <memory>
#include <vector>
#include <string>

namespace middleware
{
    class AuthMiddleware : public Middleware
    {
    public:
        AuthMiddleware();

        void Handle(const httplib::Request &req, httplib::Response &res, NextHandler next) override;

    private:
        std::unique_ptr<services::AuthService> auth_service_;
        std::vector<std::string> public_paths_; // 不需要认证的路径

        bool IsPublicPath(const std::string &path) const;
        bool ValidatePermission(const std::string &token, const std::string &path) const;
    };

} // namespace middleware

#endif // MIDDLEWARE_AUTH_MIDDLEWARE_H_