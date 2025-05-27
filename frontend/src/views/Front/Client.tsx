import { useState } from "react";

interface Customer {
  id: string;
  name: string;
  membershipLevel: "普通会员" | "白银会员" | "黄金会员";
  phone: string;
  email: string;
  joinDate: string;
  totalSpent: number;
  points: number;
  lastVisit: string;
  avatar: string;
  status: "活跃" | "非活跃" | "已封禁";
}

const initialCustomers: Customer[] = [
  {
    id: "1",
    name: "张三",
    membershipLevel: "黄金会员",
    phone: "13800138000",
    email: "zhangsan@example.com",
    joinDate: "2023-01-15",
    totalSpent: 15800,
    points: 1580,
    lastVisit: "2024-01-20",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
    status: "活跃",
  },
  {
    id: "2",
    name: "李四",
    membershipLevel: "白银会员",
    phone: "13800138001",
    email: "lisi@example.com",
    joinDate: "2023-06-20",
    totalSpent: 8500,
    points: 850,
    lastVisit: "2024-01-18",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
    status: "活跃",
  },
  {
    id: "3",
    name: "王五",
    membershipLevel: "普通会员",
    phone: "13800138002",
    email: "wangwu@example.com",
    joinDate: "2023-12-01",
    totalSpent: 2300,
    points: 230,
    lastVisit: "2024-01-15",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=3",
    status: "非活跃",
  },
];

function Client() {
  //@ts-ignore
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [searchTerm, setSearchTerm] = useState("");
  const [membershipFilter, setMembershipFilter] = useState<string>("全部");
  const [statusFilter, setStatusFilter] = useState<string>("全部");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [showDetails, setShowDetails] = useState(false);

  const getMembershipColor = (level: string) => {
    switch (level) {
      case "黄金会员":
        return "bg-yellow-100 text-yellow-800";
      case "白银会员":
        return "bg-gray-100 text-gray-800";
      case "普通会员":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "活跃":
        return "bg-green-100 text-green-800";
      case "非活跃":
        return "bg-yellow-100 text-yellow-800";
      case "已封禁":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredCustomers = customers.filter((customer) => {
    const matchSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchMembership =
      membershipFilter === "全部" ||
      customer.membershipLevel === membershipFilter;
    const matchStatus =
      statusFilter === "全部" || customer.status === statusFilter;
    return matchSearch && matchMembership && matchStatus;
  });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">客户管理</h1>
            <p className="mt-1 text-sm text-gray-600">
              共 {customers.length} 位客户，
              {customers.filter((c) => c.status === "活跃").length} 位活跃客户
            </p>
          </div>
          <button
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            onClick={() => {
              /* 添加客户逻辑 */
            }}
          >
            添加客户
          </button>
        </div>

        {/* Filters */}
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div className="relative">
            <input
              type="text"
              placeholder="搜索客户..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            value={membershipFilter}
            onChange={(e) => setMembershipFilter(e.target.value)}
          >
            <option value="全部">所有等级</option>
            <option value="黄金会员">黄金会员</option>
            <option value="白银会员">白银会员</option>
            <option value="普通会员">普通会员</option>
          </select>
          <select
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="全部">所有状态</option>
            <option value="活跃">活跃</option>
            <option value="非活跃">非活跃</option>
            <option value="已封禁">已封禁</option>
          </select>
        </div>
      </div>

      {/* Customer Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                客户信息
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                会员等级
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                消费统计
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
                最近访问
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
            {filteredCustomers.map((customer) => (
              <tr key={customer.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <img
                        className="h-10 w-10 rounded-full"
                        src={customer.avatar}
                        alt=""
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {customer.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {customer.phone}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getMembershipColor(
                      customer.membershipLevel
                    )}`}
                  >
                    {customer.membershipLevel}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    ¥{customer.totalSpent.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">
                    {customer.points} 积分
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                      customer.status
                    )}`}
                  >
                    {customer.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {customer.lastVisit}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => {
                      setSelectedCustomer(customer);
                      setShowDetails(true);
                    }}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    详情
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    停用
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Customer Details Modal */}
      {showDetails && selectedCustomer && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium">客户详情</h3>
              <button
                onClick={() => setShowDetails(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">关闭</span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 flex items-center space-x-4">
                <img
                  src={selectedCustomer.avatar}
                  alt=""
                  className="h-16 w-16 rounded-full"
                />
                <div>
                  <h4 className="text-lg font-medium">
                    {selectedCustomer.name}
                  </h4>
                  <p className="text-gray-500">{selectedCustomer.email}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">会员等级</p>
                <p className="mt-1 font-medium">
                  {selectedCustomer.membershipLevel}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">加入日期</p>
                <p className="mt-1 font-medium">{selectedCustomer.joinDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">总消费</p>
                <p className="mt-1 font-medium">
                  ¥{selectedCustomer.totalSpent.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">积分余额</p>
                <p className="mt-1 font-medium">
                  {selectedCustomer.points} 积分
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-500 mb-2">消费趋势</p>
                <div className="h-32 bg-gray-50 rounded-lg flex items-center justify-center">
                  消费趋势图表展示区域
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowDetails(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                关闭
              </button>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                编辑信息
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Client;
