import { useState } from "react";

interface LogEntry {
  id: number;
  timestamp: string;
  level: "INFO" | "WARNING" | "ERROR";
  message: string;
  source: string;
}

function Log() {
  const [searchTerm, setSearchTerm] = useState("");

  // 模拟日志数据
  const logs: LogEntry[] = [
    {
      id: 1,
      timestamp: "2024-01-20 10:30:15",
      level: "INFO",
      message: "用户登录成功",
      source: "auth-service",
    },
    {
      id: 2,
      timestamp: "2024-01-20 10:35:22",
      level: "WARNING",
      message: "数据库连接缓慢",
      source: "db-service",
    },
    {
      id: 3,
      timestamp: "2024-01-20 10:40:45",
      level: "ERROR",
      message: "支付服务未响应",
      source: "payment-service",
    },
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case "INFO":
        return "bg-blue-100 text-blue-800";
      case "WARNING":
        return "bg-yellow-100 text-yellow-800";
      case "ERROR":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">日志管理</h1>

      {/* 搜索栏 */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="搜索日志..."
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* 日志表格 */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                时间
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                级别
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                来源
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                内容
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {log.timestamp}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getLevelColor(
                      log.level
                    )}`}
                  >
                    {log.level}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {log.source}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {log.message}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Log;
