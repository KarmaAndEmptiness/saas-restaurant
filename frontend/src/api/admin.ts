import request from '@/utils/request';

// 类型定义
export interface StaffMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  department: string;
  joinDate: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
}

export interface Permission {
  id: string;
  name: string;
  code: string;
  description: string;
  type: 'menu' | 'operation';
}

export interface LogItem {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  action: string;
  operator: string;
  operatorRole: string;
  ip: string;
  timestamp: string;
  details: string;
}

// 员工管理 API
export const staff = {
  /** 获取员工列表 */
  list: () => request.get<{ data: StaffMember[] }>('/admin/staff'),

  /** 添加员工 */
  create: (data: Omit<StaffMember, 'id'>) => 
    request.post<{ id: string }>('/admin/staff', data),

  /** 更新员工信息 */
  update: (id: string, data: Partial<StaffMember>) =>
    request.put(`/admin/staff/${id}`, data),

  /** 删除员工 */
  delete: (id: string) => request.delete(`/admin/staff/${id}`),

  /** 导入员工数据 */
  import: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return request.post('/admin/staff/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  /** 导出员工数据 */
  export: () => request.get('/admin/staff/export', { responseType: 'blob' }),
};

// 角色管理 API
export const roles = {
  /** 获取角色列表 */
  list: () => request.get<Role[]>('/admin/roles'),

  /** 创建角色 */
  create: (data: Omit<Role, 'id' | 'userCount'>) =>
    request.post<{ id: string }>('/admin/roles', data),

  /** 更新角色 */
  update: (id: string, data: Partial<Role>) =>
    request.put(`/admin/roles/${id}`, data),

  /** 删除角色 */
  delete: (id: string) => request.delete(`/admin/roles/${id}`),

  /** 更新角色权限 */
  updatePermissions: (id: string, permissions: string[]) =>
    request.put(`/admin/roles/${id}/permissions`, { permissions }),
};

// 权限管理 API
export const permissions = {
  /** 获取权限列表 */
  list: () => request.get<Permission[]>('/admin/permissions'),

  /** 创建权限 */
  create: (data: Omit<Permission, 'id'>) =>
    request.post<{ id: string }>('/admin/permissions', data),

  /** 更新权限 */
  update: (id: string, data: Partial<Permission>) =>
    request.put(`/admin/permissions/${id}`, data),

  /** 删除权限 */
  delete: (id: string) => request.delete(`/admin/permissions/${id}`),
};

// 系统日志 API
export const logs = {
  /** 获取日志列表 */
  list: (params?: {
    startTime?: string;
    endTime?: string;
    type?: string;
    operator?: string;
  }) => request.get<LogItem[]>('/admin/logs', { params }),

  /** 导出日志 */
  export: (params?: {
    startTime?: string;
    endTime?: string;
    type?: string;
    operator?: string;
  }) => request.get('/admin/logs/export', { 
    params,
    responseType: 'blob',
  }),
}; 