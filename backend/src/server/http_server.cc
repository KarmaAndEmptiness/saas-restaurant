#include "server/http_server.h"
#include <nlohmann/json.hpp>
#include <httplib.h>
#include "middleware/error_middleware.h"
#include "middleware/logger_middleware.h"
#include "middleware/auth_middleware.h"
#include <iostream>
namespace server
{
    HttpServer::HttpServer()
        : server_(std::make_shared<httplib::Server>()),
          auth_router_(std::make_unique<router::AuthRouter>(server_)),
          admin_router_(std::make_unique<router::AdminRouter>(server_))
    {
        server_->set_pre_routing_handler([](const httplib::Request &req, httplib::Response &res)
                                         {
                                            std::cout<<req.path<<std::endl;
                res.set_header("Access-Control-Allow-Origin", "*");
                res.set_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
                // res.set_header("Access-Control-Allow-Headers", "Content-Type, Authorization");
                return httplib::Server::HandlerResponse::Unhandled; });
        InitializeRoutes();
        // 添加错误处理中间件（最外层）
        UseMiddleware(std::make_unique<middleware::ErrorMiddleware>());
        // 添加日志中间件
        UseMiddleware(std::make_unique<middleware::LoggerMiddleware>());
        // 添加认证中间件
        UseMiddleware(std::make_unique<middleware::AuthMiddleware>());
    }

    void HttpServer::InitializeRoutes()
    {
        try
        {
            // 认证相关路由
            auth_router_->InitializeRoutes();
            // 管理员相关路由
            admin_router_->InitializeRoutes();
        }
        catch (const std::exception &e)
        {
            std::cerr << "Error: " << __FILE__ << " " << __LINE__ << e.what() << std::endl;
        }
    }

    void HttpServer::Start(int port)
    {
        std::cout << "Server listening on port " << port << std::endl;
        server_->listen("0.0.0.0", port);
    }

    void HttpServer::Stop()
    {
        server_->stop();
    }

    void HttpServer::UseMiddleware(std::unique_ptr<middleware::Middleware> middleware)
    {
        middlewares_.push_back(std::move(middleware));
    }

    void HttpServer::HandleRequest(const httplib::Request &req, httplib::Response &res)
    {
        // Middleware chain execution
        std::function<void()> middleware_chain = [&]()
        {
            // Final handler after all middlewares
            // This is where the actual route handling logic should be executed
            // For example, you could call a specific route handler here
        };

        for (auto it = middlewares_.rbegin(); it != middlewares_.rend(); ++it)
        {
            auto current_middleware = middleware_chain;
            middleware_chain = [&, current_middleware]()
            {
                (*it)->Handle(req, res, current_middleware);
            };
        }

        middleware_chain();
    }

} // namespace server