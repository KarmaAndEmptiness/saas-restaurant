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
  drogon::orm::Mapper<drogon_model::saas_restaurant::SystemAdministrator> adminMapper(dbClient_);

  // 使用Mapper进行查询，添加is_deleted = 0条件
  auto criteria = drogon::orm::Criteria("username", tenantAdminLoginParam.username);
  std::vector<drogon_model::saas_restaurant::SystemAdministrator> admins = adminMapper.findBy(criteria);

  Json::Value response;

  // 检查是否找到用户
  if (admins.empty())
  {
    response["code"] = k400BadRequest;
    response["message"] = "用户名或密码错误";
    response["data"] = Json::Value::null;
    auto resp = HttpResponse::newHttpJsonResponse(response);
    callback(resp);
    return;
  }

  // 验证密码
  const auto &admin = admins[0];
  if (admin.getValueOfPassword() != tenantAdminLoginParam.password)
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
                   .set_payload_claim("username", jwt::claim(admin.getValueOfUsername()))
                   .sign(jwt::algorithm::hs256{jwt_secret_});
  Json::Value list;
  list.resize(0);
  list.append("system_admin");
  response["code"] = k200OK;
  response["message"] = "ok";
  response["data"]["token"] = token;
  response["data"][drogon_model::saas_restaurant::SystemAdministrator::primaryKeyName] = admin.getPrimaryKey();
  response["data"]["username"] = admin.getValueOfUsername();
  response["data"]["roles"] = list;

  auto resp = HttpResponse::newHttpJsonResponse(response);
  callback(resp);
}

void LoginController::tenantLogin(const HttpRequestPtr &req, std::function<void(const HttpResponsePtr &)> &&callback, saas_restaurant::TenantLoginParam &&tenantLoginParam) const
{
  // 创建Mapper对象
  drogon::orm::Mapper<drogon_model::saas_restaurant::User> userMapper(dbClient_);

  // 使用Mapper进行查询，添加is_deleted = 0条件
  auto criteria = drogon::orm::Criteria("username", tenantLoginParam.username) &&
                  drogon::orm::Criteria("is_deleted", 0);
  std::vector<drogon_model::saas_restaurant::User> users = userMapper.findBy(criteria);

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
  if (user.getValueOfPassword() != tenantLoginParam.password)
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
  criteria = drogon::orm::Criteria(drogon_model::saas_restaurant::UserRole::Cols::_user_id, drogon::orm::CompareOperator::EQ, user.getValueOfUserId()) && drogon::orm::Criteria(drogon_model::saas_restaurant::UserRole::Cols::_is_deleted, drogon::orm::CompareOperator::EQ, 0);
  std::vector<drogon_model::saas_restaurant::UserRole> userRoles = drogon::orm::Mapper<drogon_model::saas_restaurant::UserRole>(dbClient_).findBy(criteria);
  if (userRoles.empty())
  {
    response["code"] = k400BadRequest;
    response["message"] = "用户角色未找到";
    response["data"] = Json::Value::null;
    auto resp = HttpResponse::newHttpJsonResponse(response);
    callback(resp);
    return;
  }
  // 获取用户角色
  Json::Value list;
  list.resize(0);
  std::vector<std::string> roles;
  for (const auto &userRole : userRoles)
  {
    drogon::orm::Mapper<drogon_model::saas_restaurant::Role> roleMapper(dbClient_);
    drogon_model::saas_restaurant::Role role = roleMapper.findByPrimaryKey(userRole.getValueOfRoleId());
    std::string roleName = role.getValueOfRoleName();
    list.append(roleName);
  }
  response["code"] = k200OK;
  response["message"] = "ok";
  response["data"]["token"] = token;
  response["data"]["tenant_id"] = user.getValueOfTenantId();
  response["data"]["user_id"] = user.getValueOfUserId();
  response["data"]["username"] = user.getValueOfUsername();
  response["data"]["roles"] = list;

  auto resp = HttpResponse::newHttpJsonResponse(response);
  callback(resp);
}