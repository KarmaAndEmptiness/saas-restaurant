/**
 *
 *  RestfulOrderTableCtrl.cc
 *  This file is generated by drogon_ctl
 *
 */

#include "RestfulOrderTableCtrl.h"
#include <string>


void RestfulOrderTableCtrl::getOne(const HttpRequestPtr &req,
                                   std::function<void(const HttpResponsePtr &)> &&callback,
                                   OrderTable::PrimaryKeyType &&id)
{
    RestfulOrderTableCtrlBase::getOne(req, std::move(callback), std::move(id));
}


void RestfulOrderTableCtrl::updateOne(const HttpRequestPtr &req,
                                      std::function<void(const HttpResponsePtr &)> &&callback,
                                      OrderTable::PrimaryKeyType &&id)
{
    RestfulOrderTableCtrlBase::updateOne(req, std::move(callback), std::move(id));
}


void RestfulOrderTableCtrl::deleteOne(const HttpRequestPtr &req,
                                      std::function<void(const HttpResponsePtr &)> &&callback,
                                      OrderTable::PrimaryKeyType &&id)
{
    RestfulOrderTableCtrlBase::deleteOne(req, std::move(callback), std::move(id));
}

void RestfulOrderTableCtrl::get(const HttpRequestPtr &req,
                                std::function<void(const HttpResponsePtr &)> &&callback)
{
    RestfulOrderTableCtrlBase::get(req, std::move(callback));
}

void RestfulOrderTableCtrl::create(const HttpRequestPtr &req,
                                   std::function<void(const HttpResponsePtr &)> &&callback)
{
    RestfulOrderTableCtrlBase::create(req, std::move(callback));
}
