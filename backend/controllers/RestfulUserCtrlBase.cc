
/**
 *
 *  RestfulUserCtrlBase.cc
 *  DO NOT EDIT. This file is generated by drogon_ctl automatically.
 *  Users should implement business logic in the derived class.
 */

#include "RestfulUserCtrlBase.h"
#include <string>

void RestfulUserCtrlBase::getOne(const HttpRequestPtr &req,
                                 std::function<void(const HttpResponsePtr &)> &&callback,
                                 User::PrimaryKeyType &&id)
{

    auto dbClientPtr = getDbClient();
    auto callbackPtr =
        std::make_shared<std::function<void(const HttpResponsePtr &)>>(
            std::move(callback));
    drogon::orm::Mapper<User> mapper(dbClientPtr);
    mapper.findByPrimaryKey(
        id,
        [req, callbackPtr, this](User r)
        {
            Json::Value ret;
            ret["code"] = k200OK;
            ret["message"] = "ok";
            ret["data"] = makeJson(req, r);
            (*callbackPtr)(HttpResponse::newHttpJsonResponse(ret));
        },
        [callbackPtr](const DrogonDbException &e)
        {
            const drogon::orm::UnexpectedRows *s = dynamic_cast<const drogon::orm::UnexpectedRows *>(&e.base());
            if (s)
            {
                Json::Value ret;
                ret["code"] = k404NotFound;
                ret["message"] = "the user is not found";
                auto resp = HttpResponse::newHttpResponse();
                resp->setStatusCode(k404NotFound);
                (*callbackPtr)(resp);
                return;
            }
            LOG_ERROR << e.base().what();
            Json::Value ret;
            ret["code"] = k500InternalServerError;
            ret["message"] = "database error";
            auto resp = HttpResponse::newHttpJsonResponse(ret);
            (*callbackPtr)(resp);
        });
}

void RestfulUserCtrlBase::updateOne(const HttpRequestPtr &req,
                                    std::function<void(const HttpResponsePtr &)> &&callback,
                                    User::PrimaryKeyType &&id)
{
    auto jsonPtr = req->jsonObject();
    if (!jsonPtr)
    {
        Json::Value ret;
        ret["code"] = k400BadRequest;
        ret["message"] = "No json object is found in the request";
        auto resp = HttpResponse::newHttpJsonResponse(ret);
        callback(resp);
        return;
    }
    User object;
    std::string err;
    if (!doCustomValidations(*jsonPtr, err))
    {
        Json::Value ret;
        ret["code"] = k400BadRequest;
        ret["message"] = err;
        auto resp = HttpResponse::newHttpJsonResponse(ret);
        callback(resp);
        return;
    }
    try
    {
        if (isMasquerading())
        {
            if (!User::validateMasqueradedJsonForUpdate(*jsonPtr, masqueradingVector(), err))
            {
                Json::Value ret;
                ret["code"] = k400BadRequest;
                ret["message"] = err;
                auto resp = HttpResponse::newHttpJsonResponse(ret);
                callback(resp);
                return;
            }
            object.updateByMasqueradedJson(*jsonPtr, masqueradingVector());
        }
        else
        {
            if (!User::validateJsonForUpdate(*jsonPtr, err))
            {
                Json::Value ret;
                ret["code"] = k400BadRequest;
                ret["message"] = err;
                auto resp = HttpResponse::newHttpJsonResponse(ret);
                callback(resp);
                return;
            }
            object.updateByJson(*jsonPtr);
        }
    }
    catch (const Json::Exception &e)
    {
        LOG_ERROR << e.what();
        Json::Value ret;
        ret["code"] = k400BadRequest;
        ret["message"] = "Field type error";
        auto resp = HttpResponse::newHttpJsonResponse(ret);
        callback(resp);
        return;
    }
    if (object.getPrimaryKey() != id)
    {
        Json::Value ret;
        ret["code"] = k400BadRequest;
        ret["message"] = "Bad primary key";
        auto resp = HttpResponse::newHttpJsonResponse(ret);
        callback(resp);
        return;
    }

    auto dbClientPtr = getDbClient();
    auto callbackPtr =
        std::make_shared<std::function<void(const HttpResponsePtr &)>>(
            std::move(callback));
    drogon::orm::Mapper<User> mapper(dbClientPtr);

    mapper.update(
        object,
        [callbackPtr](const size_t count)
        {
            if (count == 1)
            {
                Json::Value ret;
                ret["code"] = k200OK;
                ret["message"] = "ok";
                auto resp = HttpResponse::newHttpJsonResponse(ret);
                (*callbackPtr)(resp);
            }
            else if (count == 0)
            {
                Json::Value ret;
                ret["code"] = k200OK;
                ret["message"] = "No resources are updated";
                auto resp = HttpResponse::newHttpJsonResponse(ret);
                (*callbackPtr)(resp);
            }
            else
            {
                LOG_FATAL << "More than one resource is updated: " << count;
                Json::Value ret;
                ret["code"] = k500InternalServerError;
                ret["message"] = "database error";
                auto resp = HttpResponse::newHttpJsonResponse(ret);
                (*callbackPtr)(resp);
            }
        },
        [callbackPtr](const DrogonDbException &e)
        {
            LOG_ERROR << e.base().what();
            Json::Value ret;
            ret["code"] = k500InternalServerError;
            ret["message"] = "database error";
            auto resp = HttpResponse::newHttpJsonResponse(ret);
            (*callbackPtr)(resp);
        });
}

