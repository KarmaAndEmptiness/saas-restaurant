#ifndef ADMIN_ROUTER_H
#define ADMIN_ROUTER_H
#include "httplib.h"
#include "controllers/admin_controller.h"
namespace router
{
    class AdminRouter
    {
    public:
        AdminRouter(std::unique_ptr<httplib::Server> server);
        void InitializeRoutes();

    private:
        std::unique_ptr<httplib::Server> server_;
        std::unique_ptr<controllers::AdminController> admin_controller_;
    };
}
#endif