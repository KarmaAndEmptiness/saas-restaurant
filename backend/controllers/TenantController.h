#pragma once

#include <drogon/HttpController.h>

using namespace drogon;
namespace saas_restaurant
{
  struct LoginParam
  {
    std::string username;
    std::string password;
  };
}

namespace drogon
{
  template <>
  inline saas_restaurant::LoginParam fromRequest(const HttpRequest &req)
  {
    auto json = req.getJsonObject();
    saas_restaurant::LoginParam loginParam;
    if (json)
    {
      loginParam.username = (*json)["username"].asString();
      loginParam.password = (*json)["password"].asString();
    }
    return loginParam;
  }
}

class TenantController : public drogon::HttpController<TenantController>
{
public:
  METHOD_LIST_BEGIN
  // use METHOD_ADD to add your custom processing function here;
  // METHOD_ADD(TenantController::get, "/{2}/{1}", Get); // path is /TenantController/{arg2}/{arg1}
  // METHOD_ADD(TenantController::your_method_name, "/{1}/{2}/list", Get); // path is /TenantController/{arg1}/{arg2}/list
  ADD_METHOD_TO(TenantController::login, "/api/tenant/login", Post);               // 登录
  ADD_METHOD_TO(TenantController::getList, "/api/tenant/list", Get, "AuthFilter"); // 获取租户列表

  METHOD_LIST_END
  // your declaration of processing function maybe like this:
  // void get(const HttpRequestPtr& req, std::function<void (const HttpResponsePtr &)> &&callback, int p1, std::string p2);
  // void your_method_name(const HttpRequestPtr& req, std::function<void (const HttpResponsePtr &)> &&callback, double p1, int p2) const;
  void login(const HttpRequestPtr &req, std::function<void(const HttpResponsePtr &)> &&callback, saas_restaurant::LoginParam &&loginParam) const;
  void getList(const HttpRequestPtr &req, std::function<void(const HttpResponsePtr &)> &&callback) const;
};