void RestfulUserCtrlBase::deleteOne(const HttpRequestPtr &req,
                                    std::function<void(const HttpResponsePtr &)> &&callback,
                                    User::PrimaryKeyType &&id)
{

    auto dbClientPtr = getDbClient();
    auto callbackPtr =
        std::make_shared<std::function<void(const HttpResponsePtr &)>>(
            std::move(callback));
    drogon::orm::Mapper<User> mapper(dbClientPtr);
    mapper.deleteByPrimaryKey(
        id,
        [callbackPtr](const size_t count)
        {
            if (count == 1)
            {
                auto resp = HttpResponse::newHttpResponse();
                resp->setStatusCode(k204NoContent);
                (*callbackPtr)(resp);
            }
            else if (count == 0)
            {
                Json::Value ret;
                ret["error"] = "No resources deleted";
                auto resp = HttpResponse::newHttpJsonResponse(ret);
                resp->setStatusCode(k404NotFound);
                (*callbackPtr)(resp);
            }
            else
            {
                LOG_FATAL << "Delete more than one records: " << count;
                Json::Value ret;
                ret["error"] = "Database error";
                auto resp = HttpResponse::newHttpJsonResponse(ret);
                resp->setStatusCode(k500InternalServerError);
                (*callbackPtr)(resp);
            }
        },
        [callbackPtr](const DrogonDbException &e)
        {
            LOG_ERROR << e.base().what();
            Json::Value ret;
            ret["error"] = "database error";
            auto resp = HttpResponse::newHttpJsonResponse(ret);
            resp->setStatusCode(k500InternalServerError);
            (*callbackPtr)(resp);
        });
}

