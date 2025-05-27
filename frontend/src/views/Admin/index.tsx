import { useState } from "react";

interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  status: "在职" | "休假" | "离职";
  phone: string;
  email: string;
  joinDate: string;
  avatar: string;
}

const initialEmployees: Employee[] = [
  {
    id: "1",
    name: "张三",
    position: "厨师长",
    department: "后厨部",
    status: "在职",
    phone: "13800138000",
    email: "zhangsan@example.com",
    joinDate: "2023-01-15",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
  },
  {
    id: "2",
    name: "李四",
    position: "服务员",
    department: "服务部",
    status: "在职",
    phone: "13800138001",
    email: "lisi@example.com",
    joinDate: "2023-03-20",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
  },
  {
    id: "3",
    name: "王五",
    position: "收银员",
    department: "财务部",
    status: "休假",
    phone: "13800138002",
    email: "wangwu@example.com",
    joinDate: "2023-06-10",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=3",
  },
];

function Staff() {
  //@ts-ignore
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "全部" | "在职" | "休假" | "离职"
  >("全部");
  const [departmentFilter, setDepartmentFilter] = useState("全部");
  //@ts-ignore
  const [showAddModal, setShowAddModal] = useState(false);

  const departments = ["全部", "后厨部", "服务部", "财务部", "采购部"];

  const filteredEmployees = employees.filter((employee) => {
    const matchSearch =
      employee.name.includes(searchTerm) ||
      employee.email.includes(searchTerm) ||
      employee.phone.includes(searchTerm);
    const matchStatus =
      statusFilter === "全部" || employee.status === statusFilter;
    const matchDepartment =
      departmentFilter === "全部" || employee.department === departmentFilter;
    return matchSearch && matchStatus && matchDepartment;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "在职":
        return "bg-green-100 text-green-800";
      case "休假":
        return "bg-yellow-100 text-yellow-800";
      case "离职":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">员工管理</h1>
          <p className="mt-1 text-sm text-gray-600">
            共 {employees.length} 名员工，
            {employees.filter((e) => e.status === "在职").length} 名在职
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <svg
            className="h-5 w-5 mr-2"
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
          添加员工
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="relative">
          <input
            type="text"
            placeholder="搜索员工..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
        >
          {["全部", "在职", "休假", "离职"].map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        <select
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
        >
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>

      {/* Employee Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                员工信息
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                部门/职位
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                联系方式
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                状态
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                入职日期
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredEmployees.map((employee) => (
              <tr key={employee.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <img
                        className="h-10 w-10 rounded-full"
                        src={employee.avatar}
                        alt=""
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {employee.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {employee.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {employee.department}
                  </div>
                  <div className="text-sm text-gray-500">
                    {employee.position}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{employee.phone}</div>
                  <div className="text-sm text-gray-500">{employee.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                      employee.status
                    )}`}
                  >
                    {employee.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {employee.joinDate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-indigo-600 hover:text-indigo-900 mr-4">
                    编辑
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    删除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Staff;
