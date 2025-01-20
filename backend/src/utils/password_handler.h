#ifndef PASSWORD_HANDLER_H
#define PASSWORD_HANDLER_H
#include <sodium.h>
#include <iostream>
#include <string>

std::string hash_password(const std::string& password);

bool verify_password(const std::string& password, const std::string& stored_hash); 
#endif