//员工管理API
export const fetchEmployees = (params: any) => { return { data: { list: [] } } };// axios.get('/admin/employees', { params });
export const saveEmployee = (data: any) => { }// axios.post('/admin/employees', data);
export const deleteEmployee = (id: number) => { }// axios.delete(`/admin/employees/${id}`);
export const updateEmployee = (id: number, data: any) => { }// axios.put(`/admin/employees/${id}`, data);

//权限管理API
export const fetchPermissions = () => { return { data: '' } };
export const updatePermissions = (data: any) => { };

// import { fetchLogs } from '@/api/admin';
export const fetchLogs = (params: any) => { return { data: '' } };

// import { fetchConfig, saveConfig } from '@/api/admin';
export const fetchConfig = () => { return { data: { name: 'zhangsan', email: 'zhangsan@qq.com' } } };
export const saveConfig = (data: any) => { };