#ifndef SERVICES_ADMIN_SERVICE_H_
#define SERVICES_ADMIN_SERVICE_H_

#include <string>
#include <vector>
#include <memory>
#include "models/staff.h"
#include "models/role.h"
#include "models/permission.h"
#include "models/system_log.h"

namespace services
{
    class AdminService
    {
    public:
        AdminService() = default;

        // 员工管理
        std::vector<models::Staff> GetStaffList();
        models::Staff GetStaffById(const std::string &id);
        std::string CreateStaff(const models::Staff &staff);
        bool UpdateStaff(const std::string &id, const models::Staff &staff);
        bool DeleteStaff(const std::string &id);
        bool ImportStaffData(const std::string &file_content);
        std::string ExportStaffData();

        // 角色管理
        std::vector<models::Role> GetRoleList();
        models::Role GetRoleById(const std::string &id);
        std::string CreateRole(const models::Role &role);
        bool UpdateRole(const std::string &id, const models::Role &role);
        bool DeleteRole(const std::string &id);
        bool UpdateRolePermissions(const std::string &id, const std::vector<std::string> &permissions);

        // 权限管理
        std::vector<models::Permission> GetPermissionList();
        models::Permission GetPermissionById(const std::string &id);
        std::string CreatePermission(const models::Permission &permission);
        bool UpdatePermission(const std::string &id, const models::Permission &permission);
        bool DeletePermission(const std::string &id);

        // 系统日志
        std::vector<models::SystemLog> GetLogList(const std::string &start_time = "",
                                                  const std::string &end_time = "",
                                                  const std::string &type = "",
                                                  const std::string &operator_name = "");
        std::string ExportLogs(const std::string &start_time = "",
                               const std::string &end_time = "",
                               const std::string &type = "",
                               const std::string &operator_name = "");

    private:
        // 模拟数据存储
        std::vector<models::Staff> mock_staff_list_;
        std::vector<models::Role> mock_role_list_;
        std::vector<models::Permission> mock_permission_list_;
        std::vector<models::SystemLog> mock_log_list_;

        // 初始化模拟数据
        void InitializeMockData();
    };

} // namespace services

#endif // SERVICES_ADMIN_SERVICE_H_