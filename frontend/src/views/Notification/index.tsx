import { useState } from "react";

interface NotificationType {
  id: string;
  title: string;
  content: string;
  type: "系统" | "预警" | "订单" | "库存" | "会员";
  priority: "高" | "中" | "低";
  isRead: boolean;
  createTime: string;
  expireTime?: string;
  link?: string;
}

const initialNotifications: NotificationType[] = [
  {
    id: "N001",
    title: "系统升级通知",
    content: "系统将于今晚23:00-次日凌晨2:00进行升级维护，请做好相关准备。",
    type: "系统",
    priority: "高",
    isRead: false,
    createTime: "2024-01-20 10:00",
    expireTime: "2024-01-21 02:00",
  },
  {
    id: "N002",
    title: "库存预警",
    content: "五花肉库存不足，当前库存低于最小阈值，请及时补货。",
    type: "库存",
    priority: "中",
    isRead: false,
    createTime: "2024-01-20 09:30",
    link: "/home/inventory",
  },
  {
    id: "N003",
    title: "新订单通知",
    content: "收到新的堂食订单，订单号：O2024012001，请及时处理。",
    type: "订单",
    priority: "中",
    isRead: true,
    createTime: "2024-01-20 09:15",
    link: "/home/orders",
  },
];

function Notification() {
  const [notifications, setNotifications] =
    useState<NotificationType[]>(initialNotifications);
  const [selectedType, setSelectedType] = useState<string>("全部");
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  const getPriorityColor = (priority: string) => {
    const colors = {
      高: "bg-red-100 text-red-800",
      中: "bg-yellow-100 text-yellow-800",
      低: "bg-green-100 text-green-800",
    };
    return colors[priority as keyof typeof colors] || colors.低;
  };

  const getTypeColor = (type: string) => {
    const colors = {
      系统: "bg-purple-100 text-purple-800",
      预警: "bg-red-100 text-red-800",
      订单: "bg-blue-100 text-blue-800",
      库存: "bg-green-100 text-green-800",
      会员: "bg-indigo-100 text-indigo-800",
    };
    return colors[type as keyof typeof colors] || colors.系统;
  };

  const filteredNotifications = notifications.filter((notification) => {
    const matchType =
      selectedType === "全部" || notification.type === selectedType;
    const matchRead = !showUnreadOnly || !notification.isRead;
    return matchType && matchRead;
  });

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({ ...notification, isRead: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(
      notifications.filter((notification) => notification.id !== id)
    );
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">通知中心</h1>
          <p className="mt-1 text-sm text-gray-600">
            共 {notifications.length} 条通知，
            {notifications.filter((n) => !n.isRead).length} 条未读
          </p>
        </div>
        <button
          onClick={markAllAsRead}
          className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          全部标记为已读
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4">
        <div className="flex space-x-2">
          {["全部", "系统", "预警", "订单", "库存", "会员"].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                selectedType === type
                  ? "bg-indigo-100 text-indigo-700"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
        <label className="flex items-center ml-auto">
          <input
            type="checkbox"
            checked={showUnreadOnly}
            onChange={(e) => setShowUnreadOnly(e.target.checked)}
            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <span className="ml-2 text-sm text-gray-600">只显示未读</span>
        </label>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.map((notification) => (
          <div
            key={notification.id}
            className={`bg-white rounded-lg shadow-sm p-4 ${
              !notification.isRead ? "border-l-4 border-indigo-500" : ""
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(
                      notification.type
                    )}`}
                  >
                    {notification.type}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                      notification.priority
                    )}`}
                  >
                    {notification.priority}优先级
                  </span>
                  {!notification.isRead && (
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                    </span>
                  )}
                </div>
                <h3 className="mt-2 text-lg font-medium text-gray-900">
                  {notification.title}
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  {notification.content}
                </p>
                <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                  <span>{notification.createTime}</span>
                  {notification.expireTime && (
                    <>
                      <span>·</span>
                      <span>过期时间: {notification.expireTime}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="ml-4 flex items-start space-x-2">
                {!notification.isRead && (
                  <button
                    onClick={() => markAsRead(notification.id)}
                    className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                  >
                    标记已读
                  </button>
                )}
                <button
                  onClick={() => deleteNotification(notification.id)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
            {notification.link && (
              <div className="mt-3 flex">
                <a
                  href={notification.link}
                  className="text-sm text-indigo-600 hover:text-indigo-900 font-medium"
                >
                  查看详情 →
                </a>
              </div>
            )}
          </div>
        ))}

        {filteredNotifications.length === 0 && (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">暂无通知</h3>
            <p className="mt-1 text-sm text-gray-500">没有符合条件的通知消息</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Notification;
