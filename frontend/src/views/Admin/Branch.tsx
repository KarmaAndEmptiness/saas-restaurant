import { useEffect, useState } from "react";
import {
  getBranches,
  createBranch,
  updateBranch,
  deleteBranch,
  type BranchType,
} from "@/apis/admin/branch";
import { getUserInfo, type UserInfo, getUsers } from "@/apis/profile";

function Branch() {
  const [branches, setBranches] = useState<BranchType[]>();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("全部");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<BranchType | null>(null);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [formData, setFormData] = useState<Partial<BranchType>>({
    branch_name: "",
    address: "",
    phone: "",
    opening_hours: "",
    capacity: 0,
    status: "营业中",
    manager_id: 0,
  });
  const [users, setUsers] = useState<UserInfo[]>([]);

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      营业中: "bg-green-100 text-green-800",
      已关店: "bg-red-100 text-red-800",
      装修中: "bg-yellow-100 text-yellow-800",
    };
    return colors[status] || colors.营业中;
  };

  const filteredBranches = branches?.filter((branch) => {
    const matchSearch =
      branch.branch_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      branch.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus =
      statusFilter === "全部" || branch.status === statusFilter;
    return matchSearch && matchStatus;
  });

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const data = await getBranches();
        data.forEach(async (branch: BranchType) => {
          const manager = await getUserInfo(branch.manager_id);
          branch.manager = manager.username;
          return branch;
        });
        console.log(data);
        setBranches(data);
      } catch (error) {
        console.error("获取分店数据失败:", error);
      }
    };
    fetchBranches();
  }, []);

  useEffect(() => {
    if (selectedBranch) {
      setFormData({
        branch_name: selectedBranch.branch_name,
        address: selectedBranch.address,
        phone: selectedBranch.phone,
        opening_hours: selectedBranch.opening_hours,
        capacity: selectedBranch.capacity,
        status: selectedBranch.status,
        manager_id: selectedBranch.manager_id,
      });
    } else {
      setFormData({
        branch_name: "",
        address: "",
        phone: "",
        opening_hours: "",
        capacity: 0,
        status: "营业中",
        manager_id: 0,
      });
    }
  }, [selectedBranch]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (showAddModal) {
        try {
          const data = await getUsers();
          setUsers(data);
        } catch (error) {
          console.error("获取用户列表失败:", error);
        }
      }
    };
    fetchUsers();
  }, [showAddModal]);

  const handleSubmit = async () => {
    try {
      if (selectedBranch) {
        await updateBranch(selectedBranch.branch_id, formData as BranchType);
      } else {
        await createBranch(formData as BranchType);
      }
      const data = await getBranches();
      setBranches(data);
      setShowAddModal(false);
      setSelectedBranch(null);
    } catch (error) {
      console.error("保存分店失败:", error);
    }
  };

  const handleDelete = async (branchId: number) => {
    if (confirm("确定要删除该分店吗？")) {
      try {
        await deleteBranch(branchId);
        const data = await getBranches();
        setBranches(data);
      } catch (error) {
        console.error("删除分店失败:", error);
      }
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">分店管理</h1>
          <p className="mt-1 text-sm text-gray-600">
            共 {branches?.length} 家分店，
            {branches?.filter((b) => b.status === "营业中").length} 家正在营业
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
            {branches?.reduce((sum, b) => sum + b.capacity, 0).toLocaleString()}
          </p>
          <p className="mt-1 text-sm text-green-600">↑ 12.5% 环比上月</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">总员工数</h3>
          <p className="mt-2 text-2xl font-semibold text-gray-900">
            {branches?.reduce((sum, b) => sum + b.capacity, 0)}人
          </p>
          <p className="mt-1 text-sm text-green-600">↑ 5.2% 环比上月</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">平均评分</h3>
          <p className="mt-2 text-2xl font-semibold text-gray-900">{5}</p>
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
        {filteredBranches?.map((branch) => (
          <div
            key={branch.branch_id}
            className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {branch.branch_name}
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
                  <p className="font-medium">{branch.capacity}人</p>
                </div>
                <div>
                  <p className="text-gray-500">营业时间</p>
                  <p className="font-medium">{branch.opening_hours}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm border-t pt-4">
                <div className="flex items-center space-x-2 text-gray-500">
                  <span>评分: {5}</span>
                  <span>·</span>
                  <span>上次巡检: {branch.created_at}</span>
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
                  <button
                    onClick={() => handleDelete(branch.branch_id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    删除
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
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

            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  分店名称
                </label>
                <input
                  type="text"
                  value={formData.branch_name}
                  onChange={(e) =>
                    setFormData({ ...formData, branch_name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  地址
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  联系电话
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  营业时间
                </label>
                <input
                  type="text"
                  value={formData.opening_hours}
                  onChange={(e) =>
                    setFormData({ ...formData, opening_hours: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  容纳人数
                </label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      capacity: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  状态
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="营业中">营业中</option>
                  <option value="已关店">已关店</option>
                  <option value="装修中">装修中</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  店长
                </label>
                <select
                  value={formData.manager_id}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      manager_id: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">请选择店长</option>
                  {users.map((user) => (
                    <option key={user.user_id} value={user.user_id}>
                      {user.username}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setSelectedBranch(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                取消
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {selectedBranch ? "保存修改" : "创建分店"}
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
                {selectedBranch.branch_name} - 统计数据
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
                  ¥{selectedBranch.capacity.toLocaleString()}
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
