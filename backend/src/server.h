#ifndef SERVER_H
#define SERVER_H
#include"httplib.h"
#include"mysql_connector.h"
void setRoutes(httplib::Server &server, MySQLConnector &conn);
#endif