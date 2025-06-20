import { useState, useCallback, useEffect } from "react";
import { Disclosure, Menu } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import logo from "../../public/favicon.png";
import { getUserInfo, type UserInfo } from "@/apis/profile";
import {
  getRolePermissionsByRoleId,
  getPermission,
  type PermissionType,
} from "@/apis/admin/role";
const baseurl = import.meta.env.VITE_API_BASE_URL;
interface Navigation {
  name: string;
  path: string;
  permission?: string[]; // 改为字符串数组
}

const navs: Navigation[] = [
  { name: "员工管理", path: "/home/staff", permission: ["user_admin"] },
  { name: "角色管理", path: "/home/role", permission: ["user_admin"] },
  {
    name: "菜品管理",
    path: "/home/goods",
    permission: ["user_admin", "front_admin", "kitchen_admin"],
  },
  {
    name: "分店管理",
    path: "/home/branch",
    permission: ["user_admin", "front_admin"],
  },
  {
    name: "客户下单",
    path: "/home/place-order",
    permission: ["user_admin", "front_admin"],
  },
  {
    name: "订单列表",
    path: "/home/order-list",
    permission: ["user_admin", "front_admin", "kitchen_admin"],
  },
  {
    name: "会员管理",
    path: "/home/member",
    permission: ["user_admin", "front_admin"],
  },
  {
    name: "库存管理",
    path: "/home/inventory",
    permission: ["user_admin", "inventory_admin"],
  },
  {
    name: "报表中心",
    path: "/home/report",
    permission: ["user_admin", "accounts_admin"],
  },
  {
    name: "会员营销",
    path: "/home/campaign",
    permission: ["user_admin", "marketing_admin"],
  },
];

const adminNavs: Navigation[] = [
  { name: "租户管理", path: "/home/tenant" },
  // ...navs,
];

