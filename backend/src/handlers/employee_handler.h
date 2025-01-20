#ifndef EMPLOYEE_HANDLER_H
#define EMPLOYEE_HANDLER_H
#include"httplib.h"
#include"mysql_connector.h"
void login(const httplib::Request &req, httplib::Response &res, MySQLConnector &conn);
void reg (const httplib::Request &req, httplib::Response &res, MySQLConnector &conn);
#endif