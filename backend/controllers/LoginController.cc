#include "LoginController.h"
#include "models/User.h"
LoginController::LoginController()
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
void LoginController::tenantAdminLogin(const HttpRequestPtr &req, std::function<void(const HttpResponsePtr &)> &&callback, saas_restaurant::TenantAdminLoginParam &&tenantAdminLoginParam) const
{
  // 创建Mapper对象
  drogon::orm::Mapper<drogon_model::saas_restaurant::User> userMapper(dbClient_);

  // 使用Mapper进行查询
  std::vector<drogon_model::saas_restaurant::User> users = userMapper.findBy(drogon::orm::Criteria("username", tenantAdminLoginParam.username));

  Json::Value response;

  // 检查是否找到用户
  if (users.empty())
  {
    response["code"] = k400BadRequest;
    response["message"] = "用户名或密码错误";
    response["data"] = Json::Value::null;
    auto resp = HttpResponse::newHttpJsonResponse(response);
    callback(resp);
    return;
  }

  // 验证密码
  const auto &user = users[0];
  if (user.getValueOfPassword() != tenantAdminLoginParam.password)
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
                   .set_payload_claim("username", jwt::claim(user.getValueOfUsername()))
                   .set_payload_claim("tenant_id", jwt::claim(std::to_string(user.getValueOfTenantId())))
                   .sign(jwt::algorithm::hs256{jwt_secret_});

  response["code"] = k200OK;
  response["message"] = "ok";
  response["data"]["token"] = token;
  response["data"]["tenant_id"] = user.getValueOfTenantId();
  response["data"]["user_id"] = user.getValueOfUserId();
  response["data"]["username"] = user.getValueOfUsername();

  auto resp = HttpResponse::newHttpJsonResponse(response);
  callback(resp);
}

void LoginController::tenantLogin(const HttpRequestPtr &req, std::function<void(const HttpResponsePtr &)> &&callback, saas_restaurant::TenantLoginParam &&tenantLoginParam) const
{
  Json::Value response;
  response["code"] = k200OK;
  response["message"] = "Tenant admin login successful";
  response["data"] = Json::Value::null;
  auto resp = HttpResponse::newHttpJsonResponse(response);
  callback(resp);
}