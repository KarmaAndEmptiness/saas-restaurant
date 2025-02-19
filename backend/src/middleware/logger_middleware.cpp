#include "middleware/logger_middleware.h"
#include <nlohmann/json.hpp>
#include <sstream>
#include <iomanip>

using json = nlohmann::json;

namespace middleware
{
    LoggerMiddleware::LoggerMiddleware()
        : admin_service_(std::make_unique<services::AdminService>()) {}

    void LoggerMiddleware::Handle(const httplib::Request &req, httplib::Response &res, NextHandler next)
    {
        try
        {
            // 记录请求开始时间
            auto start_time = std::chrono::system_clock::now();

            // 执行下一个中间件
            next();

            // 计算请求处理时间
            auto end_time = std::chrono::system_clock::now();
            auto duration = std::chrono::duration_cast<std::chrono::milliseconds>(end_time - start_time);

            // 获取操作者信息
            std::string operator_name = "anonymous";
            std::string operator_role = "guest";
            std::string auth_header = req.get_header_value("Authorization");
            if (!auth_header.empty() && auth_header.substr(0, 7) == "Bearer ")
            {
                // 在实际项目中，这里应该从token中解析用户信息
                operator_name = "authenticated_user";
                operator_role = "authenticated_role";
            }

            // 创建日志记录
            models::SystemLog log(
                "", // ID will be generated
                GetLogType(res.status),
                req.path,
                operator_name,
                operator_role,
                GetClientIP(req),
                GetCurrentTimestamp(),
                GetRequestInfo(req) + " | " + GetResponseInfo(res) +
                    " | Duration: " + std::to_string(duration.count()) + "ms");

            // 在实际项目中，这里应该异步保存日志
            // admin_service_->SaveLog(log);
        }
        catch (const std::exception &e)
        {
            std::cerr << "Error: " << __FILE__ << ":" << __LINE__ << " " << e.what() << std::endl;
            throw;
        }
    }

    std::string LoggerMiddleware::GetCurrentTimestamp() const
    {
        try
        {
            auto now = std::chrono::system_clock::now();
            auto now_time = std::chrono::system_clock::to_time_t(now);
            std::stringstream ss;
            ss << std::put_time(std::localtime(&now_time), "%Y-%m-%d %H:%M:%S");
            return ss.str();
        }
        catch (const std::exception &e)
        {
            std::cerr << "Error: " << __FILE__ << ":" << __LINE__ << " " << e.what() << std::endl;
            throw;
        }
    }

    std::string LoggerMiddleware::GetRequestInfo(const httplib::Request &req) const
    {
        try
        {
            std::stringstream ss;
            ss << "Method: " << req.method
               << " | Path: " << req.path;

            // 添加查询参数和请求头信息（根据需要）
            if (!req.headers.empty())
            {
                ss << " | Headers: ";
                for (const auto &header : req.headers)
                {
                    if (header.first != "Authorization") // 不记录敏感信息
                    {
                        ss << header.first << "=" << header.second << "; ";
                    }
                }
            }

            return ss.str();
        }
        catch (const std::exception &e)
        {
            std::cerr << "Error: " << __FILE__ << ":" << __LINE__ << " " << e.what() << std::endl;
            throw;
        }
    }

    std::string LoggerMiddleware::GetResponseInfo(const httplib::Response &res) const
    {
        try
        {
            std::stringstream ss;
            ss << "Status: " << res.status;

            // 可以添加响应头信息（根据需要）
            if (!res.headers.empty())
            {
                ss << " | Headers: ";
                for (const auto &header : res.headers)
                {
                    ss << header.first << "=" << header.second << "; ";
                }
            }

            return ss.str();
        }
        catch (const std::exception &e)
        {
            std::cerr << "Error: " << __FILE__ << ":" << __LINE__ << " " << e.what() << std::endl;
            throw;
        }
    }

    std::string LoggerMiddleware::GetClientIP(const httplib::Request &req) const
    {
        // 尝试获取X-Forwarded-For头
        std::string ip = req.get_header_value("X-Forwarded-For");
        if (!ip.empty())
        {
            // 如果有多个IP，取第一个
            size_t pos = ip.find(',');
            if (pos != std::string::npos)
            {
                ip = ip.substr(0, pos);
            }
            return ip;
        }

        // 尝试获取X-Real-IP头
        ip = req.get_header_value("X-Real-IP");
        if (!ip.empty())
        {
            return ip;
        }

        // 如果都没有，返回默认值
        return "unknown";
    }

    std::string LoggerMiddleware::GetLogType(int status_code) const
    {
        if (status_code >= 500)
        {
            return "error";
        }
        else if (status_code >= 400)
        {
            return "warning";
        }
        else if (status_code >= 200 && status_code < 300)
        {
            return "success";
        }
        else
        {
            return "info";
        }
    }

} // namespace middleware