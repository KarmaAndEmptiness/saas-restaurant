#include "models/system_log.h"
#include <sstream>
#include <ctime>
#include <iomanip>
#include <iostream>
#include <chrono>

namespace models
{
    SystemLog::SystemLog(const std::string &id,
                         const std::string &type,
                         const std::string &action,
                         const std::string &operator_name,
                         const std::string &operator_role,
                         const std::string &ip,
                         const std::string &timestamp,
                         const std::string &details)
        : id_(id),
          type_(type),
          action_(action),
          operator_name_(operator_name),
          operator_role_(operator_role),
          ip_(ip),
          timestamp_(timestamp),
          details_(details) {}

    SystemLog SystemLog::CreateMockLog(int index)
    {
        std::stringstream ss;
        ss << index;
        std::string idx = ss.str();

        // 生成时间戳
        auto now = std::chrono::system_clock::now();
        auto now_time = std::chrono::system_clock::to_time_t(now);
        std::stringstream time_ss;
        time_ss << std::put_time(std::localtime(&now_time), "%Y-%m-%d %H:%M:%S");

        // 模拟不同类型的日志
        switch (index % 4)
        {
        case 0:
            return SystemLog("l" + idx,
                             "info",
                             "登录系统",
                             "管理员" + idx,
                             "admin",
                             "192.168.1." + idx,
                             time_ss.str(),
                             "用户登录成功");
        case 1:
            return SystemLog("l" + idx,
                             "warning",
                             "修改权限",
                             "管理员" + idx,
                             "admin",
                             "192.168.1." + idx,
                             time_ss.str(),
                             "修改了角色权限配置");
        case 2:
            return SystemLog("l" + idx,
                             "error",
                             "操作失败",
                             "收银员" + idx,
                             "cashier",
                             "192.168.1." + idx,
                             time_ss.str(),
                             "交易处理失败");
        default:
            return SystemLog("l" + idx,
                             "success",
                             "导出报表",
                             "财务" + idx,
                             "finance",
                             "192.168.1." + idx,
                             time_ss.str(),
                             "成功导出财务报表");
        }
    }

} // namespace models