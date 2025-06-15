import { useEffect, useState } from "react";
import {
  getMembers,
  getMemberLevel,
  getMemberLevels,
  createMember,
  updateMember,
  getConsumptionRecords,
  type MemberType,
  type MemberLevelType,
  type ConsumptionRecordType,
} from "@/apis/front/member";
//@ts-ignore
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
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState<string>("全部");
  const [statusFilter, setStatusFilter] = useState<string>("全部");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<MemberType | null>(null);
  const [showConsumptionHistory, setShowConsumptionHistory] = useState(false);
  const [memberLevels, setMemberLevels] = useState<MemberLevelType[]>([]);
  const [formData, setFormData] = useState({
    username: "",
    phone: "",
    password: "", // 添加密码字段
    level_id: 1, // 默认普通会员
    points: 0,
    total_spent: "0",
    status: "活跃",
  });
  //@ts-ignore
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [consumptionRecords, setConsumptionRecords] = useState<
    ConsumptionRecordType[]
  >([]);
  const [loadingRecords, setLoadingRecords] = useState(false);

  const filteredMembers = members.filter((member) => {
    const matchSearch =
      member.username?.includes(searchTerm) ||
      member.phone?.includes(searchTerm) ||
      "M00" + member.member_id === searchTerm;
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

  const fetchConsumptionRecords = async (memberId: number) => {
    setLoadingRecords(true);
    try {
      const records = await getConsumptionRecords(memberId);
      setConsumptionRecords(records);
    } catch (error) {
      console.error("获取消费记录失败:", error);
    } finally {
      setLoadingRecords(false);
    }
  };

  const handleOpenConsumptionHistory = (member: MemberType) => {
    setSelectedMember(member);
    setShowConsumptionHistory(true);
    fetchConsumptionRecords(member.member_id);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        // 1. 首先获取所有必要的数据
        const [membersData, levelsData] = await Promise.all([
          getMembers(),
          getMemberLevels(),
        ]);

        // 2. 设置会员等级和用户数据
        setMemberLevels(levelsData);

        // 3. 处理会员数据
        const processedMembers = await Promise.all(
          membersData.map(async (member: MemberType) => {
            const level =
              levelsData.find((l) => l.level_id === member.level_id) ||
              (await getMemberLevel(member.level_id));
            return {
              ...member,
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
        username: selectedMember.username || "",
        phone: selectedMember.phone || "",
        password: "", // 清空密码输入框，但保留原密码在 selectedMember 中
        level_id: selectedMember.level_id,
        points: selectedMember.points,
        total_spent: selectedMember.total_spent,
        status: selectedMember.status,
      });
    } else {
      setFormData({
        username: "",
        phone: "",
        password: "", // 添加密码字段
        level_id: 1,
        points: 0,
        total_spent: "0",
        status: "活跃",
      });
    }
  }, [selectedMember]);

  const handleSubmit = async () => {
    try {
      if (selectedMember) {
        // 如果是编辑模式，且密码为空，则使用原密码
        const submitData = {
          ...selectedMember,
          ...formData,
          password: formData.password || selectedMember.password, // 如果没有输入新密码，使用原密码
        };
        await updateMember(selectedMember.member_id, submitData);
      } else {
        // 新建会员的逻辑保持不变
        await createMember({
          ...formData,
          tenant_id: 1,
          is_deleted: 0,
        } as MemberType);
      }

      const updatedMembers = await getMembers();
      const processedMembers = await Promise.all(
        updatedMembers.map(async (member: MemberType) => {
          const memberLevel = await getMemberLevel(member.level_id);
          return {
            ...member,
            level: memberLevel.level_name,
          };
        })
      );
      setMembers(processedMembers);

      setShowAddModal(false);
      setSelectedMember(null);
      setFormData({
        username: "",
        phone: "",
        password: "", // 添加密码字段
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
                        {member.username}
                      </div>
                      <div className="text-sm text-gray-500">
                        {member.phone}
                      </div>
                      <div className="text-xs text-gray-400">
                        M00{member.member_id}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      member.level
                        ? getLevelBadgeColor(member.level)
                        : "bg-gray-100 text-gray-800"
                    }`}
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
                    onClick={() => handleOpenConsumptionHistory(member)}
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
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                {/* Modal Header */}
                <div className="mb-6 flex items-center justify-between border-b border-gray-200 pb-3">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {selectedMember ? "编辑会员信息" : "添加新会员"}
                  </h3>
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      setSelectedMember(null);
                      setFormErrors({});
                    }}
                    className="rounded-md p-1 hover:bg-gray-100"
                  >
                    <svg
                      className="h-5 w-5 text-gray-500"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>

                {/* Form Content */}
                <div className="space-y-6">
                  {/* Username & Phone Section */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        会员名称
                      </label>
                      <input
                        type="text"
                        value={formData.username}
                        onChange={(e) =>
                          setFormData({ ...formData, username: e.target.value })
                        }
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="请输入会员名称"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        手机号码
                      </label>
                      <input
                        type="text"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="请输入手机号码"
                      />
                    </div>
                  </div>

                  {/* Password Section */}
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      密码
                      {!selectedMember && (
                        <span className="text-red-500">*</span>
                      )}
                    </label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder={
                        selectedMember ? "不修改请留空" : "请输入密码"
                      }
                      required={!selectedMember}
                    />
                  </div>

                  {/* Level & Status Section */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        会员等级
                      </label>
                      <select
                        value={formData.level_id}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            level_id: Number(e.target.value),
                          })
                        }
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      >
                        {memberLevels.map((level) => (
                          <option key={level.level_id} value={level.level_id}>
                            {level.level_name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        会员状态
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) =>
                          setFormData({ ...formData, status: e.target.value })
                        }
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      >
                        <option value="活跃">活跃</option>
                        <option value="非活跃">非活跃</option>
                        <option value="已禁用">已禁用</option>
                      </select>
                    </div>
                  </div>

                  {/* Points & Total Spent Section */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        积分
                      </label>
                      <input
                        type="number"
                        value={formData.points}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            points: Number(e.target.value),
                          })
                        }
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        累计消费
                      </label>
                      <input
                        type="text"
                        value={formData.total_spent}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            total_spent: e.target.value,
                          })
                        }
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {selectedMember ? "保存修改" : "添加会员"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setSelectedMember(null);
                    setFormErrors({});
                  }}
                  className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                >
                  取消
                </button>
              </div>
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
                {selectedMember.username} 的消费记录
              </h3>
              <button
                onClick={() => {
                  setShowConsumptionHistory(false);
                  setSelectedMember(null);
                  setConsumptionRecords([]);
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

            {loadingRecords ? (
              <div className="flex justify-center items-center h-48">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            ) : consumptionRecords.length === 0 ? (
              <div className="text-center py-8 text-gray-500">暂无消费记录</div>
            ) : (
              <div className="space-y-4">
                {consumptionRecords.map((record) => (
                  <div
                    key={record.record_id}
                    className="border rounded-lg p-4 hover:bg-gray-50"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-gray-600">
                          {new Date(record.created_at).toLocaleString()}
                        </p>
                        <p className="mt-1 text-sm">{record.order_items}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold">
                          ¥{parseFloat(record.amount).toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500">
                          获得积分: {record.points}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => {
                  setShowConsumptionHistory(false);
                  setSelectedMember(null);
                  setConsumptionRecords([]);
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
