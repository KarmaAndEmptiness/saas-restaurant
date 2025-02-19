#include "services/admin_service.h"
#include <sstream>
#include <algorithm>
#include <iostream>
namespace services
{
    std::vector<models::Staff> AdminService::GetStaffList()
    {
        if (mock_staff_list_.empty())
        {
            // 生成模拟数据
            for (int i = 0; i < 20; ++i)
            {
                mock_staff_list_.push_back(models::Staff::CreateMockStaff(i));
            }
        }
        return mock_staff_list_;
    }

    models::Staff AdminService::GetStaffById(const std::string &id)
    {
        auto it = std::find_if(mock_staff_list_.begin(), mock_staff_list_.end(),
                               [&id](const models::Staff &staff)
                               {
                                   return staff.GetId() == id;
                               });
        if (it != mock_staff_list_.end())
        {
            return *it;
        }
        return models::Staff();
    }

    std::string AdminService::CreateStaff(const models::Staff &staff)
    {
        // 在实际项目中，这里应该生成唯一ID
        mock_staff_list_.push_back(staff);
        return staff.GetId();
    }

    bool AdminService::UpdateStaff(const std::string &id, const models::Staff &staff)
    {
        auto it = std::find_if(mock_staff_list_.begin(), mock_staff_list_.end(),
                               [&id](const models::Staff &s)
                               {
                                   return s.GetId() == id;
                               });
        if (it != mock_staff_list_.end())
        {
            *it = staff;
            return true;
        }
        return false;
    }

    bool AdminService::DeleteStaff(const std::string &id)
    {
        auto it = std::find_if(mock_staff_list_.begin(), mock_staff_list_.end(),
                               [&id](const models::Staff &staff)
                               {
                                   return staff.GetId() == id;
                               });
        if (it != mock_staff_list_.end())
        {
            mock_staff_list_.erase(it);
            return true;
        }
        return false;
    }

    // 角色管理实现
    std::vector<models::Role> AdminService::GetRoleList()
    {
        if (mock_role_list_.empty())
        {
            // 生成模拟数据
            for (int i = 0; i < 10; ++i)
            {
                mock_role_list_.push_back(models::Role::CreateMockRole(i));
            }
        }
        return mock_role_list_;
    }

    models::Role AdminService::GetRoleById(const std::string &id)
    {
        auto it = std::find_if(mock_role_list_.begin(), mock_role_list_.end(),
                               [&id](const models::Role &role)
                               {
                                   return role.GetId() == id;
                               });
        if (it != mock_role_list_.end())
        {
            return *it;
        }
        return models::Role();
    }

    // 权限管理实现
    std::vector<models::Permission> AdminService::GetPermissionList()
    {
        if (mock_permission_list_.empty())
        {
            // 生成模拟数据
            for (int i = 0; i < 8; ++i)
            {
                mock_permission_list_.push_back(models::Permission::CreateMockPermission(i));
            }
        }
        return mock_permission_list_;
    }

    // 系统日志实现
    std::vector<models::SystemLog> AdminService::GetLogList(
        const std::string &start_time,
        const std::string &end_time,
        const std::string &type,
        const std::string &operator_name)
    {
        if (mock_log_list_.empty())
        {
            // 生成模拟数据
            for (int i = 0; i < 50; ++i)
            {
                mock_log_list_.push_back(models::SystemLog::CreateMockLog(i));
            }
        }

        // 如果没有过滤条件，返回所有日志
        if (start_time.empty() && end_time.empty() && type.empty() && operator_name.empty())
        {
            return mock_log_list_;
        }

        // 根据条件过滤日志
        std::vector<models::SystemLog> filtered_logs;
        std::copy_if(mock_log_list_.begin(), mock_log_list_.end(),
                     std::back_inserter(filtered_logs),
                     [&](const models::SystemLog &log)
                     {
                         bool match = true;
                         if (!type.empty())
                         {
                             match &= (log.GetType() == type);
                         }
                         if (!operator_name.empty())
                         {
                             match &= (log.GetOperator() == operator_name);
                         }
                         // 这里可以添加时间范围的过滤逻辑
                         return match;
                     });

        return filtered_logs;
    }

    bool AdminService::ImportStaffData(const std::string &data)
    {
        std::cout << data << std::endl;
        // Implement the logic to import staff data
        return true;
    }

    std::string AdminService::ExportStaffData()
    {
        // Implement the logic to export staff data
        return "Export staff data";
    }

    bool AdminService::UpdateRolePermissions(const std::string &role_id, const std::vector<std::string> &permissions)
    {
        std::cout << role_id << std::endl;
        std::cout << permissions.size() << std::endl;
        // Implement the logic to update role permissions
        return true;
    }
} // namespace services