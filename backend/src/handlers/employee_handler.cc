#include"employee_handler.h"
#include"password_handler.h"
#include"generate_jwt.h"
#include"json.hpp"

void login(const httplib::Request &req, httplib::Response &res, MySQLConnector &conn)
{
    try{
        nlohmann::json jsonData=nlohmann::json::parse(req.body);
        std::string username=jsonData["username"];
        std::string password=jsonData["password"];
        std::cout<<"username: "<<username<<" password: "<<hash_password(password)<<std::endl;
if(conn.query("SELECT password FROM employee WHERE username=?",{username}).empty())
{
    throw std::runtime_error("User not found");
}
if(!verify_password(password,conn.query("SELECT password FROM employee WHERE username=?",{username})[0][0]))
{
    throw std::runtime_error("Invalid password");
}

        res.status=200;
        nlohmann::json response_data;
        response_data["message"] = "Login successful";
        response_data["token"] = generate_jwt(username);
        res.set_content(response_data.dump(), "application/json");
    }catch(const std::exception& e){
        res.status=400;
        std::cout<<__FILE__<<": ERROR: "<<e.what()<<std::endl;
        res.set_content("{'message': 'Bad Request'}", "application/json");}
}

void reg(const httplib::Request &req, httplib::Response &res, MySQLConnector &conn)
{
//    CREATE TABLE `employee` (
//   `id` bigint NOT NULL AUTO_INCREMENT COMMENT '员工ID',
//   `username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '用户名',
//   `password` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '密码(加密存储)',
//   `real_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '真实姓名',
//   `phone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '手机号',
//   `email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '邮箱',
//   `status` tinyint NOT NULL DEFAULT '1' COMMENT '状态(1:启用,0:禁用)',
//   `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
//   `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
//   `last_login_time` datetime DEFAULT NULL COMMENT '最后登录时间',
//   PRIMARY KEY (`id`),
//   UNIQUE KEY `uk_username` (`username`),
//   UNIQUE KEY `uk_phone` (`phone`)
// ) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='员工表' 
    try{
        nlohmann::json jsonData=nlohmann::json::parse(req.body);
        std::string username=jsonData["username"];
        std::string password=jsonData["password"];
        std::string real_name=jsonData["realname"];
        std::string phone=jsonData["phone"];



             
    }catch(const std::exception& e){
        res.status=400;
        res.set_content("{'message': 'Bad Request'}", "application/json");
    }
}