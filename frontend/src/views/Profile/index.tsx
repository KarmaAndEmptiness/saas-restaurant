import { useState } from "react";

interface UserProfile {
  name: string;
  avatar: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  joinDate: string;
  lastLogin: string;
}

const initialProfile: UserProfile = {
  name: "张三",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
  email: "zhangsan@example.com",
  phone: "13800138000",
  role: "餐厅经理",
  department: "运营部",
  joinDate: "2023-01-15",
  lastLogin: "2024-01-20 15:30",
};

function Profile() {
  //@ts-ignore
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "profile" | "security" | "preferences"
  >("profile");

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow">
        {/* Profile Header */}
        <div className="border-b border-gray-200">
          <div className="p-6">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="h-24 w-24 rounded-full"
                />
                <button className="absolute bottom-0 right-0 bg-gray-100 p-1 rounded-full border border-gray-300 hover:bg-gray-200">
                  <svg
                    className="h-4 w-4 text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                </button>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {profile.name}
                </h2>
                <p className="text-sm text-gray-500">
                  {profile.role} · {profile.department}
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="px-6">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: "profile", name: "基本资料" },
                { id: "security", name: "安全设置" },
                { id: "preferences", name: "偏好设置" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`
                    whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                    ${
                      activeTab === tab.id
                        ? "border-indigo-500 text-indigo-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }
                  `}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Panels */}
        <div className="p-6">
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    姓名
                  </label>
                  <input
                    type="text"
                    value={profile.name}
                    disabled={!isEditing}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    邮箱
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    disabled={!isEditing}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    手机号
                  </label>
                  <input
                    type="tel"
                    value={profile.phone}
                    disabled={!isEditing}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    部门
                  </label>
                  <input
                    type="text"
                    value={profile.department}
                    disabled={!isEditing}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                {isEditing ? (
                  <>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      取消
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      保存
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    编辑资料
                  </button>
                )}
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">修改密码</h3>
                <div className="mt-4 grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      当前密码
                    </label>
                    <input
                      type="password"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      新密码
                    </label>
                    <input
                      type="password"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      确认新密码
                    </label>
                    <input
                      type="password"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <button className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                    更新密码
                  </button>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  双因素认证
                </h3>
                <div className="mt-4">
                  <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                    启用双因素认证
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "preferences" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">通知设置</h3>
                <div className="mt-4 space-y-4">
                  {["新订单提醒", "系统消息", "促销活动"].map((item) => (
                    <div key={item} className="flex items-center">
                      <input
                        id={item}
                        type="checkbox"
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor={item}
                        className="ml-3 text-sm text-gray-700"
                      >
                        {item}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  语言与地区
                </h3>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      语言
                    </label>
                    <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                      <option>简体中文</option>
                      <option>English</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      时区
                    </label>
                    <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                      <option>(GMT+8:00) 北京</option>
                      <option>(GMT+0:00) 伦敦</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Activity Log */}
      <div className="mt-6 bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">最近活动</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {[
            { action: "登录系统", time: "2分钟前" },
            { action: "修改个人资料", time: "1天前" },
            { action: "更新密码", time: "1周前" },
          ].map((activity, i) => (
            <div key={i} className="px-6 py-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-900">{activity.action}</span>
                <span className="text-sm text-gray-500">{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Profile;
