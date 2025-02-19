#include "server/http_server.h"
#include <nlohmann/json.hpp>
#include <httplib.h>
#include "middleware/error_middleware.h"
#include "middleware/logger_middleware.h"
#include "middleware/auth_middleware.h"
namespace server
{
    HttpServer::HttpServer()
        : server_(std::make_unique<httplib::Server>()),
          auth_controller_(std::make_unique<controllers::AuthController>()),
          cashier_controller_(std::make_unique<controllers::CashierController>()),
          admin_controller_(std::make_unique<controllers::AdminController>()),
          finance_controller_(std::make_unique<controllers::FinanceController>()),
          marketing_controller_(std::make_unique<controllers::MarketingController>())
    {
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
            server_->Post("/api/auth/login",
                          [this](const httplib::Request &req, httplib::Response &res)
                          {
                              auth_controller_->HandleLogin(req, res);
                          });

            server_->Post("/api/auth/logout",
                          [this](const httplib::Request &req, httplib::Response &res)
                          {
                              auth_controller_->HandleLogout(req, res);
                          });

            server_->Get("/api/auth/captcha",
                         [this](const httplib::Request &req, httplib::Response &res)
                         {
                             auth_controller_->HandleGetCaptcha(req, res);
                         });

            server_->Get("/api/auth/user",
                         [this](const httplib::Request &req, httplib::Response &res)
                         {
                             auth_controller_->HandleGetUserInfo(req, res);
                         });

            server_->Post("/api/auth/refresh-token",
                          [this](const httplib::Request &req, httplib::Response &res)
                          {
                              auth_controller_->HandleRefreshToken(req, res);
                          });

            // 收银模块路由
            // 商品相关
            server_->Get("/api/cashier/products/search",
                         [this](const httplib::Request &req, httplib::Response &res)
                         {
                             cashier_controller_->HandleSearchProducts(req, res);
                         });

            server_->Get("/api/cashier/products/",
                         [this](const httplib::Request &req, httplib::Response &res)
                         {
                             cashier_controller_->HandleGetProductByCode(req, res);
                         });

            // 交易相关
            server_->Post("/api/cashier/transactions",
                          [this](const httplib::Request &req, httplib::Response &res)
                          {
                              cashier_controller_->HandleCreateTransaction(req, res);
                          });

            server_->Get("/api/cashier/transactions/history",
                         [this](const httplib::Request &req, httplib::Response &res)
                         {
                             cashier_controller_->HandleGetTransactionHistory(req, res);
                         });

            server_->Get("/api/cashier/transactions/receipt",
                         [this](const httplib::Request &req, httplib::Response &res)
                         {
                             cashier_controller_->HandleGenerateReceipt(req, res);
                         });

            // 会员相关
            server_->Get("/api/cashier/members/card",
                         [this](const httplib::Request &req, httplib::Response &res)
                         {
                             cashier_controller_->HandleGetMemberByCard(req, res);
                         });

            server_->Get("/api/cashier/members/phone",
                         [this](const httplib::Request &req, httplib::Response &res)
                         {
                             cashier_controller_->HandleGetMemberByPhone(req, res);
                         });

            server_->Post("/api/cashier/members",
                          [this](const httplib::Request &req, httplib::Response &res)
                          {
                              cashier_controller_->HandleCreateMember(req, res);
                          });

            server_->Get("/api/cashier/members/search",
                         [this](const httplib::Request &req, httplib::Response &res)
                         {
                             cashier_controller_->HandleSearchMembers(req, res);
                         });

            // 积分相关
            server_->Post("/api/cashier/points/calculate-discount",
                          [this](const httplib::Request &req, httplib::Response &res)
                          {
                              cashier_controller_->HandleCalculatePointsDiscount(req, res);
                          });

            server_->Get("/api/cashier/members/transactions",
                         [this](const httplib::Request &req, httplib::Response &res)
                         {
                             cashier_controller_->HandleGetMemberTransactions(req, res);
                         });

            server_->Post("/api/cashier/members/points",
                          [this](const httplib::Request &req, httplib::Response &res)
                          {
                              cashier_controller_->HandleUpdateMemberPoints(req, res);
                          });
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