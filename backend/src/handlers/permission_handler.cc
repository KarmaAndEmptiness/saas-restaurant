#include "permission_handler.h"
#include "json.hpp"
//    CREATE TABLE `permission` (
//   `id` bigint NOT NULL AUTO_INCREMENT COMMENT '权限ID',
//   `parent_id` bigint DEFAULT NULL COMMENT '父权限ID',
//   `perm_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '权限名称',
//   `perm_type` tinyint NOT NULL COMMENT '权限类型(1:菜单,2:按钮,3:接口)',
//   `perm_code` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '权限标识',
//   `status` tinyint NOT NULL DEFAULT '1' COMMENT '状态(1:启用,0:禁用)',
//   `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
//   `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
//   PRIMARY KEY (`id`),
//   UNIQUE KEY `uk_perm_code` (`perm_code`)
// ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='权限表'

//   CREATE TABLE `role_permission` (
//   `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'ID',
//   `role_id` bigint NOT NULL COMMENT '角色ID',
//   `permission_id` bigint NOT NULL COMMENT '权限ID',
//   `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
//   PRIMARY KEY (`id`),
//   KEY `idx_role_id` (`role_id`),
//   KEY `idx_permission_id` (`permission_id`),
//   CONSTRAINT `fk_permission_id` FOREIGN KEY (`permission_id`) REFERENCES `permission` (`id`) ON DELETE CASCADE,
//   CONSTRAINT `fk_role_id` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`) ON DELETE CASCADE
// ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='角色权限关联表'

//    CREATE TABLE `role` (
//   `id` bigint NOT NULL AUTO_INCREMENT COMMENT '角色ID',
//   `role_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '角色名称',
//   `role_desc` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '角色描述',
//   `status` tinyint NOT NULL DEFAULT '1' COMMENT '状态(1:启用,0:禁用)',
//   `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
//   `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
//   PRIMARY KEY (`id`),
//   UNIQUE KEY `uk_role_name` (`role_name`)
// ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='角色表'
void getPermissions(const httplib::Request &req, httplib::Response &res, MySQLConnector &conn)
{

    try
    {

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

void createRole(const httplib::Request &req, httplib::Response &res, MySQLConnector &conn)
{

    // 请求体:
    // jsonCopy code
    // {
    //     "name": "string",           // 角色名称
    //     "description": "string",    // 角色描述
    //     "permissions": ["string"]   // 权限代码列表
    // }

    //  响应体:
    //  jsonCopy code
    //  {
    //      "code": 200,
    //      "message": "success",
    //      "data": {
    //          "id": "string",
    //          "name": "string",
    //          "description": "string",
    //          "permissions": ["string"],
    //          "createTime": "string",
    //          "updateTime": "string"
    //      }
    //  }

    try
    {

        nlohmann::json jsonData = nlohmann::json::parse(req.body);
        std::string role_name = jsonData["roleName"];
        std::string role_desc = jsonData["roleDesc"];
        std::vector<std::string> permissions = jsonData["permissions"];
        std::cout << "role_name: " << role_name << " role_desc: " << role_desc << std::endl;

        if (!conn.query("SELECT role_name FROM role WHERE role_name=? AND status=1", {role_name}).empty())
        {
            throw std::runtime_error("Role name already exists");
        }
        conn.execute("INSERT INTO role (role_name, role_desc) VALUES (?, ?)", {role_name, role_desc});
        std::string role_id = conn.query("SELECT id FROM role WHERE role_name=? AND status=1", {role_name})[0][0];
        if (!permissions.empty())
        {
            for (const auto &permission : permissions)
            {
                std::cout << "permission: " << permission << std::endl;
                if (conn.query("SELECT id FROM permission WHERE perm_code=?", {permission}).empty())
                {
                    throw std::runtime_error("Permission not found");
                }
                conn.execute("INSERT INTO role_permission (role_id, permission_id) VALUES (?, ?)", {role_id, conn.query("SELECT id FROM permission WHERE perm_code=?", {permission})[0][0]});
            }
        }

        nlohmann::json response_data;
        response_data["code"] = 200;
        response_data["message"] = "success";
        response_data["data"]["id"] = role_id;
        response_data["data"]["name"] = role_name;
        response_data["data"]["description"] = role_desc;
        response_data["data"]["permissions"] = permissions;
        response_data["data"]["createTime"] = conn.query("SELECT create_time FROM role WHERE id=?", {role_id})[0][0];
        response_data["data"]["updateTime"] = conn.query("SELECT update_time FROM role WHERE id=?", {role_id})[0][0];
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