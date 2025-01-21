#ifndef JWT_HANDLER_H
#define JWT_HANDLER_H
#include <string>
#include<jwt-cpp/jwt.h>
std::string generate_jwt(std::string username);
std::string decode_jwt(std::string token);
#endif