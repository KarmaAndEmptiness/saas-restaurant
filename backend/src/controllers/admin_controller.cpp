#include "controllers/admin_controller.h"
#include <nlohmann/json.hpp>
#include <regex>
#include "middleware/error_middleware.h"
#include <iostream>
using json = nlohmann::json;

namespace controllers
{
    AdminController::AdminController()
        : admin_service_(std::make_unique<services::AdminService>()) {}

    void AdminController::HandleGetStaffList(const httplib::Request &req, httplib::Response &res)
    {
        std::cout << req.path << std::endl;
        try
        {
            auto staff_list = admin_service_->GetStaffList();
            json response = json::array();

            for (const auto &staff : staff_list)
            {
                response.push_back({{"id", staff.GetId()},
                                    {"name", staff.GetName()},
                                    {"role", staff.GetRole()},
                                    {"email", staff.GetEmail()},
                                    {"phone", staff.GetPhone()},
                                    {"status", staff.GetStatus()},
                                    {"department", staff.GetDepartment()},
                                    {"joinDate", staff.GetJoinDate()}});
            }

            res.body = response.dump();
        }
        catch (const json::parse_error &e)
        {
            res.status = 400;
            json error = {{"message", "JSON解析错误"}};
            std::cerr << "Error: " << __FILE__ << ":" << __LINE__ << " " << e.what() << std::endl;
            res.body = error.dump();
        }
        catch (const std::exception &e)
        {
            res.status = 500;
            json error = {{"message", "获取员工列表失败"}};
            std::cerr << "Error: " << __FILE__ << ":" << __LINE__ << " " << e.what() << std::endl;
            res.body = error.dump();
        }
    }

    void AdminController::HandleCreateStaff(const httplib::Request &req, httplib::Response &res)
    {
        try
        {
            auto data = json::parse(req.body);
            if (!ValidateStaffData(data))
            {
                res.status = 400;
                json error = {{"message", "员工数据格式错误"}};
                res.body = error.dump();
                return;
            }

            models::Staff staff(
                "", // ID will be generated
                data["name"],
                data["role"],
                data["email"],
                data["phone"],
                data["status"],
                data["department"],
                data["joinDate"]);

            std::string id = admin_service_->CreateStaff(staff);
            json response = {{"id", id}};
            res.status = 201;
            res.body = response.dump();
        }
        catch (const json::parse_error &e)
        {
            std::cerr << "Error: " << __FILE__ << ":" << __LINE__ << " " << e.what() << std::endl;
            res.status = 400;
            json error = {{"message", "JSON解析错误"}};
            res.body = error.dump();
        }
        catch (const std::exception &e)
        {
            std::cerr << "Error: " << __FILE__ << ":" << __LINE__ << " " << e.what() << std::endl;
            res.status = 500;
            json error = {{"message", "创建员工失败"}};
            res.body = error.dump();
        }
    }

    void AdminController::HandleGetRoleList(const httplib::Request &req, httplib::Response &res)
    {
        std::cout << req.path << std::endl;
        try
        {
            auto role_list = admin_service_->GetRoleList();
            json response = json::array();

            for (const auto &role : role_list)
            {
                response.push_back({{"id", role.GetId()},
                                    {"name", role.GetName()},
                                    {"description", role.GetDescription()},
                                    {"permissions", role.GetPermissions()},
                                    {"userCount", role.GetUserCount()}});
            }

            res.body = response.dump();
        }
        catch (const json::parse_error &e)
        {
            std::cerr << "Error: " << __FILE__ << ":" << __LINE__ << " " << e.what() << std::endl;
            res.status = 400;
            json error = {{"message", "JSON解析错误"}};
            res.body = error.dump();
        }
        catch (const std::exception &e)
        {
            std::cerr << "Error: " << __FILE__ << ":" << __LINE__ << " " << e.what() << std::endl;
            res.status = 500;
            json error = {{"message", "获取角色列表失败"}};
            res.body = error.dump();
        }
    }

