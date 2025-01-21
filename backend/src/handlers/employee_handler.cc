#include "employee_handler.h"
#include "password_handler.h"
#include "jwt_handler.h"
#include "json.hpp"

void login(const httplib::Request &req, httplib::Response &res, MySQLConnector &conn)
{
    try
    {
        nlohmann::json jsonData = nlohmann::json::parse(req.body);
        std::string username = jsonData["username"];
        std::string password = jsonData["password"];
        std::cout << "username: " << username << " password: " << hash_password(password) << std::endl;
        if (conn.query("SELECT password FROM employee WHERE username=?", {username}).empty())
        {
            throw std::runtime_error("User not found");
        }
        if (!verify_password(password, conn.query("SELECT password FROM employee WHERE username=?", {username})[0][0]))
        {
            throw std::runtime_error("Invalid password");
        }
        std::string userId = conn.query("SELECT id FROM employee WHERE username=?", {username})[0][0];

        res.status = 200;
        nlohmann::json response_data;
        response_data["message"] = "Login successful";
        response_data["token"] = generate_jwt(userId, username);
        res.set_content(response_data.dump(), "application/json");
    }
    catch (const std::exception &e)
    {
        res.status = 400;
        std::cout << __FILE__ << ": ERROR: " << e.what() << std::endl;
        nlohmann::json response_data;
        response_data["message"] = e.what();
        res.set_content(response_data.dump(), "application/json");
    }
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
    try
    {
        nlohmann::json jsonData = nlohmann::json::parse(req.body);
        std::string username = jsonData["username"];
        std::string password = jsonData["password"];
        std::string real_name = jsonData["realname"];
        std::string phone = jsonData["phone"];
        std::string email = jsonData["email"];

        std::cout << "username: " << username << " password: " << hash_password(password) << " realname: " << real_name << " phone: " << phone << " email: " << email << std::endl;

        if (!conn.query("SELECT username FROM employee WHERE username=?", {username}).empty())
        {
            throw std::runtime_error("User already exists");
        }
        if (!conn.query("SELECT phone FROM employee WHERE phone=?", {phone}).empty())
        {
            throw std::runtime_error("Phone number already exists");
        }

        conn.query("INSERT INTO employee(username,password,real_name,phone,email) VALUES(?,?,?,?,?)", {username, hash_password(password), real_name, phone, email});
        res.status = 200;
        nlohmann::json response_data;
        response_data["message"] = "Registration successful";
        res.set_content(response_data.dump(), "application/json");
    }
    catch (const std::exception &e)
    {
        res.status = 400;
        std::cout << __FILE__ << ": ERROR: " << e.what() << std::endl;
        nlohmann::json response_data;
        response_data["message"] = e.what();
        res.set_content(response_data.dump(), "application/json");
    }
}

void getAllEmployee(const httplib::Request &req, httplib::Response &res, MySQLConnector &conn)
{
    try
    {

        std::vector<std::vector<std::string>> result = conn.query("SELECT id,username,real_name,phone,email,last_login_time FROM employee WHERE status=1");
        // 分页
        int page = 1;
        int size = 10;

        if (req.has_param("page"))
        {
            page = std::stoi(req.get_param_value("page"));
        }
        if (req.has_param("size"))
        {
            size = std::stoi(req.get_param_value("size"));
        }
        std::cout << "page: " << page << " size: " << size << std::endl;

        int start = (page - 1) * size;
        int end = std::min(start + size, (int)result.size());

        std::cout << "start: " << start << " end: " << end << std::endl;

        nlohmann::json response_data;

        for (int i = start; i < end; i++)
        {
            std::vector<std::string> row = result[i];
            nlohmann::json temp;
            temp["id"] = row[0];
            temp["username"] = row[1];
            temp["real_name"] = row[2];
            temp["phone"] = row[3];
            temp["email"] = row[4];
            temp["last_login_time"] = row[5];
            response_data["data"].push_back(temp);
        }
        response_data["message"] = "Get all employee successful";
        response_data["page"] = page;
        response_data["size"] = size;
        response_data["total"] = result.size();

        res.status = 200;
        res.set_content(response_data.dump(), "application/json");
    }
    catch (const std::exception &e)
    {
        res.status = 400;
        std::cout << __FILE__ << ": ERROR: " << e.what() << std::endl;
        nlohmann::json response_data;
        response_data["message"] = e.what();
        res.set_content(response_data.dump(), "application/json");
    }
}

