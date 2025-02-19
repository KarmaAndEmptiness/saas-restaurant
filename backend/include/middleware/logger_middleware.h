#ifndef MIDDLEWARE_LOGGER_MIDDLEWARE_H_
#define MIDDLEWARE_LOGGER_MIDDLEWARE_H_

#include "middleware/middleware.h"
#include "services/admin_service.h"
#include <memory>
#include <chrono>
#include <httplib.h>
namespace middleware
{
    class LoggerMiddleware : public Middleware
    {
    public:
        LoggerMiddleware();

        void Handle(const httplib::Request &req, httplib::Response &res, NextHandler next) override;

    private:
        std::unique_ptr<services::AdminService> admin_service_;

        // 工具方法
        std::string GetCurrentTimestamp() const;
        std::string GetRequestInfo(const httplib::Request &req) const;
        std::string GetResponseInfo(const httplib::Response &res) const;
        std::string GetClientIP(const httplib::Request &req) const;
        std::string GetLogType(int status_code) const;
    };

} // namespace middleware

#endif // MIDDLEWARE_LOGGER_MIDDLEWARE_H_