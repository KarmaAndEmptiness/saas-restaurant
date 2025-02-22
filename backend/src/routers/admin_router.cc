#include "routers/admin_router.h"

namespace router
{
    AdminRouter::AdminRouter(std::shared_ptr<httplib::Server> server)
        : server_(server),
          admin_controller_(std::make_unique<controllers::AdminController>())
    {
    }

    // 初始化路由
    void AdminRouter::InitializeRoutes()
    {
        // 获取员工列表
        server_->Get("/api/admin/staff", [this](const httplib::Request &req, httplib::Response &res)
                     { admin_controller_->HandleGetStaffList(req, res); });

        // 创建员工
        server_->Post("/api/admin/staff", [this](const httplib::Request &req, httplib::Response &res)
                      { admin_controller_->HandleCreateStaff(req, res); });

        // 更新员工信息
        server_->Put("/api/admin/staff/:id", [this](const httplib::Request &req, httplib::Response &res)
                     { admin_controller_->HandleUpdateStaff(req, res); });

        // 删除员工
        server_->Delete("/api/admin/staff/:id", [this](const httplib::Request &req, httplib::Response &res)
                        { admin_controller_->HandleDeleteStaff(req, res); });

        // 导入员工数据
        server_->Post("/api/admin/staff/import", [this](const httplib::Request &req, httplib::Response &res)
                      { admin_controller_->HandleImportStaff(req, res); });

        // 导出员工数据
        server_->Get("/api/admin/staff/export", [this](const httplib::Request &req, httplib::Response &res)
                     { admin_controller_->HandleExportStaff(req, res); });

        // 获取角色列表
        server_->Get("/api/admin/roles", [this](const httplib::Request &req, httplib::Response &res)
                     { admin_controller_->HandleGetRoleList(req, res); });

        // 创建角色
        server_->Post("/api/admin/roles", [this](const httplib::Request &req, httplib::Response &res)
                      { admin_controller_->HandleCreateRole(req, res); });

        // 更新角色信息
        server_->Put("/api/admin/roles/:id", [this](const httplib::Request &req, httplib::Response &res)
                     { admin_controller_->HandleUpdateRole(req, res); });

        // 删除角色
        server_->Delete("/api/admin/roles/:id", [this](const httplib::Request &req, httplib::Response &res)
                        { admin_controller_->HandleDeleteRole(req, res); });

        // 获取权限列表
        server_->Get("/api/admin/permissions", [this](const httplib::Request &req, httplib::Response &res)
                     { admin_controller_->HandleGetPermissionList(req, res); });

        // 创建权限
        server_->Post("/api/admin/permissions", [this](const httplib::Request &req, httplib::Response &res)
                      { admin_controller_->HandleCreatePermission(req, res); });

        // 更新权限信息
        server_->Put("/api/admin/permissions/:id", [this](const httplib::Request &req, httplib::Response &res)
                     { admin_controller_->HandleUpdatePermission(req, res); });

        // 删除权限
        server_->Delete("/api/admin/permissions/:id", [this](const httplib::Request &req, httplib::Response &res)
                        { admin_controller_->HandleDeletePermission(req, res); });

        // 获取日志列表
        server_->Get("/api/admin/logs", [this](const httplib::Request &req, httplib::Response &res)
                     { admin_controller_->HandleGetLogList(req, res); });

        // 导出日志
        server_->Get("/api/admin/logs/export", [this](const httplib::Request &req, httplib::Response &res)
                     { admin_controller_->HandleExportLogs(req, res); });
    }
}