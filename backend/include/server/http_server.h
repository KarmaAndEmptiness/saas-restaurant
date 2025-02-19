#ifndef SERVER_HTTP_SERVER_H_
#define SERVER_HTTP_SERVER_H_

#include <memory>
#include "httplib.h"
#include "middleware/middleware.h"
#include "controllers/auth_controller.h"
#include "controllers/cashier_controller.h"
#include "controllers/admin_controller.h"
#include "controllers/finance_controller.h"
#include "controllers/marketing_controller.h"

namespace server
{
    class HttpServer
    {
    public:
        HttpServer();

        // 启动服务器
        void Start(int port);

        // 停止服务器
        void Stop();

    private:
        // 初始化路由
        void InitializeRoutes();

        std::unique_ptr<httplib::Server> server_;
        std::unique_ptr<controllers::AuthController> auth_controller_;
        std::unique_ptr<controllers::CashierController> cashier_controller_;
        std::unique_ptr<controllers::AdminController> admin_controller_;
        std::unique_ptr<controllers::FinanceController> finance_controller_;
        std::unique_ptr<controllers::MarketingController> marketing_controller_;
        std::vector<std::unique_ptr<middleware::Middleware>> middlewares_;
        void HandleRequest(const httplib::Request &req, httplib::Response &res);

        void UseMiddleware(std::unique_ptr<middleware::Middleware> middleware);
    };

} // namespace server

#endif // SERVER_HTTP_SERVER_H_