    void AdminController::HandleGetLogList(const httplib::Request &req, httplib::Response &res)
    {
        try
        {
            // 获取查询参数
            std::string start_time = req.get_header_value("startTime");
            std::string end_time = req.get_header_value("endTime");
            std::string type = req.get_header_value("type");
            std::string operator_name = req.get_header_value("operator");

            auto log_list = admin_service_->GetLogList(
                start_time, end_time, type, operator_name);

            json response = json::array();
            for (const auto &log : log_list)
            {
                response.push_back({{"id", log.GetId()},
                                    {"type", log.GetType()},
                                    {"action", log.GetAction()},
                                    {"operator", log.GetOperator()},
                                    {"operatorRole", log.GetOperatorRole()},
                                    {"ip", log.GetIp()},
                                    {"timestamp", log.GetTimestamp()},
                                    {"details", log.GetDetails()}});
            }

            res.body = response.dump();
        }
        catch (const json::parse_error &e)
        {
            std::cerr << "Error: " << __FILE__ << ":" << __LINE__ << " " << e.what() << std::endl;
            res.status = 400;
            json error = {{"message", "JSON解析错误"}};
            res.body = error.dump();
        }
        catch (const std::exception &e)
        {
            std::cerr << "Error: " << __FILE__ << ":" << __LINE__ << " " << e.what() << std::endl;
            res.status = 500;
            json error = {{"message", "获取日志列表失败"}};
            res.body = error.dump();
        }
    }

    void AdminController::HandleUpdateStaff(const httplib::Request &req, httplib::Response &res)
    {
        try
        {
            std::string id = ExtractIdFromPath(req.path);
            if (id.empty())
            {
                throw middleware::ValidationException("无效的员工ID");
            }

            auto data = json::parse(req.body);
            if (!ValidateStaffData(data))
            {
                throw middleware::ValidationException("员工数据格式错误");
            }

            models::Staff staff(
                id,
                data["name"],
                data["role"],
                data["email"],
                data["phone"],
                data["status"],
                data["department"],
                data["joinDate"]);

            if (!admin_service_->UpdateStaff(id, staff))
            {
                throw middleware::NotFoundException("员工不存在");
            }

            json response = {
                {"message", "更新成功"},
                {"success", true}};
            res.body = response.dump();
        }
        catch (const json::parse_error &e)
        {
            std::cerr << "Error: " << __FILE__ << ":" << __LINE__ << " " << e.what() << std::endl;
            res.status = 400;
            json error = {{"message", "JSON解析错误"}};
            res.body = error.dump();
        }
        catch (const std::exception &e)
        {
            std::cerr << "Error: " << __FILE__ << ":" << __LINE__ << " " << e.what() << std::endl;
            res.status = 500;
            json error = {{"message", "更新员工失败"}};
            res.body = error.dump();
        }
    }

    void AdminController::HandleDeleteStaff(const httplib::Request &req, httplib::Response &res)
    {
        try
        {
            std::string id = ExtractIdFromPath(req.path);
            if (id.empty())
            {
                res.status = 400;
                json error = {{"message", "无效的员工ID"}};
                res.body = error.dump();
                return;
            }

            if (admin_service_->DeleteStaff(id))
            {
                res.status = 200;
                json response = {{"message", "删除成功"}};
                res.body = response.dump();
            }
            else
            {
                res.status = 404;
                json error = {{"message", "员工不存在"}};
                res.body = error.dump();
            }
        }
        catch (const json::parse_error &e)
        {
            std::cerr << "Error: " << __FILE__ << ":" << __LINE__ << " " << e.what() << std::endl;
            res.status = 400;
            json error = {{"message", "JSON解析错误"}};
            res.body = error.dump();
        }
        catch (const std::exception &e)
        {
            std::cerr << "Error: " << __FILE__ << ":" << __LINE__ << " " << e.what() << std::endl;
            res.status = 500;
            json error = {{"message", "删除员工失败"}};
            res.body = error.dump();
        }
    }

