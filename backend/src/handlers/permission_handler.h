#ifndef PERMISSION_HANDLER_H
#define PERMISSION_HANDLER_H
#include "httplib.h"
#include "mysql_connector.h"
void getPermissions(const httplib::Request &req, httplib::Response &res, MySQLConnector &conn);
#endif