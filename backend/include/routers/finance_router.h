#ifndef FINANCE_ROUTER_H
#define FINANCE_ROUTER_H
#include "httplib.h"
#include "controllers/finance_controller.h"
namespace router
{
    class FinanceRouter
    {
    public:
        FinanceRouter(std::shared_ptr<httplib::Server> server);
        void InitializeRoutes();

    private:
        std::shared_ptr<httplib::Server> server_;
        std::unique_ptr<controllers::FinanceController> finance_controller_;
    };
}
#endif