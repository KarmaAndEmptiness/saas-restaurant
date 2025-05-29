import { useState } from "react";

interface SystemSettings {
  theme: "light" | "dark" | "system";
  language: "zh" | "en";
  timezone: string;
  notifications: {
    email: boolean;
    browser: boolean;
    mobile: boolean;
  };
  security: {
    twoFactor: boolean;
    sessionTimeout: number;
    ipRestriction: boolean;
  };
  display: {
    compactMode: boolean;
    animationsEnabled: boolean;
    fontSize: "small" | "medium" | "large";
  };
}

const initialSettings: SystemSettings = {
  theme: "light",
  language: "zh",
  timezone: "Asia/Shanghai",
  notifications: {
    email: true,
    browser: true,
    mobile: false,
  },
  security: {
    twoFactor: false,
    sessionTimeout: 30,
    ipRestriction: false,
  },
  display: {
    compactMode: false,
    animationsEnabled: true,
    fontSize: "medium",
  },
};

function Setting() {
  const [settings, setSettings] = useState<SystemSettings>(initialSettings);
  const [activeTab, setActiveTab] = useState<
    "general" | "security" | "notifications" | "display"
  >("general");
  const [hasChanges, setHasChanges] = useState(false);

  const updateSettings = (updates: Partial<SystemSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
    setHasChanges(true);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">系统设置</h2>
          <p className="mt-1 text-sm text-gray-500">
            管理系统偏好设置、安全配置和通知选项
          </p>
        </div>

        {/* Settings Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px px-6" aria-label="Tabs">
            {[
              { key: "general", name: "常规设置" },
              { key: "security", name: "安全配置" },
              { key: "notifications", name: "通知设置" },
              { key: "display", name: "显示选项" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`
                  whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm
                  ${
                    activeTab === tab.key
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

        {/* Settings Content */}
        <div className="p-6">
          {activeTab === "general" && (
            <div className="space-y-6">
              {/* Language */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  系统语言
                </label>
                <select
                  value={settings.language}
                  onChange={(e) =>
                    updateSettings({ language: e.target.value as "zh" | "en" })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="zh">简体中文</option>
                  <option value="en">English</option>
                </select>
              </div>

              {/* Theme */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  主题设置
                </label>
                <select
                  value={settings.theme}
                  onChange={(e) =>
                    updateSettings({
                      theme: e.target.value as "light" | "dark" | "system",
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="light">浅色主题</option>
                  <option value="dark">深色主题</option>
                  <option value="system">跟随系统</option>
                </select>
              </div>

              {/* Timezone */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  时区设置
                </label>
                <select
                  value={settings.timezone}
                  onChange={(e) => updateSettings({ timezone: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="Asia/Shanghai">(GMT+8:00) 北京</option>
                  <option value="Asia/Tokyo">(GMT+9:00) 东京</option>
                  <option value="America/New_York">(GMT-5:00) 纽约</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-6">
              {/* Two Factor Authentication */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    双因素认证
                  </h3>
                  <p className="text-sm text-gray-500">增强账户安全性</p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    updateSettings({
                      security: {
                        ...settings.security,
                        twoFactor: !settings.security.twoFactor,
                      },
                    })
                  }
                  className={`
                    relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer
                    transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                    ${
                      settings.security.twoFactor
                        ? "bg-indigo-600"
                        : "bg-gray-200"
                    }
                  `}
                >
                  <span
                    className={`
                    pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200
                    ${
                      settings.security.twoFactor
                        ? "translate-x-5"
                        : "translate-x-0"
                    }
                  `}
                  />
                </button>
              </div>

              {/* Session Timeout */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  会话超时时间（分钟）
                </label>
                <input
                  type="number"
                  value={settings.security.sessionTimeout}
                  onChange={(e) =>
                    updateSettings({
                      security: {
                        ...settings.security,
                        sessionTimeout: parseInt(e.target.value),
                      },
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              {/* IP Restriction */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    IP访问限制
                  </h3>
                  <p className="text-sm text-gray-500">限制特定IP地址访问</p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    updateSettings({
                      security: {
                        ...settings.security,
                        ipRestriction: !settings.security.ipRestriction,
                      },
                    })
                  }
                  className={`
                    relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer
                    transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                    ${
                      settings.security.ipRestriction
                        ? "bg-indigo-600"
                        : "bg-gray-200"
                    }
                  `}
                >
                  <span
                    className={`
                    pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200
                    ${
                      settings.security.ipRestriction
                        ? "translate-x-5"
                        : "translate-x-0"
                    }
                  `}
                  />
                </button>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-6">
              {/* Email Notifications */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    邮件通知
                  </h3>
                  <p className="text-sm text-gray-500">接收重要更新和提醒</p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    updateSettings({
                      notifications: {
                        ...settings.notifications,
                        email: !settings.notifications.email,
                      },
                    })
                  }
                  className={`
                    relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer
                    transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                    ${
                      settings.notifications.email
                        ? "bg-indigo-600"
                        : "bg-gray-200"
                    }
                  `}
                >
                  <span
                    className={`
                    pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200
                    ${
                      settings.notifications.email
                        ? "translate-x-5"
                        : "translate-x-0"
                    }
                  `}
                  />
                </button>
              </div>

              {/* Browser Notifications */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    浏览器通知
                  </h3>
                  <p className="text-sm text-gray-500">桌面推送通知</p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    updateSettings({
                      notifications: {
                        ...settings.notifications,
                        browser: !settings.notifications.browser,
                      },
                    })
                  }
                  className={`
                    relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer
                    transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                    ${
                      settings.notifications.browser
                        ? "bg-indigo-600"
                        : "bg-gray-200"
                    }
                  `}
                >
                  <span
                    className={`
                    pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200
                    ${
                      settings.notifications.browser
                        ? "translate-x-5"
                        : "translate-x-0"
                    }
                  `}
                  />
                </button>
              </div>
            </div>
          )}

          {activeTab === "display" && (
            <div className="space-y-6">
              {/* Compact Mode */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    紧凑模式
                  </h3>
                  <p className="text-sm text-gray-500">减小界面元素间距</p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    updateSettings({
                      display: {
                        ...settings.display,
                        compactMode: !settings.display.compactMode,
                      },
                    })
                  }
                  className={`
                    relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer
                    transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                    ${
                      settings.display.compactMode
                        ? "bg-indigo-600"
                        : "bg-gray-200"
                    }
                  `}
                >
                  <span
                    className={`
                    pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200
                    ${
                      settings.display.compactMode
                        ? "translate-x-5"
                        : "translate-x-0"
                    }
                  `}
                  />
                </button>
              </div>

              {/* Font Size */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  字体大小
                </label>
                <select
                  value={settings.display.fontSize}
                  onChange={(e) =>
                    updateSettings({
                      display: {
                        ...settings.display,
                        fontSize: e.target.value as
                          | "small"
                          | "medium"
                          | "large",
                      },
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="small">小</option>
                  <option value="medium">中</option>
                  <option value="large">大</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {hasChanges && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
            <button
              onClick={() => {
                setSettings(initialSettings);
                setHasChanges(false);
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              取消
            </button>
            <button
              onClick={() => {
                // 保存设置的逻辑
                console.log("Saving settings:", settings);
                setHasChanges(false);
              }}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              保存更改
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Setting;