    void AdminController::HandleImportStaff(const httplib::Request &req, httplib::Response &res)
    {
        try
        {
            // 检查Content-Type
            std::string content_type = req.get_header_value("Content-Type");
            if (content_type.find("multipart/form-data") == std::string::npos)
            {
                res.status = 400;
                json error = {{"message", "请上传Excel文件"}};
                res.body = error.dump();
                return;
            }

            // 在实际项目中，这里需要解析multipart/form-data
            // 并处理上传的Excel文件
            if (admin_service_->ImportStaffData(req.body))
            {
                res.status = 200;
                json response = {{"message", "导入成功"}};
                res.body = response.dump();
            }
            else
            {
                res.status = 400;
                json error = {{"message", "导入失败，请检查文件格式"}};
                res.body = error.dump();
            }
        }
        catch (const json::parse_error &e)
        {
            std::cerr << "Error: " << __FILE__ << ":" << __LINE__ << " " << e.what() << std::endl;
            res.status = 400;
            json error = {{"message", "JSON解析错误"}};
            res.body = error.dump();
        }
        catch (const std::exception &e)
        {
            std::cerr << "Error: " << __FILE__ << ":" << __LINE__ << " " << e.what() << std::endl;
            res.status = 500;
            json error = {{"message", "导入员工数据失败"}};
            res.body = error.dump();
        }
    }

    void AdminController::HandleExportStaff(const httplib::Request &req, httplib::Response &res)
    {
        std::cout << req.path << std::endl;
        try
        {
            std::string excel_data = admin_service_->ExportStaffData();

            // 设置响应头
            res.headers.insert({"Content-Type", "application/vnd.ms-excel"});
            res.headers.insert({"Content-Disposition", "attachment; filename=staff_list.xlsx"});

            // 设置响应体
            res.body = excel_data;
        }
        catch (const std::exception &e)
        {
            std::cerr << "Error: " << __FILE__ << ":" << __LINE__ << " " << e.what() << std::endl;
            res.status = 500;
            json error = {{"message", "导出员工数据失败"}};
            res.body = error.dump();
        }
    }

    void AdminController::HandleUpdateRolePermissions(const httplib::Request &req, httplib::Response &res)
    {
        try
        {
            std::string id = ExtractIdFromPath(req.path);
            if (id.empty())
            {
                res.status = 400;
                json error = {{"message", "无效的角色ID"}};
                res.body = error.dump();
                return;
            }

            auto data = json::parse(req.body);
            if (!data.contains("permissions") || !data["permissions"].is_array())
            {
                res.status = 400;
                json error = {{"message", "权限数据格式错误"}};
                res.body = error.dump();
                return;
            }

            std::vector<std::string> permissions;
            for (const auto &perm : data["permissions"])
            {
                permissions.push_back(perm.get<std::string>());
            }

            if (admin_service_->UpdateRolePermissions(id, permissions))
            {
                res.status = 200;
                json response = {{"message", "更新权限成功"}};
                res.body = response.dump();
            }
            else
            {
                res.status = 404;
                json error = {{"message", "角色不存在"}};
                res.body = error.dump();
            }
        }
        catch (const json::parse_error &e)
        {
            std::cerr << "Error: " << __FILE__ << ":" << __LINE__ << " " << e.what() << std::endl;
            res.status = 400;
            json error = {{"message", "JSON解析错误"}};
            res.body = error.dump();
        }
        catch (const std::exception &e)
        {
            std::cerr << "Error: " << __FILE__ << ":" << __LINE__ << " " << e.what() << std::endl;
            res.status = 500;
            json error = {{"message", "更新角色权限失败"}};
            res.body = error.dump();
        }
    }

    // 工具方法实现
    std::string AdminController::ExtractIdFromPath(const std::string &path)
    {
        std::regex id_pattern("/([^/]+)$");
        std::smatch matches;
        if (std::regex_search(path, matches, id_pattern))
        {
            return matches[1].str();
        }
        return "";
    }

    bool AdminController::ValidateStaffData(const json &data)
    {
        return data.contains("name") && data.contains("role") &&
               data.contains("email") && data.contains("phone") &&
               data.contains("status") && data.contains("department") &&
               data.contains("joinDate");
    }

    bool AdminController::ValidateRoleData(const json &data)
    {
        return data.contains("name") && data.contains("description") &&
               data.contains("permissions");
    }

    bool AdminController::ValidatePermissionData(const json &data)
    {
        return data.contains("name") && data.contains("code") &&
               data.contains("description") && data.contains("type");
    }

} // namespace controllers