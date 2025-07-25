/**
 *
 *  RestfulTenantCtrl.h
 *  This file is generated by drogon_ctl
 *
 */

#pragma once

#include <drogon/HttpController.h>
#include "RestfulTenantCtrlBase.h"

#include "Tenant.h"
using namespace drogon;
using namespace drogon_model::saas_restaurant;
/**
 * @brief this class is created by the drogon_ctl command.
 * this class is a restful API controller for reading and writing the tenant table.
 */

class RestfulTenantCtrl : public drogon::HttpController<RestfulTenantCtrl>, public RestfulTenantCtrlBase
{
public:
  METHOD_LIST_BEGIN
  ADD_METHOD_TO(RestfulTenantCtrl::getOne, "/api/tenant/{1}", Get, Options, "AuthFilter");
  ADD_METHOD_TO(RestfulTenantCtrl::updateOne, "/api/tenant/{1}", Put, Options, "AuthFilter");
  ADD_METHOD_TO(RestfulTenantCtrl::deleteOne, "/api/tenant/{1}", Delete, Options, "AuthFilter");
  ADD_METHOD_TO(RestfulTenantCtrl::get, "/api/tenant", Get, Options, "AuthFilter");
  ADD_METHOD_TO(RestfulTenantCtrl::create, "/api/tenant", Post, Options, "AuthFilter");
  ADD_METHOD_TO(RestfulTenantCtrl::getToken, "/api/tenant/getToken/{1}", Get, Options, "AuthFilter");
  // ADD_METHOD_TO(RestfulTenantCtrl::update,"/api/tenant",Put,Options,"AuthFilter");
  METHOD_LIST_END

  void getOne(const HttpRequestPtr &req,
              std::function<void(const HttpResponsePtr &)> &&callback,
              Tenant::PrimaryKeyType &&id);
  void getToken(const HttpRequestPtr &req,
                std::function<void(const HttpResponsePtr &)> &&callback,
                Tenant::PrimaryKeyType &&id);
  void updateOne(const HttpRequestPtr &req,
                 std::function<void(const HttpResponsePtr &)> &&callback,
                 Tenant::PrimaryKeyType &&id);
  void deleteOne(const HttpRequestPtr &req,
                 std::function<void(const HttpResponsePtr &)> &&callback,
                 Tenant::PrimaryKeyType &&id);
  void get(const HttpRequestPtr &req,
           std::function<void(const HttpResponsePtr &)> &&callback);
  void create(const HttpRequestPtr &req,
              std::function<void(const HttpResponsePtr &)> &&callback);
};
