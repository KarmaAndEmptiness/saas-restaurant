/**
 *
 *  RestfulDishCtrlBase.h
 *  DO NOT EDIT. This file is generated by drogon_ctl automatically.
 *  Users should implement business logic in the derived class.
 */

#pragma once

#include <drogon/HttpController.h>
#include <drogon/orm/RestfulController.h>

#include "Dish.h"
using namespace drogon;
using namespace drogon::orm;
using namespace drogon_model::saas_restaurant;
/**
 * @brief this class is created by the drogon_ctl command.
 * this class is a restful API controller for reading and writing the dish table.
 */

class RestfulDishCtrlBase : public RestfulController
{
public:
  void getOne(const HttpRequestPtr &req,
              std::function<void(const HttpResponsePtr &)> &&callback,
              Dish::PrimaryKeyType &&id);
  void updateOne(const HttpRequestPtr &req,
                 std::function<void(const HttpResponsePtr &)> &&callback,
                 Dish::PrimaryKeyType &&id);
  void deleteOne(const HttpRequestPtr &req,
                 std::function<void(const HttpResponsePtr &)> &&callback,
                 Dish::PrimaryKeyType &&id);
  void get(const HttpRequestPtr &req,
           std::function<void(const HttpResponsePtr &)> &&callback);
  void getHotDishes(const HttpRequestPtr &req,
                    std::function<void(const HttpResponsePtr &)> &&callback);
  void create(const HttpRequestPtr &req,
              std::function<void(const HttpResponsePtr &)> &&callback);

  //  void update(const HttpRequestPtr &req,
  //              std::function<void(const HttpResponsePtr &)> &&callback);

  orm::DbClientPtr getDbClient()
  {
    return drogon::app().getDbClient(dbClientName_);
  }

protected:
  /// Ensure that subclasses inherited from this class are instantiated.
  RestfulDishCtrlBase();
  const std::string dbClientName_{"default"};
};
