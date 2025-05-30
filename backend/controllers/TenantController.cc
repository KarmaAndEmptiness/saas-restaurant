#include "TenantController.h"
#include <jwt-cpp/jwt.h>
#include "models/Tenant.h"

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

  // 初始化数据库客户端
  dbClient_ = drogon::app().getDbClient();
}

void TenantController::login(const HttpRequestPtr &req,
                             std::function<void(const HttpResponsePtr &)> &&callback,
                             saas_restaurant::LoginParam &&loginParam) const
{
  // 创建Mapper对象
  drogon::orm::Mapper<drogon_model::saas_restaurant::Tenant> tenantMapper(dbClient_);

  // 使用Mapper进行查询
  std::vector<drogon_model::saas_restaurant::Tenant> tenants = tenantMapper.findBy(drogon::orm::Criteria("username", loginParam.username));

  Json::Value response;

  // 检查是否找到用户
  if (tenants.empty())
  {
    response["code"] = k400BadRequest;
    response["message"] = "用户名或密码错误";
    response["data"] = Json::Value::null;
    auto resp = HttpResponse::newHttpJsonResponse(response);
    callback(resp);
    return;
  }

  // 验证密码
  const auto &tenant = tenants[0];
  if (tenant.getValueOfPassword() != loginParam.password)
  {
    response["code"] = k400BadRequest;
    response["message"] = "用户名或密码错误";
    response["data"] = Json::Value::null;
    auto resp = HttpResponse::newHttpJsonResponse(response);
    callback(resp);
    return;
  }

  // 生成JWT token
  auto token = jwt::create()
                   .set_issuer("saas-restaurant")
                   .set_type("JWS")
                   .set_issued_at(std::chrono::system_clock::now())
                   .set_expires_at(std::chrono::system_clock::now() + std::chrono::hours(24))
                   .set_payload_claim("username", jwt::claim(tenant.getValueOfUsername()))
                   .set_payload_claim("tenant_id", jwt::claim(std::to_string(tenant.getValueOfTenantId())))
                   .sign(jwt::algorithm::hs256{jwt_secret_});

  response["code"] = k200OK;
  response["message"] = "ok";
  response["data"]["token"] = token;
  response["data"]["tenant_id"] = tenant.getValueOfTenantId();
  response["data"]["username"] = tenant.getValueOfUsername();

  auto resp = HttpResponse::newHttpJsonResponse(response);
  callback(resp);
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