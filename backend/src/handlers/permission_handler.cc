#include "permission_handler.h"
#include "json.hpp"
void getPermissions(const httplib::Request &req, httplib::Response &res, MySQLConnector &conn)
{
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
    try
    {
        res.status = 200;
        nlohmann::json response_data;
        response_data["message"] = "Get permissions successful";
        response_data["permissions"] = conn.query("SELECT * FROM permission");
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