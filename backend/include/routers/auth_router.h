#ifndef AUTH_ROUTER_H
#define AUTH_ROUTER_H
#include "httplib.h"
#include "controllers/auth_controller.h"
namespace router
{
    class AuthRouter
    {
    public:
        AuthRouter(std::shared_ptr<httplib::Server> server);
        void InitializeRoutes();

    private:
        std::shared_ptr<httplib::Server> server_;
        std::unique_ptr<controllers::AuthController> auth_controller_;
    };
}
#endif