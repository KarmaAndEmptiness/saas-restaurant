#include "TenantController.h"

// Add definition of your processing function here

void TenantController::login(const HttpRequestPtr &req, std::function<void(const HttpResponsePtr &)> &&callback, saas_restaurant::LoginParam &&loginParam) const
{

  Json::Value ret;
  std::cout << "username: " << loginParam.username << std::endl;
  std::cout << "password: " << loginParam.password << std::endl;
  if (loginParam.username == "zhangsan" && loginParam.password == "lisi.2025!")
  {

    ret["msg"] = "ok";
    ret["code"] = 200;
    ret["data"]["token"] = drogon::utils::getUuid();
  }
  else
  {
    ret["msg"] = "用户名或密码错误";
    ret["code"] = 400;
    ret["data"] = Json::Value::null;
  }
  auto resp = HttpResponse::newHttpJsonResponse(ret);
  callback(resp);
}
