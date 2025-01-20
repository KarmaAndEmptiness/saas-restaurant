#ifndef GENERATE_JWT_H
#define GENERATE_JWT_H
#include <string>
#include<jwt-cpp/jwt.h>
std::string generate_jwt(std::string username);
#endif