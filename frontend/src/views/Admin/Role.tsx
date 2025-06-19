import { useEffect, useState } from "react";
import {
  createRole,
  getRoles,
  updateRole,
  deleteRole,
  type RoleType,
  getPermissions,
  createRolePermission,
  updateRolePermission,
  getRolePermissionsByRoleId,
  type RolePermissionType,
  type PermissionType,
} from "@/apis/admin/role";

function Role() {
  const [roles, setRoles] = useState<RoleType[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleType | null>(null);
  const [permissions, setPermissions] = useState<PermissionType[]>([]);
  const [rolePermissions, setRolePermissions] = useState<RolePermissionType[]>(
    []
  );
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
  const [formData, setFormData] = useState({
    role_name: "",
    description: "",
    status: "启用",
  });

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, []);

  useEffect(() => {
    if (selectedRole) {
      setFormData({
        role_name: selectedRole.role_name,
        description: selectedRole.description,
        status: selectedRole.status,
      });
    } else {
      setFormData({
        role_name: "",
        description: "",
        status: "启用",
      });
    }
  }, [selectedRole]);

  const fetchRoles = async () => {
    try {
      const data = await getRoles();
      setRoles(data.filter((role: RoleType) => role.is_deleted === 0));
    } catch (error) {
      console.error("获取角色列表失败:", error);
    }
  };

  const fetchPermissions = async () => {
    try {
      const data = await getPermissions();
      setPermissions(data);
    } catch (error) {
      console.error("获取权限列表失败:", error);
    }
  };

  const fetchRolePermissions = async (roleId: number) => {
    try {
      const data = await getRolePermissionsByRoleId(roleId);
      const activePermissions = data.filter((rp) => rp.is_deleted === 0);
      setRolePermissions(activePermissions);
      setSelectedPermissions(activePermissions.map((rp) => rp.permission_id));
    } catch (error) {
      console.error("获取角色权限失败:", error);
    }
  };

  const handlePermissionChange = (permissionId: number) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleSavePermissions = async () => {
    if (!selectedRole) return;

    try {
      // 获取需要移除的权限
      const removedPermissions = rolePermissions.filter(
        (rp) => !selectedPermissions.includes(rp.permission_id)
      );

      // 标记删除旧的权限
      for (const rp of removedPermissions) {
        await updateRolePermission(rp.role_permission_id, {
          ...rp,
          is_deleted: 1,
        });
      }

      // 获取当前所有角色权限（包括已删除的）
      const allRolePermissions = await getRolePermissionsByRoleId(
        selectedRole.role_id
      );

      // 添加新的权限
      for (const permissionId of selectedPermissions) {
        // 检查权限是否已存在（包括已删除的记录）
        const existingPermission = allRolePermissions.find(
          (rp) => rp.permission_id === permissionId
        );

        if (existingPermission) {
          // 如果存在但被标记删除，则重新启用
          if (existingPermission.is_deleted === 1) {
            await updateRolePermission(existingPermission.role_permission_id, {
              ...existingPermission,
              is_deleted: 0,
            });
          }
        } else {
          // 如果不存在，则创建新的权限关联
          await createRolePermission({
            role_id: selectedRole.role_id,
            permission_id: permissionId,
            tenant_id: selectedRole.tenant_id,
            is_deleted: 0,
          } as RolePermissionType);
        }
      }

      setShowPermissionModal(false);
      setSelectedRole(null);
      setSelectedPermissions([]);
      setRolePermissions([]);
    } catch (error) {
      console.error("保存权限失败:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedRole) {
        await updateRole(selectedRole.role_id, {
          ...selectedRole,
          ...formData,
        });
      } else {
        await createRole({
          ...formData,
          tenant_id: 1,
          is_deleted: 0,
        } as RoleType);
      }
      await fetchRoles();
      setShowModal(false);
      setSelectedRole(null);
      setFormData({
        role_name: "",
        description: "",
        status: "启用",
      });
    } catch (error) {
      console.error("保存角色失败:", error);
    }
  };

  const handleDelete = async () => {
    if (selectedRole) {
      try {
        await deleteRole(selectedRole.role_id);
        await fetchRoles();
        setShowDeleteModal(false);
        setSelectedRole(null);
      } catch (error) {
        console.error("删除角色失败:", error);
      }
    }
  };

  const handleOpenPermissionModal = async (role: RoleType) => {
    setSelectedRole(role);
    setSelectedPermissions([]); // 重置选中的权限
    setRolePermissions([]); // 重置角色权限
    setShowPermissionModal(true);
    await fetchRolePermissions(role.role_id);
  };

  const handleClosePermissionModal = () => {
    setShowPermissionModal(false);
    setSelectedRole(null);
    setSelectedPermissions([]);
    setRolePermissions([]);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">角色管理</h1>
          <p className="mt-1 text-sm text-gray-600">共 {roles.length} 个角色</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
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
          添加角色
        </button>
      </div>

      {/* Roles Table */}
      <div className="bg-white shadow overflow-hidden rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                角色名称
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                描述
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                状态
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                创建时间
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {roles.map((role) => (
              <tr key={role.role_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {role.role_name}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-500">
                    {role.description}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      role.status === "启用"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {role.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(role.created_at).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => {
                      setSelectedRole(role);
                      setShowModal(true);
                    }}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    编辑
                  </button>
                  <button
                    onClick={() => {
                      setSelectedRole(role);
                      setShowDeleteModal(true);
                    }}
                    className="text-red-600 hover:text-red-900 mr-4"
                  >
                    删除
                  </button>
                  <button
                    onClick={() => handleOpenPermissionModal(role)}
                    className="text-green-600 hover:text-green-900"
                  >
                    权限设置
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">
                {selectedRole ? "编辑角色" : "添加角色"}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedRole(null);
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

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  角色名称
                </label>
                <input
                  type="text"
                  value={formData.role_name}
                  onChange={(e) =>
                    setFormData({ ...formData, role_name: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  描述
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  状态
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="启用">启用</option>
                  <option value="禁用">禁用</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setSelectedRole(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  {selectedRole ? "保存修改" : "添加角色"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium mb-4">确认删除</h3>
            <p className="text-sm text-gray-500 mb-4">
              确定要删除角色"{selectedRole?.role_name}"吗？此操作不可撤销。
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedRole(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                取消
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700"
              >
                删除
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Permission Management Modal */}
      {showPermissionModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">
                权限管理 - {selectedRole?.role_name}
              </h3>
              <button
                onClick={handleClosePermissionModal}
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

            <div className="max-h-96 overflow-y-auto">
              {permissions.map((permission) => (
                <div
                  key={permission.permission_id}
                  className="flex items-center mb-2"
                >
                  <input
                    type="checkbox"
                    id={`permission-${permission.permission_id}`}
                    checked={selectedPermissions.includes(
                      permission.permission_id
                    )}
                    onChange={() =>
                      handlePermissionChange(permission.permission_id)
                    }
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor={`permission-${permission.permission_id}`}
                    className="ml-2 block text-sm text-gray-900"
                  >
                    {permission.permission_name}
                  </label>
                </div>
              ))}
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={handleClosePermissionModal}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                取消
              </button>
              <button
                onClick={handleSavePermissions}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                保存权限
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Role;
