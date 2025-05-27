import React, { useState } from "react";

interface WarningItem {
  id: number;
  timestamp: string;
  level: "HIGH" | "MEDIUM" | "LOW";
  title: string;
  description: string;
  status: "ACTIVE" | "RESOLVED";
}

function Warning() {
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | "ACTIVE" | "RESOLVED"
  >("ALL");

  // 模拟预警数据
  const warnings: WarningItem[] = [
    {
      id: 1,
      timestamp: "2024-01-20 10:30:15",
      level: "HIGH",
      title: "系统负载过高",
      description: "服务器CPU使用率超过90%",
      status: "ACTIVE",
    },
    {
      id: 2,
      timestamp: "2024-01-20 09:15:22",
      level: "MEDIUM",
      title: "存储空间不足",
      description: "磁盘使用率达到85%",
      status: "ACTIVE",
    },
    {
      id: 3,
      timestamp: "2024-01-19 15:40:45",
      level: "LOW",
      title: "数据库连接异常",
      description: "数据库响应时间超过预期",
      status: "RESOLVED",
    },
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case "HIGH":
        return "bg-red-100 text-red-800";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800";
      case "LOW":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    return status === "ACTIVE"
      ? "bg-green-100 text-green-800"
      : "bg-gray-100 text-gray-800";
  };

  const filteredWarnings = warnings.filter((warning) =>
    statusFilter === "ALL" ? true : warning.status === statusFilter
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">预警管理</h1>
        <div className="space-x-2">
          <button
            className={`px-4 py-2 rounded-lg ${
              statusFilter === "ALL" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setStatusFilter("ALL")}
          >
            全部
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              statusFilter === "ACTIVE"
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => setStatusFilter("ACTIVE")}
          >
            活跃
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              statusFilter === "RESOLVED"
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => setStatusFilter("RESOLVED")}
          >
            已解决
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredWarnings.map((warning) => (
          <div
            key={warning.id}
            className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center space-x-2">
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${getLevelColor(
                    warning.level
                  )}`}
                >
                  {warning.level}
                </span>
                <h3 className="font-semibold text-lg">{warning.title}</h3>
              </div>
              <span
                className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                  warning.status
                )}`}
              >
                {warning.status}
              </span>
            </div>
            <p className="text-gray-600 mb-2">{warning.description}</p>
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>{warning.timestamp}</span>
              {warning.status === "ACTIVE" && (
                <button className="text-blue-500 hover:text-blue-700">
                  标记为已解决
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Warning;
