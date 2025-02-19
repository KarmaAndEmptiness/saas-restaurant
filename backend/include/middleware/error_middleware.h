#ifndef MIDDLEWARE_ERROR_MIDDLEWARE_H_
#define MIDDLEWARE_ERROR_MIDDLEWARE_H_

#include "middleware/middleware.h"
#include <string>
#include <httplib.h>
namespace middleware
{
    // 自定义异常基类
    class ApiException : public std::exception
    {
    public:
        ApiException(int status_code, const std::string &message)
            : status_code_(status_code), message_(message) {}

        const char *what() const noexcept override { return message_.c_str(); }
        int GetStatusCode() const { return status_code_; }

    private:
        int status_code_;
        std::string message_;
    };

    // 具体异常类
    class UnauthorizedException : public ApiException
    {
    public:
        UnauthorizedException(const std::string &message = "未授权访问")
            : ApiException(401, message) {}
    };

    class ForbiddenException : public ApiException
    {
    public:
        ForbiddenException(const std::string &message = "没有访问权限")
            : ApiException(403, message) {}
    };

    class NotFoundException : public ApiException
    {
    public:
        NotFoundException(const std::string &message = "资源不存在")
            : ApiException(404, message) {}
    };

    class ValidationException : public ApiException
    {
    public:
        ValidationException(const std::string &message = "数据验证失败")
            : ApiException(400, message) {}
    };

    // 错误处理中间件
    class ErrorMiddleware : public Middleware
    {
    public:
        void Handle(const httplib::Request &req, httplib::Response &res, NextHandler next) override;

    private:
        void HandleError(const std::exception &e, httplib::Response &res);
        void HandleApiException(const ApiException &e, httplib::Response &res);
        void HandleStandardException(const std::exception &e, httplib::Response &res);
    };

} // namespace middleware

#endif // MIDDLEWARE_ERROR_MIDDLEWARE_H_