import { useEffect, useState } from "react";
import {
  getMembers,
  getMemberLevel,
  getMemberLevels,
  createMember,
  updateMember,
  type MemberType,
  type MemberLevelType,
} from "@/apis/front/member";
import { getUserInfo, getUsers, type UserInfo } from "@/apis/profile";

interface ConsumptionRecord {
  id: string;
  date: string;
  amount: number;
  points: number;
  orderItems: string[];
}

const initialMembers: MemberType[] = [];

const membershipLevels = {
  普通: { discount: 0.95, pointRate: 1, color: "gray" },
  白银: { discount: 0.9, pointRate: 1.2, color: "slate" },
  黄金: { discount: 0.85, pointRate: 1.5, color: "yellow" },
  钻石: { discount: 0.8, pointRate: 2, color: "blue" },
};

function Member() {
  const [members, setMembers] = useState<MemberType[]>(initialMembers);
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState<string>("全部");
  const [statusFilter, setStatusFilter] = useState<string>("全部");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<MemberType | null>(null);
  const [showConsumptionHistory, setShowConsumptionHistory] = useState(false);
  const [memberLevels, setMemberLevels] = useState<MemberLevelType[]>([]);
  const [formData, setFormData] = useState({
    user_id: 0,
    name: "",
    phone: "",
    level_id: 1, // 默认普通会员
    points: 0,
    total_spent: "0",
    status: "活跃",
  });
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const filteredMembers = members.filter((member) => {
    const matchSearch =
      member.name?.includes(searchTerm) ||
      member.phone?.includes(searchTerm) ||
      `${member.member_id}`?.includes(searchTerm);
    const matchLevel = levelFilter === "全部" || member.level === levelFilter;
    const matchStatus =
      statusFilter === "全部" || member.status === statusFilter;
    return matchSearch && matchLevel && matchStatus;
  });

  const getLevelBadgeColor = (level: string) => {
    const colors: { [key: string]: string } = {
      普通: "bg-gray-100 text-gray-800",
      白银: "bg-slate-100 text-slate-800",
      黄金: "bg-yellow-100 text-yellow-800",
      钻石: "bg-blue-100 text-blue-800",
    };
    return colors[level] || colors.普通;
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      活跃: "bg-green-100 text-green-800",
      非活跃: "bg-gray-100 text-gray-800",
      已禁用: "bg-red-100 text-red-800",
    };
    return colors[status] || colors.非活跃;
  };

  const mockConsumptionHistory: ConsumptionRecord[] = [
    {
      id: "O001",
      date: "2024-01-15",
      amount: 238,
      points: 238,
      orderItems: ["红烧狮子头", "清炒时蔬", "龙井虾仁"],
    },
    {
      id: "O002",
      date: "2024-01-10",
      amount: 156,
      points: 156,
      orderItems: ["粤式烧鸭", "清炒时蔬"],
    },
  ];

  useEffect(() => {
    async function fetchData() {
      try {
        // 1. 首先获取所有必要的数据
        const [membersData, levelsData, usersData] = await Promise.all([
          getMembers(),
          getMemberLevels(),
          getUsers(),
        ]);

        // 2. 设置会员等级和用户数据
        setMemberLevels(levelsData);
        setUsers(usersData);

        // 3. 处理会员数据
        const processedMembers = await Promise.all(
          membersData.map(async (member: MemberType) => {
            const user =
              usersData.find((u) => u.user_id === member.user_id) ||
              (await getUserInfo(member.user_id));
            const level =
              levelsData.find((l) => l.level_id === member.level_id) ||
              (await getMemberLevel(member.level_id));

            return {
              ...member,
              name: user.username,
              phone: user.phone,
              level: level.level_name,
            };
          })
        );

        // 4. 更新会员列表
        console.log("Processed members:", processedMembers); // 调试用
        setMembers(processedMembers);
      } catch (error) {
        console.error("获取数据失败:", error);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedMember) {
      setFormData({
        user_id: selectedMember.user_id,
        name: selectedMember.name || "",
        phone: selectedMember.phone || "",
        level_id: selectedMember.level_id,
        points: selectedMember.points,
        total_spent: selectedMember.total_spent,
        status: selectedMember.status,
      });
    } else {
      setFormData({
        user_id: 0,
        name: "",
        phone: "",
        level_id: 1,
        points: 0,
        total_spent: "0",
        status: "活跃",
      });
    }
  }, [selectedMember]);

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!formData.user_id) errors.user_id = "请选择用户";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const selectedUser = users.find(
        (user) => user.user_id === formData.user_id
      );
      if (!selectedUser) {
        setFormErrors({ user_id: "请选择有效用户" });
        return;
      }

      if (selectedMember) {
        await updateMember(selectedMember.member_id, {
          ...selectedMember,
          ...formData,
          user_id: selectedUser.user_id,
        });
      } else {
        await createMember({
          ...formData,
          tenant_id: 1,
          user_id: selectedUser.user_id,
          is_deleted: 0,
        } as MemberType);
      }

      const updatedMembers = await getMembers();
      const processedMembers = await Promise.all(
        updatedMembers.map(async (member: MemberType) => {
          const user = await getUserInfo(member.user_id);
          const memberLevel = await getMemberLevel(member.level_id);
          return {
            ...member,
            name: user.username,
            phone: user.phone,
            level: memberLevel.level_name,
          };
        })
      );
      setMembers(processedMembers);

      setShowAddModal(false);
      setSelectedMember(null);
      setFormData({
        user_id: 0,
        name: "",
        phone: "",
        level_id: 1,
        points: 0,
        total_spent: "0",
        status: "活跃",
      });
    } catch (error) {
      console.error("保存会员失败:", error);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">会员管理</h1>
          <p className="mt-1 text-sm text-gray-600">
            共 {members.length} 位会员，
            {members.filter((m) => m.status === "活跃").length} 位活跃会员
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
          添加会员
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="搜索会员姓名/手机号/ID..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value)}
        >
          <option value="全部">所有等级</option>
          {Object.keys(membershipLevels).map((level) => (
            <option key={level} value={level}>
              {level}会员
            </option>
          ))}
        </select>
        <select
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="全部">所有状态</option>
          <option value="活跃">活跃</option>
          <option value="非活跃">非活跃</option>
          <option value="已禁用">已禁用</option>
        </select>
      </div>

      {/* Members Table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                会员信息
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                等级 & 积分
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                消费信息
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                状态
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredMembers.map((member) => (
              <tr key={member.member_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {member.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {member.phone}
                      </div>
                      <div className="text-xs text-gray-400">
                        {member.member_id}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLevelBadgeColor(
                      member.level
                    )}`}
                  >
                    {member.level}会员
                  </span>
                  <div className="text-sm text-gray-500 mt-1">
                    积分: {member.points}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    总消费: ¥{member.total_spent}
                  </div>
                  <div className="text-xs text-gray-500">
                    创建时间: {member.created_at}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      member.status
                    )}`}
                  >
                    {member.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => {
                      setSelectedMember(member);
                      setShowConsumptionHistory(true);
                    }}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    消费记录
                  </button>
                  <button
                    onClick={() => {
                      setSelectedMember(member);
                      setShowAddModal(true);
                    }}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    编辑
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">
                {selectedMember ? "编辑会员信息" : "添加新会员"}
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setSelectedMember(null);
                  setFormErrors({});
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
                  选择用户
                </label>
                <select
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                    formErrors.user_id ? "border-red-500" : ""
                  }`}
                  value={formData.user_id || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      user_id: Number(e.target.value),
                      name:
                        users.find((u) => u.user_id === Number(e.target.value))
                          ?.username || "",
                      phone:
                        users.find((u) => u.user_id === Number(e.target.value))
                          ?.phone || "",
                    })
                  }
                >
                  <option value="">请选择用户</option>
                  {users.map((user) => (
                    <option key={user.user_id} value={user.user_id}>
                      {user.username} ({user.phone})
                    </option>
                  ))}
                </select>
                {formErrors.user_id && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.user_id}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  手机号
                </label>
                <input
                  type="text"
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                    formErrors.phone ? "border-red-500" : ""
                  }`}
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  disabled
                />
                {formErrors.phone && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.phone}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  会员等级
                </label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={formData.level_id}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      level_id: Number(e.target.value),
                    })
                  }
                >
                  {memberLevels.map((level) => (
                    <option key={level.level_id} value={level.level_id}>
                      {level.level_name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  状态
                </label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                >
                  <option value="活跃">活跃</option>
                  <option value="非活跃">非活跃</option>
                  <option value="已禁用">已禁用</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setSelectedMember(null);
                  setFormErrors({});
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                取消
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Consumption History Modal */}
      {showConsumptionHistory && selectedMember && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">
                {selectedMember.name} 的消费记录
              </h3>
              <button
                onClick={() => {
                  setShowConsumptionHistory(false);
                  setSelectedMember(null);
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

            <div className="space-y-4">
              {mockConsumptionHistory.map((record) => (
                <div
                  key={record.id}
                  className="border rounded-lg p-4 hover:bg-gray-50"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-600">{record.date}</p>
                      <p className="mt-1 text-sm">
                        {record.orderItems.join("、")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold">
                        ¥{record.amount.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">
                        获得积分: {record.points}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => {
                  setShowConsumptionHistory(false);
                  setSelectedMember(null);
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

export default Member;
