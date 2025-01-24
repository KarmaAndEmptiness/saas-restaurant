#include "server.h"
#include "employee_handler.h"
#include "permission_handler.h"
void setRoutes(httplib::Server &server, MySQLConnector &conn)
{
    std::string baseUrl = "/v1";
    server.Post(baseUrl + "/login", [&](const httplib::Request &req, httplib::Response &res)
                { login(req, res, conn); });
    server.Post(baseUrl + "/register", [&](const httplib::Request &req, httplib::Response &res)
                { reg(req, res, conn); });

    server.Get(baseUrl + "/employees", [&](const httplib::Request &req, httplib::Response &res)
               { getAllEmployee(req, res, conn); });

    // 修改密码
    server.Put(baseUrl + "/changePassword", [&](const httplib::Request &req, httplib::Response &res)
               { changePassword(req, res, conn); });

    // 更新员工信息
    server.Put(baseUrl + "/updateEmployee/:id", [&](const httplib::Request &req, httplib::Response &res)
               { updateEmployee(req, res, conn); });

    // 删除员工
    server.Delete(baseUrl + "/deleteEmployee/:id", [&](const httplib::Request &req, httplib::Response &res)
                  { deleteEmployee(req, res, conn); });

    // 获取单个员工
    server.Get(baseUrl + "/employee/:id", [&](const httplib::Request &req, httplib::Response &res)
               { getEmployee(req, res, conn); });

    // 获取权限列表
    server.Get(baseUrl + "/permissions", [&](const httplib::Request &req, httplib::Response &res)
               { getPermissions(req, res, conn); });

    // 创建角色
    server.Post(baseUrl + "/createRole", [&](const httplib::Request &req, httplib::Response &res)
                { createRole(req, res, conn); });

    return;
}