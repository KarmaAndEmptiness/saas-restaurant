#ifndef JWT_HANDLER_H
#define JWT_HANDLER_H
#include <string>
#include <jwt-cpp/jwt.h>
#include "json.hpp"
std::string generate_jwt(std::string &userId, std::string &username);
nlohmann::json decode_jwt(std::string &token);
#endif