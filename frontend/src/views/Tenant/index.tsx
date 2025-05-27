import { useState } from "react";

interface Tenant {
  id: string;
  name: string;
  title: string;
  email: string;
  role: "管理员" | "用户";
  status: "活跃" | "离线" | "停用";
  lastSeen: string;
  avatar: string;
}

const tenants: Tenant[] = [
  {
    id: "1",
    name: "张三",
    title: "餐厅老板",
    email: "zhangsan@example.com",
    role: "管理员",
    status: "活跃",
    lastSeen: "3分钟前",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
  },
  {
    id: "2",
    name: "李四",
    title: "分店经理",
    email: "lisi@example.com",
    role: "用户",
    status: "离线",
    lastSeen: "2小时前",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
  },
];

function Tenant() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "全部" | "活跃" | "离线" | "停用"
  >("全部");
  //@ts-ignore
  const [showModal, setShowModal] = useState(false);

  const filteredTenants = tenants.filter((tenant) => {
    const matchSearch =
      tenant.name.includes(searchTerm) ||
      tenant.email.includes(searchTerm) ||
      tenant.title.includes(searchTerm);
    const matchStatus =
      statusFilter === "全部" || tenant.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="mx-auto py-6 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">租户管理</h1>
            <p className="mt-2 text-sm text-gray-700">
              共 {tenants.length} 个租户，
              {tenants.filter((t) => t.status === "活跃").length} 个活跃租户
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="mt-4 sm:mt-0 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg
              className="h-4 w-4 mr-1.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            添加租户
          </button>
        </div>

        {/* Filters */}
        <div className="mt-4 sm:flex sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="max-w-xs flex-1">
            <label htmlFor="search" className="sr-only">
              搜索
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                name="search"
                id="search"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="搜索租户..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex space-x-2">
            {["全部", "活跃", "离线", "停用"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status as any)}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  statusFilter === status
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  姓名
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  职位
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  邮箱
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  角色
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  状态
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  最后在线
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTenants.map((tenant) => (
                <tr key={tenant.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <img
                          className="h-10 w-10 rounded-full"
                          src={tenant.avatar}
                          alt=""
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {tenant.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {tenant.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {tenant.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {tenant.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {tenant.role}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                        tenant.status === "活跃"
                          ? "bg-green-100 text-green-800"
                          : tenant.status === "离线"
                          ? "bg-gray-100 text-gray-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {tenant.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {tenant.lastSeen}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-3">
                      <button className="text-indigo-600 hover:text-indigo-900">
                        编辑
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        删除
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div className="flex-1 flex justify-between sm:hidden">
          <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            上一页
          </button>
          <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            下一页
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              显示第 <span className="font-medium">1</span> 到{" "}
              <span className="font-medium">10</span> 条， 共{" "}
              <span className="font-medium">{tenants.length}</span> 条结果
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                上一页
              </button>
              <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                下一页
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tenant;
