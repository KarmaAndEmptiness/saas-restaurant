/**
 *
 *  RestfulPermissionCtrl.h
 *  This file is generated by drogon_ctl
 *
 */

#pragma once

#include <drogon/HttpController.h>
#include "RestfulPermissionCtrlBase.h"

#include "Permission.h"
using namespace drogon;
using namespace drogon_model::saas_restaurant;
/**
 * @brief this class is created by the drogon_ctl command.
 * this class is a restful API controller for reading and writing the permission table.
 */

class RestfulPermissionCtrl : public drogon::HttpController<RestfulPermissionCtrl>, public RestfulPermissionCtrlBase
{
public:
  METHOD_LIST_BEGIN
  ADD_METHOD_TO(RestfulPermissionCtrl::getOne, "/api/permission/{1}", Get, Options, "AuthFilter");
  ADD_METHOD_TO(RestfulPermissionCtrl::updateOne, "/api/permission/{1}", Put, Options, "AuthFilter");
  ADD_METHOD_TO(RestfulPermissionCtrl::deleteOne, "/api/permission/{1}", Delete, Options, "AuthFilter");
  ADD_METHOD_TO(RestfulPermissionCtrl::get, "/api/permission", Get, Options, "AuthFilter");
  ADD_METHOD_TO(RestfulPermissionCtrl::create, "/api/permission", Post, Options, "AuthFilter");
  // ADD_METHOD_TO(RestfulPermissionCtrl::update,"/api/permission",Put,Options,"AuthFilter");
  METHOD_LIST_END

  void getOne(const HttpRequestPtr &req,
              std::function<void(const HttpResponsePtr &)> &&callback,
              Permission::PrimaryKeyType &&id);
  void updateOne(const HttpRequestPtr &req,
                 std::function<void(const HttpResponsePtr &)> &&callback,
                 Permission::PrimaryKeyType &&id);
  void deleteOne(const HttpRequestPtr &req,
                 std::function<void(const HttpResponsePtr &)> &&callback,
                 Permission::PrimaryKeyType &&id);
  void get(const HttpRequestPtr &req,
           std::function<void(const HttpResponsePtr &)> &&callback);
  void create(const HttpRequestPtr &req,
              std::function<void(const HttpResponsePtr &)> &&callback);
};