void RestfulUserCtrlBase::get(const HttpRequestPtr &req,
                              std::function<void(const HttpResponsePtr &)> &&callback)
{
    auto dbClientPtr = getDbClient();
    drogon::orm::Mapper<User> mapper(dbClientPtr);
    auto &parameters = req->parameters();
    auto iter = parameters.find("sort");
    if (iter != parameters.end())
    {
        auto sortFields = drogon::utils::splitString(iter->second, ",");
        for (auto &field : sortFields)
        {
            if (field.empty())
                continue;
            if (field[0] == '+')
            {
                field = field.substr(1);
                mapper.orderBy(field, SortOrder::ASC);
            }
            else if (field[0] == '-')
            {
                field = field.substr(1);
                mapper.orderBy(field, SortOrder::DESC);
            }
            else
            {
                mapper.orderBy(field, SortOrder::ASC);
            }
        }
    }
    iter = parameters.find("offset");
    if (iter != parameters.end())
    {
        try
        {
            auto offset = std::stoll(iter->second);
            mapper.offset(offset);
        }
        catch (...)
        {
            Json::Value ret;
            ret["code"] = k400BadRequest;
            ret["message"] = "Invalid offset parameter";
            auto resp = HttpResponse::newHttpJsonResponse(ret);
            callback(resp);
            return;
        }
    }
    iter = parameters.find("limit");
    if (iter != parameters.end())
    {
        try
        {
            auto limit = std::stoll(iter->second);
            mapper.limit(limit);
        }
        catch (...)
        {
            Json::Value ret;
            ret["code"] = k400BadRequest;
            ret["message"] = "Invalid limit parameter";
            auto resp = HttpResponse::newHttpJsonResponse(ret);
            callback(resp);
            return;
        }
    }
    auto callbackPtr =
        std::make_shared<std::function<void(const HttpResponsePtr &)>>(
            std::move(callback));
    auto jsonPtr = req->jsonObject();
    if (jsonPtr && jsonPtr->isMember("filter"))
    {
        try
        {
            auto criteria = makeCriteria((*jsonPtr)["filter"]);
            mapper.findBy(criteria, [req, callbackPtr, this](const std::vector<User> &v)
                          {
                    Json::Value list;
                    Json::Value ret;
                    list.resize(0);
                    for (auto &obj : v)
                    {
                        if(obj.getValueOfIsDeleted())
                        continue;
                        list.append(makeJson(req, obj));
                    }
                    ret["code"] = k200OK;
                    ret["message"] = "ok";
                    ret["data"] = list;
                    (*callbackPtr)(HttpResponse::newHttpJsonResponse(ret)); }, [callbackPtr](const DrogonDbException &e)
                          { 
                    LOG_ERROR << e.base().what();
                    Json::Value ret;
                    ret["code"] = k500InternalServerError;
                    ret["message"] = "database error";
                    auto resp = HttpResponse::newHttpJsonResponse(ret);
                    (*callbackPtr)(resp); });
        }
        catch (const std::exception &e)
        {
            LOG_ERROR << e.what();
            Json::Value ret;
            ret["code"] = k400BadRequest;
            ret["message"] = e.what();
            auto resp = HttpResponse::newHttpJsonResponse(ret);
            (*callbackPtr)(resp);
            return;
        }
    }
    else
    {
        mapper.findAll([req, callbackPtr, this](const std::vector<User> &v)
                       {
                Json::Value list;
                Json::Value ret;
                list.resize(0);
                for (auto &obj : v)
                {
                    if(obj.getValueOfIsDeleted())
                        continue;
                    list.append(makeJson(req, obj));
                }
                ret["code"] = k200OK;
                ret["message"] = "ok";
                ret["data"] = list;
                (*callbackPtr)(HttpResponse::newHttpJsonResponse(ret)); },
                       [callbackPtr](const DrogonDbException &e)
                       {
                           LOG_ERROR << e.base().what();
                           Json::Value ret;
                           ret["code"] = k500InternalServerError;
                           ret["message"] = "database error";
                           auto resp = HttpResponse::newHttpJsonResponse(ret);
                           (*callbackPtr)(resp);
                       });
    }
}

