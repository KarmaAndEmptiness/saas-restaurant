#include "middleware/error_middleware.h"
#include <nlohmann/json.hpp>
#include <iostream>
using json = nlohmann::json;

namespace middleware
{
    void ErrorMiddleware::Handle(const httplib::Request &req, httplib::Response &res, NextHandler next)
    {
        std::cout << req.path << std::endl;
        try
        {
            next();
        }
        catch (const std::exception &e)
        {
            HandleError(e, res);
        }
    }

    void ErrorMiddleware::HandleError(const std::exception &e, httplib::Response &res)
    {
        try
        {
            // 尝试转换为ApiException
            const ApiException &api_error = dynamic_cast<const ApiException &>(e);
            HandleApiException(api_error, res);
        }
        catch (const std::bad_cast &)
        {
            // 如果不是ApiException，则作为标准异常处理
            HandleStandardException(e, res);
        }
    }

    void ErrorMiddleware::HandleApiException(const ApiException &e, httplib::Response &res)
    {
        try
        {
            res.status = e.GetStatusCode();
            json error = {
                {"code", e.GetStatusCode()},
                {"message", e.what()},
                {"success", false}};
            res.body = error.dump();
        }
        catch (const std::exception &e)
        {
            std::cerr << "Error: " << __FILE__ << ":" << __LINE__ << " " << e.what() << std::endl;
            throw;
        }
    }

    void ErrorMiddleware::HandleStandardException(const std::exception &e, httplib::Response &res)
    {
        try
        {
            res.status = 500;
            json error = {
                {"code", 500},
                {"message", "服务器内部错误"},
                {"success", false},
                {"detail", e.what()}};
            res.body = error.dump();
        }
        catch (const std::exception &e)
        {
            std::cerr << "Error: " << __FILE__ << ":" << __LINE__ << " " << e.what() << std::endl;
            throw;
        }
    }

} // namespace middleware