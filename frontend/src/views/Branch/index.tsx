import { useState } from "react";

interface BranchType {
  id: string;
  name: string;
  address: string;
  manager: string;
  phone: string;
  status: "营业中" | "已关店" | "装修中";
  openingHours: string;
  employeeCount: number;
  monthlyRevenue: number;
  rating: number;
  lastInspection: string;
  createdAt: string;
}

const initialBranches: BranchType[] = [
  {
    id: "B001",
    name: "城北总店",
    address: "城北区明珠路128号",
    manager: "张经理",
    phone: "0571-88887777",
    status: "营业中",
    openingHours: "10:00-22:00",
    employeeCount: 25,
    monthlyRevenue: 380000,
    rating: 4.8,
    lastInspection: "2024-01-15",
    createdAt: "2022-05-01",
  },
  {
    id: "B002",
    name: "滨江店",
    address: "滨江区网商路88号",
    manager: "李经理",
    phone: "0571-88889999",
    status: "营业中",
    openingHours: "10:30-21:30",
    employeeCount: 18,
    monthlyRevenue: 280000,
    rating: 4.6,
    lastInspection: "2024-01-18",
    createdAt: "2023-03-15",
  },
];

function Branch() {
  //@ts-ignore
  const [branches, setBranches] = useState<BranchType[]>(initialBranches);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("全部");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<BranchType | null>(null);
  const [showStatsModal, setShowStatsModal] = useState(false);

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      营业中: "bg-green-100 text-green-800",
      已关店: "bg-red-100 text-red-800",
      装修中: "bg-yellow-100 text-yellow-800",
    };
    return colors[status] || colors.营业中;
  };

  const filteredBranches = branches.filter((branch) => {
    const matchSearch =
      branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      branch.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus =
      statusFilter === "全部" || branch.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">分店管理</h1>
          <p className="mt-1 text-sm text-gray-600">
            共 {branches.length} 家分店，
            {branches.filter((b) => b.status === "营业中").length} 家正在营业
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center"
        >
          <svg
            className="w-5 h-5 mr-2"
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
          新增分店
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">总营业额</h3>
          <p className="mt-2 text-2xl font-semibold text-gray-900">
            ¥
            {branches
              .reduce((sum, b) => sum + b.monthlyRevenue, 0)
              .toLocaleString()}
          </p>
          <p className="mt-1 text-sm text-green-600">↑ 12.5% 环比上月</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">总员工数</h3>
          <p className="mt-2 text-2xl font-semibold text-gray-900">
            {branches.reduce((sum, b) => sum + b.employeeCount, 0)}人
          </p>
          <p className="mt-1 text-sm text-green-600">↑ 5.2% 环比上月</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">平均评分</h3>
          <p className="mt-2 text-2xl font-semibold text-gray-900">
            {(
              branches.reduce((sum, b) => sum + b.rating, 0) / branches.length
            ).toFixed(1)}
          </p>
          <p className="mt-1 text-sm text-green-600">↑ 0.3 环比上月</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">巡检完成率</h3>
          <p className="mt-2 text-2xl font-semibold text-gray-900">96%</p>
          <p className="mt-1 text-sm text-red-600">↓ 2% 环比上月</p>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="搜索分店名称或地址..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="全部">所有状态</option>
          <option value="营业中">营业中</option>
          <option value="已关店">已关店</option>
          <option value="装修中">装修中</option>
        </select>
      </div>

      {/* Branches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBranches.map((branch) => (
          <div
            key={branch.id}
            className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {branch.name}
                  </h3>
                  <p className="text-sm text-gray-500">{branch.address}</p>
                </div>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                    branch.status
                  )}`}
                >
                  {branch.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                  <p className="text-gray-500">店长</p>
                  <p className="font-medium">{branch.manager}</p>
                </div>
                <div>
                  <p className="text-gray-500">联系电话</p>
                  <p className="font-medium">{branch.phone}</p>
                </div>
                <div>
                  <p className="text-gray-500">员工数</p>
                  <p className="font-medium">{branch.employeeCount}人</p>
                </div>
                <div>
                  <p className="text-gray-500">营业时间</p>
                  <p className="font-medium">{branch.openingHours}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm border-t pt-4">
                <div className="flex items-center space-x-2 text-gray-500">
                  <span>评分: {branch.rating}</span>
                  <span>·</span>
                  <span>上次巡检: {branch.lastInspection}</span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setSelectedBranch(branch);
                      setShowStatsModal(true);
                    }}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    统计
                  </button>
                  <button
                    onClick={() => {
                      setSelectedBranch(branch);
                      setShowAddModal(true);
                    }}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    编辑
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">
                {selectedBranch ? "编辑分店信息" : "新增分店"}
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setSelectedBranch(null);
                }}
                className="text-gray-400 hover:text-gray-500"
              >
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
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  分店名称
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  defaultValue={selectedBranch?.name}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  店长
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  defaultValue={selectedBranch?.manager}
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  地址
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  defaultValue={selectedBranch?.address}
                />
              </div>
              {/* Add more form fields as needed */}
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setSelectedBranch(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                取消
              </button>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                保存
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Modal */}
      {showStatsModal && selectedBranch && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">
                {selectedBranch.name} - 统计数据
              </h3>
              <button
                onClick={() => {
                  setShowStatsModal(false);
                  setSelectedBranch(null);
                }}
                className="text-gray-400 hover:text-gray-500"
              >
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-500">月营收</h4>
                <p className="mt-2 text-xl font-semibold">
                  ¥{selectedBranch.monthlyRevenue.toLocaleString()}
                </p>
                <p className="mt-1 text-sm text-green-600">↑ 15.2%</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-500">客单价</h4>
                <p className="mt-2 text-xl font-semibold">¥68.5</p>
                <p className="mt-1 text-sm text-red-600">↓ 2.1%</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-500">日均客流</h4>
                <p className="mt-2 text-xl font-semibold">386人</p>
                <p className="mt-1 text-sm text-green-600">↑ 8.3%</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => {
                  setShowStatsModal(false);
                  setSelectedBranch(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Branch;
