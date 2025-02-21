#include "routers/auth_router.h"
namespace router
{
    AuthRouter::AuthRouter(std::shared_ptr<httplib::Server> server)
        : server_(server),
          auth_controller_(std::make_unique<controllers::AuthController>())
    {
    }

    void AuthRouter::InitializeRoutes()
    {
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
    }
}