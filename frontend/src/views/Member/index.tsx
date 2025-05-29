import { useState } from "react";

interface MemberType {
  id: string;
  name: string;
  phone: string;
  level: "普通" | "白银" | "黄金" | "钻石";
  points: number;
  totalSpent: number;
  joinDate: string;
  lastVisit: string;
  status: "活跃" | "非活跃" | "已禁用";
  birthday?: string;
  email?: string;
}

interface ConsumptionRecord {
  id: string;
  date: string;
  amount: number;
  points: number;
  orderItems: string[];
}

const initialMembers: MemberType[] = [
  {
    id: "M001",
    name: "张三",
    phone: "13800138000",
    level: "黄金",
    points: 2500,
    totalSpent: 15800,
    joinDate: "2023-05-15",
    lastVisit: "2024-01-15",
    status: "活跃",
    birthday: "1990-01-01",
    email: "zhangsan@example.com",
  },
  {
    id: "M002",
    name: "李四",
    phone: "13900139000",
    level: "白银",
    points: 1200,
    totalSpent: 8500,
    joinDate: "2023-08-20",
    lastVisit: "2024-01-10",
    status: "活跃",
  },
];

const membershipLevels = {
  普通: { discount: 0.95, pointRate: 1, color: "gray" },
  白银: { discount: 0.9, pointRate: 1.2, color: "slate" },
  黄金: { discount: 0.85, pointRate: 1.5, color: "yellow" },
  钻石: { discount: 0.8, pointRate: 2, color: "blue" },
};

function Member() {
  //@ts-ignore
  const [members, setMembers] = useState<MemberType[]>(initialMembers);
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState<string>("全部");
  const [statusFilter, setStatusFilter] = useState<string>("全部");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<MemberType | null>(null);
  const [showConsumptionHistory, setShowConsumptionHistory] = useState(false);

  const filteredMembers = members.filter((member) => {
    const matchSearch =
      member.name.includes(searchTerm) ||
      member.phone.includes(searchTerm) ||
      member.id.includes(searchTerm);
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
              <tr key={member.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {member.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {member.phone}
                      </div>
                      <div className="text-xs text-gray-400">{member.id}</div>
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
                    总消费: ¥{member.totalSpent}
                  </div>
                  <div className="text-xs text-gray-500">
                    最近光临: {member.lastVisit}
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
                  姓名
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  defaultValue={selectedMember?.name}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  手机号
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  defaultValue={selectedMember?.phone}
                />
              </div>
              {/* Add more form fields as needed */}
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setSelectedMember(null);
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
