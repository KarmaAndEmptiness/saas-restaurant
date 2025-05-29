/**
 *
 *  AuthFilter.h
 *
 */

#pragma once

#include <drogon/HttpFilter.h>
#include <jwt-cpp/jwt.h>
#include <string>

using namespace drogon;

class AuthFilter : public HttpFilter<AuthFilter>
{
public:
  AuthFilter();
  void doFilter(const HttpRequestPtr &req,
                FilterCallback &&fcb,
                FilterChainCallback &&fccb) override;

private:
  bool verifyJWT(const std::string &token);
  std::string jwt_secret_;
};
