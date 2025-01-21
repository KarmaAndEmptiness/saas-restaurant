#ifndef EMPLOYEE_HANDLER_H
#define EMPLOYEE_HANDLER_H
#include "httplib.h"
#include "mysql_connector.h"
// 登录
void login(const httplib::Request &req, httplib::Response &res, MySQLConnector &conn);
// 注册
void reg(const httplib::Request &req, httplib::Response &res, MySQLConnector &conn);

// 修改密码
void changePassword(const httplib::Request &req, httplib::Response &res, MySQLConnector &conn);

// 查询所有员工
void getAllEmployee(const httplib::Request &req, httplib::Response &res, MySQLConnector &conn);

// 更新员工信息
void updateEmployee(const httplib::Request &req, httplib::Response &res, MySQLConnector &conn);

// 删除员工
void deleteEmployee(const httplib::Request &req, httplib::Response &res, MySQLConnector &conn);

// 获取单个员工
void getEmployee(const httplib::Request &req, httplib::Response &res, MySQLConnector &conn);
#endif