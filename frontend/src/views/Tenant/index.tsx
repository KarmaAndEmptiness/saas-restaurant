import { useEffect, useState } from "react";
import {
  getTenants,
  createTenant,
  updateTenant,
  deleteTenant,
  getToken,
  type TenantType,
} from "@/apis/tenant";

function TenantModal({
  isOpen,
  onClose,
  tenant,
  mode,
}: {
  isOpen: boolean;
  onClose: () => void;
  tenant?: TenantType;
  mode: "create" | "edit" | "token";
}) {
  const initialFormData = {
    status: "活跃",
    tenant_name: "",
    email: "",
    phone: "",
  };

  const [formData, setFormData] =
    useState<Partial<TenantType>>(initialFormData);
  //@ts-ignore
  const [token, setToken] = useState<string>("");

  useEffect(() => {
    if (mode === "edit" && tenant) {
      setFormData({
        tenant_name: tenant.tenant_name || "",
        email: tenant.email || "",
        phone: tenant.phone || "",
        status: tenant.status || "活跃", // 确保始终有默认值
      });
    } else if (mode === "create") {
      setFormData(initialFormData);
    }
  }, [tenant, mode]);

  // useEffect(() => {
  //   if (mode === "token" && tenant?.tenant_id) {
  //     getToken(tenant.tenant_id).then((response) => {
  //       // 修改这里，使用 response.data.token 而不是 response.data
  //       setToken(response.token);
  //     });
  //   }
  // }, [mode, tenant]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (mode === "create") {
        // 先创建租户
        const createdTenant = await createTenant(formData as TenantType);
        console.log(createdTenant);
        // 然后获取token
        if (createdTenant.tenant_id) {
          const tokenResponse = await getToken(createdTenant.tenant_id);
          console.log(tokenResponse);
          // 更新租户的token
          await updateTenant(createdTenant.tenant_id, {
            ...formData,
            tenant_token: tokenResponse.token,
          } as TenantType);
        }
      } else if (mode === "edit" && tenant?.tenant_id) {
        // 编辑时直接使用现有的tenant_id
        const tokenResponse = await getToken(tenant.tenant_id);
        const updatedData = {
          ...formData,
          tenant_token: tokenResponse.token,
        } as TenantType;
        await updateTenant(tenant.tenant_id, updatedData);
      }
      handleClose();
    } catch (error) {
      console.error("操作失败:", error);
    }
  };

  const handleClose = () => {
    setFormData(initialFormData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
            {mode === "create"
              ? "添加租户"
              : mode === "edit"
              ? "编辑租户"
              : "租户Token"}
          </h3>
          {mode === "token" ? (
            <div>
              <div className="mt-2 p-4 bg-gray-50 rounded">
                <p className="text-sm text-gray-500 break-all">
                  {tenant?.tenant_token}{" "}
                  {/* 使用 token 状态而不是 tenant?.tenant_token */}
                </p>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={handleClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  关闭
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  租户名称
                </label>
                <input
                  type="text"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={formData.tenant_name || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, tenant_name: e.target.value })
                  }
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  邮箱
                </label>
                <input
                  type="email"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={formData.email || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  手机号
                </label>
                <input
                  type="tel"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={formData.phone || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  状态
                </label>
                <select
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={formData.status || "活跃"}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                >
                  <option value="活跃">活跃</option>
                  <option value="离线">离线</option>
                  <option value="停用">停用</option>
                </select>
              </div>
              <div className="flex items-center justify-end mt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="mr-3 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                >
                  确认
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-2">
          {title}
        </h3>
        <p className="text-sm text-gray-500 mb-4">{message}</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            取消
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
          >
            确认
          </button>
        </div>
      </div>
    </div>
  );
}

function Tenant() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "全部" | "活跃" | "离线" | "停用"
  >("全部");
  //@ts-ignore
  const [showModal, setShowModal] = useState(false);
  const [tenants, setTenants] = useState<TenantType[]>([]);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "token">(
    "create"
  );
  const [selectedTenant, setSelectedTenant] = useState<
    TenantType | undefined
  >();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const filteredTenants = tenants.filter((tenant) => {
    const matchSearch =
      tenant.email.includes(searchTerm) ||
      tenant.tenant_name.includes(searchTerm);
    const matchStatus =
      statusFilter === "全部" || tenant.status === statusFilter;
    return matchSearch && matchStatus;
  });

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const tenants = await getTenants();
        setTenants(tenants);
      } catch (error) {
        console.error("获取租户数据失败:", error);
      }
    };
    fetchTenants();
  }, []);

  const handleDelete = async (tenant: TenantType) => {
    try {
      await deleteTenant(tenant.tenant_id);
      window.location.reload();
    } catch (error) {
      console.error("删除失败:", error);
    }
  };

  return (
    <div className="mx-auto py-6 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">租户管理</h1>
            <p className="mt-2 text-sm text-gray-700">
              共 {tenants.length} 个租户，
              {tenants.filter((t) => t.status === "活跃").length} 个活跃租户
            </p>
          </div>
          <button
            onClick={() => {
              setModalMode("create");
              setShowModal(true);
            }}
            className="mt-4 sm:mt-0 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg
              className="h-4 w-4 mr-1.5"
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
            添加租户
          </button>
        </div>

        {/* Filters */}
        <div className="mt-4 sm:flex sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="max-w-xs flex-1">
            <label htmlFor="search" className="sr-only">
              搜索
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                name="search"
                id="search"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="搜索租户..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex space-x-2">
            {["全部", "活跃", "离线", "停用"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status as any)}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  statusFilter === status
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  姓名
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  邮箱
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  手机号
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
              {filteredTenants.map((tenant) => (
                <tr key={tenant.tenant_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {tenant.tenant_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {tenant.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {tenant.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {tenant.email}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                        tenant.status === "活跃"
                          ? "bg-green-100 text-green-800"
                          : tenant.status === "离线"
                          ? "bg-gray-100 text-gray-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {tenant.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {tenant.created_at}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => {
                          setSelectedTenant(tenant);
                          setModalMode("edit");
                          setShowModal(true);
                        }}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        编辑
                      </button>
                      <button
                        onClick={() => {
                          setSelectedTenant(tenant);
                          setShowDeleteConfirm(true);
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        删除
                      </button>
                      <button
                        onClick={() => {
                          setSelectedTenant(tenant);
                          setModalMode("token");
                          setShowModal(true);
                        }}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        查看token
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div className="flex-1 flex justify-between sm:hidden">
          <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            上一页
          </button>
          <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            下一页
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              显示第 <span className="font-medium">1</span> 到{" "}
              <span className="font-medium">10</span> 条， 共{" "}
              <span className="font-medium">{tenants.length}</span> 条结果
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                上一页
              </button>
              <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                下一页
              </button>
            </nav>
          </div>
        </div>
      </div>

      <TenantModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedTenant(undefined);
        }}
        tenant={selectedTenant}
        mode={modalMode}
      />

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => {
          if (selectedTenant) {
            handleDelete(selectedTenant);
          }
          setShowDeleteConfirm(false);
        }}
        title="确认删除"
        message={`确定要删除租户 "${selectedTenant?.tenant_name}" 吗？此操作不可撤销。`}
      />
    </div>
  );
}

export default Tenant;
