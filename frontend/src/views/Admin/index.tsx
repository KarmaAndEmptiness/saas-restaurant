import { useEffect, useState } from "react";
import {
  getUsers,
  type User,
  getUserRole,
  createUser,
  updateUser,
  deleteUser,
  type UserRole,
  createUserRole,
  deleteUserRole,
} from "@/apis/admin";

import { getRole, getRoles, type RoleType } from "@/apis/admin/role";
const baseurl = import.meta.env.VITE_API_BASE_URL;

const initialEmployees: User[] = [];
function Staff() {
  const [employees, setEmployees] = useState<User[]>(initialEmployees);
  const [roles, setRoles] = useState<RoleType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "全部" | "在职" | "休假" | "离职"
  >("全部");
  const [rolesFilter, setRolesFilter] = useState("全部");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    status: "在职",
    roles: [] as string[],
  });

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const rolesData = await getRoles();
        setRoles(rolesData);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };
    fetchRoles();
  }, []);

  const filteredEmployees = employees.filter((employee) => {
    const matchSearch =
      employee.username?.includes(searchTerm) ||
      employee.email?.includes(searchTerm) ||
      employee.phone?.includes(searchTerm);
    const matchStatus =
      statusFilter === "全部" || employee.status === statusFilter;
    const matchRole =
      rolesFilter === "全部" || employee?.roles?.includes(rolesFilter);
    return matchSearch && matchStatus && matchRole;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "在职":
        return "bg-green-100 text-green-800";
      case "休假":
        return "bg-yellow-100 text-yellow-800";
      case "离职":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const users = await getUsers();
        const usersWithRoles = await Promise.all(
          users.map(async (user: User) => {
            const userRoles = await getUserRole(user.user_id);
            const rolesInfo = await Promise.all(
              userRoles?.map(async (role: any) => {
                return await getRole(role.role_id);
              }) || []
            );
            return {
              ...user,
              roles: rolesInfo?.map((item) => item?.description || "") || [],
            };
          })
        );
        setEmployees(usersWithRoles);
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    };
    fetchEmployees();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedEmployee) {
        // 编辑用户
        await updateUser(selectedEmployee.user_id, {
          ...formData,
          user_id: selectedEmployee.user_id,
        } as User);

        // 获取当前用户的角色
        const currentUserRoles = await getUserRole(selectedEmployee.user_id);

        // 删除所有现有角色
        for (const userRole of currentUserRoles || []) {
          await deleteUserRole(userRole.user_role_id);
        }

        // 添加新选择的角色
        const selectedRoleIds = roles
          .filter((role) => formData.roles.includes(role.description))
          .map((role) => role.role_id);

        for (const roleId of selectedRoleIds) {
          await createUserRole({
            user_id: selectedEmployee.user_id,
            role_id: roleId,
          });
        }
        setSelectedEmployee(null);
      } else {
        // 创建新用户
        const newUser = await createUser(formData as User);

        // 为新用户添加角色
        const selectedRoleIds = roles
          .filter((role) => formData.roles.includes(role.description))
          .map((role) => role.role_id);

        for (const roleId of selectedRoleIds) {
          await createUserRole({
            user_id: newUser.user_id,
            role_id: roleId,
          });
        }
      }

      // 刷新用户列表
      const users = await getUsers();
      const usersWithRoles = await Promise.all(
        users.map(async (user: User) => {
          const userRoles = await getUserRole(user.user_id);
          const rolesInfo = await Promise.all(
            userRoles?.map(async (role: UserRole) => {
              const roleInfo = await getRole(role.role_id);
              return roleInfo.description;
            }) || []
          );
          return {
            ...user,
            roles: rolesInfo,
          };
        })
      );

      setEmployees(usersWithRoles);
      setShowAddModal(false);
      setShowEditModal(false);
      setFormData({
        username: "",
        email: "",
        phone: "",
        password: "",
        status: "在职",
        roles: [],
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleDelete = async () => {
    if (selectedEmployee) {
      try {
        await deleteUser(selectedEmployee.user_id);
        setEmployees(
          employees.filter((e) => e.user_id !== selectedEmployee.user_id)
        );
        setShowDeleteModal(false);
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">员工管理</h1>
          <p className="mt-1 text-sm text-gray-600">
            共 {employees.length} 名员工，
            {employees.filter((e) => e.status === "在职").length} 名在职
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <svg
            className="h-5 w-5 mr-2"
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
          添加员工
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="relative">
          <input
            type="text"
            placeholder="搜索员工..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
        >
          {["全部", "在职", "休假", "离职"].map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        <select
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          value={rolesFilter}
          onChange={(e) => setRolesFilter(e.target.value)}
        >
          <option value="全部">全部</option>
          {roles.map((role) => (
            <option key={role.role_id} value={role.description}>
              {role.description}
            </option>
          ))}
        </select>
      </div>

      {/* Employee Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                员工信息
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                角色
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                联系方式
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                状态
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                入职日期
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredEmployees.map((employee) => (
              <tr key={employee.user_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <img
                        className="h-10 w-10 rounded-full"
                        src={
                          (employee.avatar_url
                            ? baseurl + employee.avatar_url
                            : "") ||
                          "https://api.dicebear.com/7.x/avataaars/svg?seed=" +
                            employee.user_id
                        }
                        alt=""
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {employee.username}
                      </div>
                      <div className="text-sm text-gray-500">
                        {employee.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {employee?.roles?.join(",")}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{employee.phone}</div>
                  <div className="text-sm text-gray-500">{employee.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                      employee.status || ""
                    )}`}
                  >
                    {employee.status || ""}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {employee.created_at}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => {
                      setSelectedEmployee(employee);
                      setFormData({
                        username: employee.username || "",
                        email: employee.email || "",
                        phone: employee.phone || "",
                        password: employee.password || "",
                        status: employee.status || "在职",
                        roles: employee.roles || [],
                      });
                      setShowEditModal(true);
                    }}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    编辑
                  </button>
                  <button
                    onClick={() => {
                      setSelectedEmployee(employee);
                      setShowDeleteModal(true);
                    }}
                    className="text-red-600 hover:text-red-900"
                  >
                    删除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit User Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">
              {showAddModal ? "添加员工" : "编辑员工"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    用户名
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    邮箱
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    电话
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                {!showEditModal && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      密码
                    </label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      required={!showEditModal}
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    状态
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as any,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    {["在职", "休假", "离职"].map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    角色
                  </label>
                  <div className="mt-2 space-y-2">
                    {roles.map((role) => (
                      <label
                        key={role.role_id}
                        className="inline-flex items-center mr-4"
                      >
                        <input
                          type="checkbox"
                          checked={formData.roles.includes(role.description)}
                          onChange={(e) => {
                            const newRoles = e.target.checked
                              ? [...formData.roles, role.description]
                              : formData.roles.filter(
                                  (r) => r !== role.description
                                );
                            setFormData({ ...formData, roles: newRoles });
                          }}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="ml-2">{role.description}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                    setSelectedEmployee(null);
                    setFormData({
                      username: "",
                      email: "",
                      phone: "",
                      password: "",
                      status: "在职",
                      roles: [],
                    });
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  确认
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">确认删除</h3>
            <p className="text-sm text-gray-500 mb-4">
              确定要删除员工 {selectedEmployee?.username} 吗？此操作无法撤销。
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedEmployee(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                取消
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Staff;
