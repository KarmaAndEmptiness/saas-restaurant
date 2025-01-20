#include"server.h"
#include"employee_handler.h"
void setRoutes(httplib::Server &server, MySQLConnector &conn)
{
    std::string baseUrl = "/v1";
    server.Post(baseUrl + "/login", [&](const httplib::Request &req, httplib::Response &res) {
login(req, res, conn);});
server.Post(baseUrl + "/register", [&](const httplib::Request &req, httplib::Response &res) {
reg(req, res, conn);
});
return;
}