void updateEmployee(const httplib::Request &req, httplib::Response &res, MySQLConnector &conn)
{
    try
    {
        nlohmann::json jsonData = nlohmann::json::parse(req.body);
        std::string id = req.path_params.at("id");
        std::string username = jsonData["username"];
        std::string real_name = jsonData["realname"];
        std::string phone = jsonData["phone"];
        std::string email = jsonData["email"];

        std::cout << "id: " << id << " username: " << username << " realname: " << real_name << " phone: " << phone << " email: " << email << std::endl;

        if (conn.query("SELECT id FROM employee WHERE id=? AND status=1", {id}).empty())
        {
            throw std::runtime_error("Employee not found");
        }

        if (!conn.query("SELECT username FROM employee WHERE username=? AND id<>?", {username, id}).empty())
        {
            throw std::runtime_error("User already exists");
        }
        if (!conn.query("SELECT phone FROM employee WHERE phone=? AND id<>?", {phone, id}).empty())
        {
            throw std::runtime_error("Phone number already exists");
        }

        conn.query("UPDATE employee SET username=?,real_name=?,phone=?,email=? WHERE id=?", {username, real_name, phone, email, id});
        res.status = 200;
        nlohmann::json response_data;
        response_data["message"] = "Update employee successful";
        res.set_content(response_data.dump(), "application/json");
    }
    catch (const std::exception &e)
    {
        res.status = 400;
        std::cout << __FILE__ << ": ERROR: " << e.what() << std::endl;
        nlohmann::json response_data;
        response_data["message"] = e.what();
        res.set_content(response_data.dump(), "application/json");
    }
}

void changePassword(const httplib::Request &req, httplib::Response &res, MySQLConnector &conn)
{
    try
    {
        nlohmann::json jsonData = nlohmann::json::parse(req.body);
        // 获取请求头中的token
        std::string token = req.get_header_value("Authorization");
        // 如果 token 以 "Bearer " 开头，则去掉前缀
        if (token.substr(0, 7) == "Bearer ")
        {
            token = token.substr(7);
        }
        std::cout << "token: " << token << std::endl;
        if (token.empty())
        {
            throw std::runtime_error("No token found in request headers");
        }
        // 解析token
        nlohmann::json payload = decode_jwt(token);
        std::string userId = payload["userId"];
        std::cout << "payload: " << payload.dump() << std::endl;

        std::string password = jsonData["password"];
        std::string new_password = jsonData["newPassword"];

        if (conn.query("SELECT username FROM employee WHERE id=? AND status=1", {userId}).empty())
        {
            throw std::runtime_error("User not found");
        }

        if (!verify_password(password, conn.query("SELECT password FROM employee WHERE userId=?", {userId})[0][0]))
        {
            throw std::runtime_error("Invalid password");
        }

        conn.query("UPDATE employee SET password=? WHERE userId=?", {hash_password(new_password), userId});
        res.status = 200;
        nlohmann::json response_data;
        response_data["message"] = "Change password successful";
        res.set_content(response_data.dump(), "application/json");
    }
    catch (const std::exception &e)
    {
        res.status = 400;
        std::cout << __FILE__ << ": ERROR: " << e.what() << std::endl;
        nlohmann::json response_data;
        response_data["message"] = e.what();
        res.set_content(response_data.dump(), "application/json");
    }
}

void deleteEmployee(const httplib::Request &req, httplib::Response &res, MySQLConnector &conn)
{
    try
    {
        std::string userId = req.path_params.at("id");
        std::cout << userId << std::endl;
        if (conn.query("SELECT id FROM employee WHERE id=? AND status=1", {userId}).empty())
        {
            throw std::runtime_error("Employee not found");
        }
        conn.query("UPDATE employee SET status=0 WHERE id=?", {userId});
        res.status = 200;
        nlohmann::json response_data;
        response_data["message"] = "Delete employee successful";
        res.set_content(response_data.dump(), "application/json");
    }
    catch (const std::exception &e)
    {
        res.status = 400;
        std::cout << __FILE__ << ": ERROR: " << e.what() << std::endl;
        nlohmann::json response_data;
        response_data["message"] = e.what();
        res.set_content(response_data.dump(), "application/json");
    }
}

void getEmployee(const httplib::Request &req, httplib::Response &res, MySQLConnector &conn)
{
    try
    {
        // 从请求路径参数中获取用户 ID
        std::string userId = req.path_params.at("id");
        std::cout << "User ID: " << userId << std::endl;

        // 检查用户是否存在且状态为 1
        if (conn.query("SELECT id FROM employee WHERE id=? AND status=1", {userId}).empty())
        {
            throw std::runtime_error("Employee not found");
        }

        // 查询用户详细信息
        std::vector<std::vector<std::string>> result = conn.query(
            "SELECT id, username, real_name, phone, email,last_login_time FROM employee WHERE id=?", {userId});

        // 将查询结果构建为 JSON
        nlohmann::json response_data;
        response_data["message"] = "Get employee successful";

        if (!result.empty())
        {
            // 数据库结果的第一行是查询到的记录
            const auto &row = result[0];
            response_data["data"] = {
                {"id", row[0]},
                {"username", row[1]},
                {"real_name", row[2]},
                {"phone", row[3]},
                {"email", row[4]},
                {"last_login_time", row[5]}};
        }

        // 设置响应状态和内容
        res.status = 200;
        res.set_content(response_data.dump(), "application/json");
    }
    catch (const std::exception &e)
    {
        res.status = 400;
        std::cout << __FILE__ << ": ERROR: " << e.what() << std::endl;
        nlohmann::json response_data;
        response_data["message"] = e.what();
        res.set_content(response_data.dump(), "application/json");
    }
}