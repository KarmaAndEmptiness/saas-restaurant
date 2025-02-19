#ifndef CONTROLLERS_ADMIN_CONTROLLER_H_
#define CONTROLLERS_ADMIN_CONTROLLER_H_

#include <memory>
#include "services/admin_service.h"
#include "nlohmann/json.hpp"
#include "httplib.h"
namespace controllers
{
    class AdminController
    {
    public:
        AdminController();

        // 员工管理接口
        void HandleGetStaffList(const httplib::Request &req, httplib::Response &res);
        void HandleCreateStaff(const httplib::Request &req, httplib::Response &res);
        void HandleUpdateStaff(const httplib::Request &req, httplib::Response &res);
        void HandleDeleteStaff(const httplib::Request &req, httplib::Response &res);
        void HandleImportStaff(const httplib::Request &req, httplib::Response &res);
        void HandleExportStaff(const httplib::Request &req, httplib::Response &res);

        // 角色管理接口
        void HandleGetRoleList(const httplib::Request &req, httplib::Response &res);
        void HandleCreateRole(const httplib::Request &req, httplib::Response &res);
        void HandleUpdateRole(const httplib::Request &req, httplib::Response &res);
        void HandleDeleteRole(const httplib::Request &req, httplib::Response &res);
        void HandleUpdateRolePermissions(const httplib::Request &req, httplib::Response &res);

        // 权限管理接口
        void HandleGetPermissionList(const httplib::Request &req, httplib::Response &res);
        void HandleCreatePermission(const httplib::Request &req, httplib::Response &res);
        void HandleUpdatePermission(const httplib::Request &req, httplib::Response &res);
        void HandleDeletePermission(const httplib::Request &req, httplib::Response &res);

        // 系统日志接口
        void HandleGetLogList(const httplib::Request &req, httplib::Response &res);
        void HandleExportLogs(const httplib::Request &req, httplib::Response &res);

    private:
        std::unique_ptr<services::AdminService> admin_service_;

        // 工具方法
        std::string ExtractIdFromPath(const std::string &path);
        bool ValidateStaffData(const nlohmann::json &data);
        bool ValidateRoleData(const nlohmann::json &data);
        bool ValidatePermissionData(const nlohmann::json &data);
    };

} // namespace controllers

#endif // CONTROLLERS_ADMIN_CONTROLLER_H_