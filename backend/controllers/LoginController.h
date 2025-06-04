#pragma once
#include <jwt-cpp/jwt.h>

#include <drogon/HttpController.h>

using namespace drogon;

namespace saas_restaurant
{
  struct TenantAdminLoginParam
  {
    std::string username;
    std::string password;
  };
  struct TenantLoginParam
  {
    std::string username;
    std::string password;
    std::string tenantToken;
  };
}

namespace drogon
{
  template <>
  inline saas_restaurant::TenantAdminLoginParam fromRequest(const HttpRequest &req)
  {
    auto json = req.getJsonObject();
    saas_restaurant::TenantAdminLoginParam tenantAdminLoginParam;
    if (json)
    {
      tenantAdminLoginParam.username = (*json)["username"].asString();
      tenantAdminLoginParam.password = (*json)["password"].asString();
    }
    return tenantAdminLoginParam;
  }
  template <>
  inline saas_restaurant::TenantLoginParam fromRequest(const HttpRequest &req)
  {
    auto json = req.getJsonObject();
    saas_restaurant::TenantLoginParam tenantLoginParam;
    if (json)
    {
      tenantLoginParam.username = (*json)["username"].asString();
      tenantLoginParam.password = (*json)["password"].asString();
      tenantLoginParam.tenantToken = (*json)["tenantToken"].asString();
    }
    return tenantLoginParam;
  }
}
class LoginController : public drogon::HttpController<LoginController>
{
public:
  METHOD_LIST_BEGIN
  ADD_METHOD_TO(LoginController::tenantAdminLogin, "/api/tenant/admin/login", Post); // 租户管理员登录
  ADD_METHOD_TO(LoginController::tenantLogin, "/api/tenant/login", Post);            // 租户登录
  METHOD_LIST_END

  LoginController(); // 添加构造函数

  void tenantAdminLogin(const HttpRequestPtr &req, std::function<void(const HttpResponsePtr &)> &&callback, saas_restaurant::TenantAdminLoginParam &&tenantAdminLoginParam) const;
  void tenantLogin(const HttpRequestPtr &req, std::function<void(const HttpResponsePtr &)> &&callback, saas_restaurant::TenantLoginParam &&tenantLoginParam) const;

private:
  std::string jwt_secret_;
  drogon::orm::DbClientPtr dbClient_;
};
