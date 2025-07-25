/**
 *
 *  RestfulMemberCtrl.h
 *  This file is generated by drogon_ctl
 *
 */

#pragma once

#include <drogon/HttpController.h>
#include "RestfulMemberCtrlBase.h"

#include "Member.h"
using namespace drogon;
using namespace drogon_model::saas_restaurant;
/**
 * @brief this class is created by the drogon_ctl command.
 * this class is a restful API controller for reading and writing the member table.
 */

class RestfulMemberCtrl : public drogon::HttpController<RestfulMemberCtrl>, public RestfulMemberCtrlBase
{
public:
  METHOD_LIST_BEGIN
  ADD_METHOD_TO(RestfulMemberCtrl::getOne, "/api/member/{1}", Get, Options, "AuthFilter");
  ADD_METHOD_TO(RestfulMemberCtrl::updateOne, "/api/member/{1}", Put, Options, "AuthFilter");
  ADD_METHOD_TO(RestfulMemberCtrl::deleteOne, "/api/member/{1}", Delete, Options, "AuthFilter");
  ADD_METHOD_TO(RestfulMemberCtrl::get, "/api/member", Get, Options, "AuthFilter");
  ADD_METHOD_TO(RestfulMemberCtrl::create, "/api/member", Post, Options, "AuthFilter");
  // ADD_METHOD_TO(RestfulMemberCtrl::update,"/api/member",Put,Options,"AuthFilter");
  METHOD_LIST_END

  void getOne(const HttpRequestPtr &req,
              std::function<void(const HttpResponsePtr &)> &&callback,
              Member::PrimaryKeyType &&id);
  void updateOne(const HttpRequestPtr &req,
                 std::function<void(const HttpResponsePtr &)> &&callback,
                 Member::PrimaryKeyType &&id);
  void deleteOne(const HttpRequestPtr &req,
                 std::function<void(const HttpResponsePtr &)> &&callback,
                 Member::PrimaryKeyType &&id);
  void get(const HttpRequestPtr &req,
           std::function<void(const HttpResponsePtr &)> &&callback);
  void create(const HttpRequestPtr &req,
              std::function<void(const HttpResponsePtr &)> &&callback);
};