void RestfulUserCtrlBase::create(const HttpRequestPtr &req,
                                 std::function<void(const HttpResponsePtr &)> &&callback)
{
    auto jsonPtr = req->jsonObject();
    if (!jsonPtr)
    {
        Json::Value ret;
        ret["code"] = k400BadRequest;
        ret["message"] = "No json object is found in the request";
        auto resp = HttpResponse::newHttpJsonResponse(ret);
        callback(resp);
        return;
    }
    std::string err;
    if (!doCustomValidations(*jsonPtr, err))
    {
        Json::Value ret;
        ret["code"] = k400BadRequest;
        ret["message"] = err;
        auto resp = HttpResponse::newHttpJsonResponse(ret);
        callback(resp);
        return;
    }
    if (isMasquerading())
    {
        if (!User::validateMasqueradedJsonForCreation(*jsonPtr, masqueradingVector(), err))
        {
            Json::Value ret;
            ret["code"] = k400BadRequest;
            ret["message"] = err;
            auto resp = HttpResponse::newHttpJsonResponse(ret);
            callback(resp);
            return;
        }
    }
    else
    {
        if (!User::validateJsonForCreation(*jsonPtr, err))
        {
            Json::Value ret;
            ret["code"] = k400BadRequest;
            ret["message"] = err;
            auto resp = HttpResponse::newHttpJsonResponse(ret);
            callback(resp);
            return;
        }
    }
    try
    {
        User object =
            (isMasquerading() ? User(*jsonPtr, masqueradingVector()) : User(*jsonPtr));
        auto dbClientPtr = getDbClient();
        auto callbackPtr =
            std::make_shared<std::function<void(const HttpResponsePtr &)>>(
                std::move(callback));
        drogon::orm::Mapper<User> mapper(dbClientPtr);

        auto criteria = drogon::orm::Criteria("username", object.getValueOfUsername()) &&
                        drogon::orm::Criteria("is_deleted", 0);
        std::vector<drogon_model::saas_restaurant::User> users = mapper.findBy(criteria);
        if (!users.empty())
        {
            Json::Value ret;
            ret["code"] = k400BadRequest;
            ret["message"] = "Username already exists";
            auto resp = HttpResponse::newHttpJsonResponse(ret);
            (*callbackPtr)(resp);
            return;
        }
        mapper.insert(
            object,
            [req, callbackPtr, this](User newObject)
            {
                Json::Value ret;
                ret["code"] = k200OK;
                ret["message"] = "ok";
                ret["data"]["user_id"] = newObject.getPrimaryKey();
                (*callbackPtr)(HttpResponse::newHttpJsonResponse(ret));
            },
            [callbackPtr](const DrogonDbException &e)
            {
                LOG_ERROR << e.base().what();
                Json::Value ret;
                ret["code"] = k500InternalServerError;
                ret["message"] = "database error";
                auto resp = HttpResponse::newHttpJsonResponse(ret);
                (*callbackPtr)(resp);
            });
    }
    catch (const Json::Exception &e)
    {
        LOG_ERROR << e.what();
        Json::Value ret;
        ret["code"] = k400BadRequest;
        ret["message"] = "Field type error";
        auto resp = HttpResponse::newHttpJsonResponse(ret);
        callback(resp);
        return;
    }
}

/*
void RestfulUserCtrlBase::update(const HttpRequestPtr &req,
                                 std::function<void(const HttpResponsePtr &)> &&callback)
{

}*/

RestfulUserCtrlBase::RestfulUserCtrlBase()
    : RestfulController({"user_id",
                         "tenant_id",
                         "username",
                         "password",
                         "email",
                         "phone",
                         "avatar_url",
                         "gender",
                         "birthday",
                         "province",
                         "city",
                         "address",
                         "created_at",
                         "updated_at",
                         "last_login",
                         "is_deleted",
                         "status"})
{
    /**
     * The items in the vector are aliases of column names in the table.
     * if one item is set to an empty string, the related column is not sent
     * to clients.
     */
    enableMasquerading({
        "user_id",    // the alias for the user_id column.
        "tenant_id",  // the alias for the tenant_id column.
        "username",   // the alias for the username column.
        "password",   // the alias for the password column.
        "email",      // the alias for the email column.
        "phone",      // the alias for the phone column.
        "avatar_url", // the alias for the avatar_url column.
        "gender",     // the alias for the gender column.
        "birthday",   // the alias for the birthday column.
        "province",   // the alias for the province column.
        "city",       // the alias for the city column.
        "address",    // the alias for the address column.
        "created_at", // the alias for the created_at column.
        "updated_at", // the alias for the updated_at column.
        "last_login", // the alias for the last_login column.
        "is_deleted", // the alias for the is_deleted column.
        "status"      // the alias for the status column.
    });
}
