#include "TenantController.h"
#include <jwt-cpp/jwt.h>

TenantController::TenantController()
{
  // 从配置文件读取JWT secret
  auto &config = drogon::app().getCustomConfig();
  if (config.isMember("jwt") && config["jwt"].isMember("secret_key"))
  {
    jwt_secret_ = config["jwt"]["secret_key"].asString();
  }
  else
  {
    LOG_ERROR << "JWT secret not found in config file";
    throw std::runtime_error("JWT secret not configured");
  }
}

void TenantController::login(const HttpRequestPtr &req, std::function<void(const HttpResponsePtr &)> &&callback, saas_restaurant::LoginParam &&loginParam) const
{

  Json::Value response;
  std::cout << "username: " << loginParam.username << std::endl;
  std::cout << "password: " << loginParam.password << std::endl;
  if (loginParam.username == "zhangsan" && loginParam.password == "lisi.2025!")
  {
    // 生成JWT token
    auto token = jwt::create()
                     .set_issuer("saas-restaurant")
                     .set_type("JWS")
                     .set_issued_at(std::chrono::system_clock::now())
                     .set_expires_at(std::chrono::system_clock::now() + std::chrono::hours(24))
                     .set_payload_claim("username", jwt::claim(loginParam.username))
                     .sign(jwt::algorithm::hs256{jwt_secret_});

    response["code"] = k200OK;
    response["message"] = "ok";
    response["data"]["token"] = token;
    auto resp = HttpResponse::newHttpJsonResponse(response);
    resp->setStatusCode(k200OK);
    resp->addHeader("Content-Type", "application/json; charset=utf-8");
    callback(resp);
  }
  else
  {
    response["code"] = k400BadRequest;
    response["message"] = "用户名或密码错误";
    response["data"] = Json::Value::null;
    auto resp = HttpResponse::newHttpJsonResponse(response);
    resp->setStatusCode(k400BadRequest);
    resp->addHeader("Content-Type", "application/json; charset=utf-8");
    callback(resp);
  }
}

void TenantController::getList(const HttpRequestPtr &req, std::function<void(const HttpResponsePtr &)> &&callback) const
{
  Json::Value ret;
  ret["msg"] = "ok";
  ret["code"] = 200;
  ret["data"] = Json::arrayValue; // 返回一个空数组
  auto resp = HttpResponse::newHttpJsonResponse(ret);
  callback(resp);
}