const userNavs: Navigation[] = [
  {
    name: "个人信息",
    path: "/home/profile",
    permission: [
      "user_admin",
      "front_admin",
      "inventory_admin",
      "marketing_admin",
      "accounts_admin",
      "kitchen_admin",
    ],
  },
  {
    name: "设置",
    path: "/home/setting",
    permission: [
      "user_admin",
      "front_admin",
      "inventory_admin",
      "marketing_admin",
      "accounts_admin",
      "kitchen_admin",
    ],
  },
  {
    name: "日志管理",
    path: "/home/log",
    permission: ["user_admin"],
  },
  {
    name: "预警管理",
    path: "/home/warning",
    permission: ["user_admin"],
  },
  { name: "退出", path: "/" }, // 退出不需要权限控制
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

function Home() {
  const [currentNav, setCurrentNav] = useState<Navigation | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [displayNavs, setDisplayNavs] = useState<Navigation[]>([]);
  const [userPermissions, setUserPermissions] = useState<string[]>([]);
  const navigate = useNavigate();

  const handleNavClick = useCallback((item: Navigation) => {
    if (item.path === "/") {
      // 清除所有本地存储和状态
      localStorage.clear();
      setCurrentNav(null);
      setUserInfo(undefined);
      setDisplayNavs([]);
      setUserPermissions([]);
      return;
    }
    setCurrentNav(item);
  }, []);

  // 将获取权限的逻辑抽离成独立函数
  const fetchUserPermissions = useCallback(async () => {
    try {
      const roles_id = JSON.parse(localStorage.getItem("roles_id") || "[]");
      const permissions = new Set<string>();

      for (const roleId of roles_id) {
        const rolePermissions = await getRolePermissionsByRoleId(roleId);
        console.log("role_id", roleId);
        console.log("rolePermissions", rolePermissions);
        for (const rp of rolePermissions) {
          const permission = await getPermission(rp.permission_id);
          if (permission.permission_code) {
            permissions.add(permission.permission_code);
          }
        }
      }

      setUserPermissions(Array.from(permissions));
    } catch (error) {
      console.error("获取权限失败:", error);
    }
  }, []);

  const getFilteredUserNavs = useCallback(() => {
    const roles = JSON.parse(localStorage.getItem("roles") || "[]");
    if (roles.includes("system_admin")) {
      return userNavs;
    }
    return userNavs.filter(
      (nav) =>
        !nav.permission ||
        nav.permission.some((p) => userPermissions.includes(p))
    );
  }, [userPermissions]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userId = localStorage.getItem("user_id");
        if (!userId) return;

        const data = await getUserInfo(userId);
        setUserInfo(data);
      } catch (error) {
        console.error("获取用户信息失败:", error);
      }
    };

    // 检查是否有token，如果没有则不执行获取操作
    const token = localStorage.getItem("token");
    if (token) {
      fetchUserInfo();
      fetchUserPermissions();
    }
  }, [fetchUserPermissions]);

  useEffect(() => {
    // 根据用户权限过滤导航菜单
    const roles = JSON.parse(localStorage.getItem("roles") || "[]");
    let filteredNavs: Navigation[] = [];
    if (roles.includes("system_admin")) {
      filteredNavs = adminNavs;
      setDisplayNavs(adminNavs);
      // 如果当前不在租户管理页面，则重定向
      if (window.location.pathname === "/home") {
        navigate("/home/tenant");
      }
    } else {
      filteredNavs = navs.filter(
        (nav) =>
          !nav.permission ||
          nav.permission.some((p) => userPermissions.includes(p))
      );
      setDisplayNavs(filteredNavs);
      // 如果在根路径，则重定向到第一个可用的导航项
      if (
        window.location.pathname === "/home/staff" &&
        filteredNavs.length > 0
      ) {
        navigate(filteredNavs[0].path);
      }
    }

    // 设置当前导航
    const currentPath = window.location.pathname;
    const currentNavItem = filteredNavs.find((nav) => nav.path === currentPath);
    if (currentNavItem) {
      setCurrentNav(currentNavItem);
    } else if (filteredNavs.length > 0) {
      setCurrentNav(filteredNavs[0]);
    }
  }, [userPermissions, navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Disclosure as="nav" className="bg-white shadow-sm">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 justify-between">
                {/* Logo and Desktop Navigation */}
                <div className="flex">
                  <div className="flex flex-shrink-0 items-center">
                    <img className="h-8 w-auto" src={logo} alt="餐饮管理" />
                  </div>
                  <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                    {displayNavs.map((item) => (
                      <NavLink
                        key={item.name}
                        to={item.path}
                        onClick={() => handleNavClick(item)}
                        className={({ isActive }) =>
                          classNames(
                            isActive
                              ? "border-indigo-500 text-gray-900"
                              : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                            "inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium"
                          )
                        }
                      >
                        {item.name}
                      </NavLink>
                    ))}
                  </div>
                </div>

                {/* Right Side Actions */}
                <div className="hidden sm:ml-6 sm:flex sm:items-center">
                  {/* Notification bell */}
                  <NavLink
                    onClick={() =>
                      handleNavClick({
                        name: "通知",
                        path: "/home/notification",
                      })
                    }
                    to="/home/notification"
                  >
                    <button className="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500">
                      <BellIcon className="h-6 w-6" />
                    </button>
                  </NavLink>
                  {/* Profile dropdown */}
                  <Menu as="div" className="relative ml-3">
                    <Menu.Button className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                      <img
                        className="h-8 w-8 rounded-full"
                        src={
                          userInfo?.avatar_url
                            ? baseurl + userInfo.avatar_url
                            : "https://api.dicebear.com/7.x/avataaars/svg?seed=1"
                        }
                        alt=""
                      />
                    </Menu.Button>
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                      {getFilteredUserNavs().map((item) => (
                        <Menu.Item key={item.name}>
                          {({ active }) => (
                            <NavLink
                              to={item.path}
                              onClick={() => handleNavClick(item)}
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-gray-700"
                              )}
                            >
                              {item.name}
                            </NavLink>
                          )}
                        </Menu.Item>
                      ))}
                    </Menu.Items>
                  </Menu>
                </div>

                {/* Mobile menu button */}
                <div className="flex items-center sm:hidden">
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500">
                    {open ? (
                      <XMarkIcon className="h-6 w-6" />
                    ) : (
                      <Bars3Icon className="h-6 w-6" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>

            {/* Mobile menu */}
            <Disclosure.Panel className="sm:hidden">
              <div className="space-y-1 pb-3 pt-2">
                {displayNavs.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as={NavLink}
                    to={item.path}
                    onClick={() => handleNavClick(item)}
                    //@ts-ignore
                    className={({ isActive }) =>
                      classNames(
                        isActive
                          ? "bg-indigo-50 border-indigo-500 text-indigo-700"
                          : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800",
                        "block border-l-4 py-2 pl-3 pr-4 text-base font-medium"
                      )
                    }
                  >
                    {item.name}
                  </Disclosure.Button>
                ))}
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      {/* Page header */}
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-lg font-semibold text-gray-900">
            {currentNav?.name}
          </h1>
        </div>
      </header>

      {/* Main content */}
      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default Home;
