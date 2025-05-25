#include "TenantController.h"

// Add definition of your processing function here

void TenantController::login(const HttpRequestPtr &req, std::function<void(const HttpResponsePtr &)> &&callback, saas_restaurant::LoginParam &&loginParam) const
{
  Json::Value ret;
  ret["msg"] = "ok";
  ret["code"] = 200;
  ret["data"]["token"] = drogon::utils::getUuid();
  auto resp = HttpResponse::newHttpJsonResponse(ret);
  std::cout << "username: " << loginParam.username << std::endl;
  std::cout << "password: " << loginParam.password << std::endl;
  callback(resp);
}
