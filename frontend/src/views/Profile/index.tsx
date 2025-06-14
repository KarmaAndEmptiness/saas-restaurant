import { useEffect, useState } from "react";
import { getUserInfo, updateUserInfo, type UserInfo } from "@/apis/profile/";
import { uploadFile } from "@/apis/upload";

const baseurl = import.meta.env.VITE_API_BASE_URL;
const user_id = localStorage.getItem("user_id");
// const initialProfile: UserInfo = {
//   username: "张三",
//   avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
//   email: "zhangsan@example.com",
//   phone: "13800138000",
//   last_login: "2024-01-20 15:30",
// };

//@ts-ignore
const initialProfile: UserInfo = {};

function Profile() {
  const [profile, setProfile] = useState<UserInfo>(initialProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserInfo>(profile);
  const [activeTab, setActiveTab] = useState<
    "profile" | "security" | "preferences"
  >("profile");

  useEffect(() => {
    async function fetchUserInfo() {
      const data: UserInfo = await getUserInfo(user_id);
      setProfile(data);
      setFormData(data);
    }
    fetchUserInfo();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(e.target);
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      await updateUserInfo(user_id ? +user_id : null, formData);
      setProfile(formData);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const handleCancel = () => {
    setFormData(profile);
    setIsEditing(false);
  };

  // 添加文件上传处理函数
  const handleAvatarChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // 上传文件
      const { file_url } = await uploadFile({ file });
      const userId = localStorage.getItem("user_id");
      // 更新用户信息
      await updateUserInfo(userId ? parseInt(userId) : null, {
        ...profile,
        avatar_url: file_url,
      });
      // 更新本地状态
      setProfile((prev) => ({
        ...prev,
        avatar_url: file_url,
      }));
    } catch (error) {
      console.error("Failed to upload avatar:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow">
        {/* Profile Header */}
        <div className="border-b border-gray-200">
          <div className="p-6">
            <div className="flex items-center space-x-6">
              <div className="relative group">
                <img
                  src={
                    profile.avatar_url
                      ? baseurl + profile.avatar_url
                      : "https://api.dicebear.com/7.x/avataaars/svg?seed=1"
                  }
                  alt={profile.username}
                  className="h-24 w-24 rounded-full object-cover"
                />
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 bg-gray-100 p-2 rounded-full border border-gray-300 
                           hover:bg-gray-200 cursor-pointer transition-colors duration-200
                           group-hover:bg-gray-200"
                >
                  <input
                    id="avatar-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleAvatarChange}
                  />
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
                </label>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {profile.username}
                </h2>
                <p className="text-sm text-gray-500">
                  {/* {profile.role} · {profile.department} */}
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
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
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
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
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
                    value={formData.phone}
                    name="phone"
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                {isEditing ? (
                  <>
                    <button
                      onClick={() => handleCancel()}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      取消
                    </button>
                    <button
                      onClick={() => handleSave()}
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
