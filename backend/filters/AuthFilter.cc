/**
 *
 *  AuthFilter.cc
 *
 */

#include "AuthFilter.h"
#include <jwt-cpp/jwt.h>
#include <chrono>
#include <drogon/drogon.h>

AuthFilter::AuthFilter()
{
    // 从配置文件读取 JWT secret
    auto &config = drogon::app().getCustomConfig();
    if (config.isMember("jwt") && config["jwt"].isMember("secret"))
    {
        jwt_secret_ = config["jwt"]["secret"].asString();
    }
    else
    {
        LOG_ERROR << "JWT secret not found in config file";
        throw std::runtime_error("JWT secret not configured");
    }
}

using namespace drogon;

void AuthFilter::doFilter(const HttpRequestPtr &req,
                          FilterCallback &&fcb,
                          FilterChainCallback &&fccb)
{
    // 获取 Authorization header
    const auto &header = req->getHeader("Authorization");

    if (header.empty() || header.substr(0, 7) != "Bearer ")
    {
        auto res = HttpResponse::newHttpResponse();
        res->setStatusCode(k401Unauthorized);
        res->setBody("Unauthorized: No token provided");
        fcb(res);
        return;
    }

    // 提取 token
    std::string token = header.substr(7);

    // 验证 token
    if (verifyJWT(token))
    {
        fccb();
        return;
    }

    auto res = HttpResponse::newHttpResponse();
    res->setStatusCode(k401Unauthorized);
    res->setBody("Unauthorized: Invalid token");
    fcb(res);
}

bool AuthFilter::verifyJWT(const std::string &token)
{
    try
    {
        // 验证 token
        auto decoded = jwt::decode(token);

        // 验证签名
        auto verifier = jwt::verify()
                            .allow_algorithm(jwt::algorithm::hs256{jwt_secret_}); // 使用配置的密钥

        verifier.verify(decoded);

        // 验证过期时间
        const auto exp = decoded.get_payload_claim("exp");
        if (exp.empty())
        {
            return false;
        }

        const auto now = std::chrono::system_clock::now();
        const auto exp_time = std::chrono::system_clock::from_time_t(exp.as_int());

        if (now > exp_time)
        {
            return false;
        }

        return true;
    }
    catch (const std::exception &)
    {
        return false;
    }
}
