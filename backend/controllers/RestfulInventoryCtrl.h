/**
 *
 *  RestfulInventoryCtrl.h
 *  This file is generated by drogon_ctl
 *
 */

#pragma once

#include <drogon/HttpController.h>
#include "RestfulInventoryCtrlBase.h"

#include "Inventory.h"
using namespace drogon;
using namespace drogon_model::saas_restaurant;
/**
 * @brief this class is created by the drogon_ctl command.
 * this class is a restful API controller for reading and writing the inventory table.
 */

class RestfulInventoryCtrl : public drogon::HttpController<RestfulInventoryCtrl>, public RestfulInventoryCtrlBase
{
public:
  METHOD_LIST_BEGIN
  ADD_METHOD_TO(RestfulInventoryCtrl::getOne, "/api/inventory/{1}", Get, Options, "AuthFilter");
  ADD_METHOD_TO(RestfulInventoryCtrl::updateOne, "/api/inventory/{1}", Put, Options, "AuthFilter");
  ADD_METHOD_TO(RestfulInventoryCtrl::deleteOne, "/api/inventory/{1}", Delete, Options, "AuthFilter");
  ADD_METHOD_TO(RestfulInventoryCtrl::get, "/api/inventory", Get, Options, "AuthFilter");
  ADD_METHOD_TO(RestfulInventoryCtrl::create, "/api/inventory", Post, Options, "AuthFilter");
  // ADD_METHOD_TO(RestfulInventoryCtrl::update,"/api/inventory",Put,Options,"AuthFilter");
  METHOD_LIST_END

  void getOne(const HttpRequestPtr &req,
              std::function<void(const HttpResponsePtr &)> &&callback,
              Inventory::PrimaryKeyType &&id);
  void updateOne(const HttpRequestPtr &req,
                 std::function<void(const HttpResponsePtr &)> &&callback,
                 Inventory::PrimaryKeyType &&id);
  void deleteOne(const HttpRequestPtr &req,
                 std::function<void(const HttpResponsePtr &)> &&callback,
                 Inventory::PrimaryKeyType &&id);
  void get(const HttpRequestPtr &req,
           std::function<void(const HttpResponsePtr &)> &&callback);
  void create(const HttpRequestPtr &req,
              std::function<void(const HttpResponsePtr &)> &&callback);
};
