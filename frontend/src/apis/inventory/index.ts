import http from '@/utils/request'
export interface InventoryType{
      address:string | null,
    avatar_url:string | null,
    birthday: string|null,
    roles?: string[] | null,
    city: string|null,
    created_at: string |null,
    email: string | null,
    gender: string|null,
    is_deleted: number,
    last_login: string | null,
    password: string | null,
    phone: string | null,
    province: string|null,
    status: string|null,
    tenant_id: number,
    updated_at:string,
    user_id: number,
    username: string

}
export interface UserRole
{
    user_id: number,
    role_id: number,
}

export interface Role
{
    role_id: number,
    role_name:string,
    description: string|null
}
//获取用户列表
export const getUsers = () => {
  return http.get('/api/user');
}

//添加用户
export const createUser = (data:InventoryType) => {
  return http.post('/api/user',{...data,is_deleted:0});
}

//更新用户
export const updateUser = (userId:number,data:InventoryType) => {
  return http.put('/api/user/'+userId,data);
}

//删除用户
export const deleteUser = (userId:number) => {
  return http.put('/api/user/'+userId, {user_id:userId, is_deleted: 1 });
}

//获取用户角色关联
export const getUserRole = (userId:number) => {
  return http.get<UserRole[]>('/api/userrole/user/'+userId);
}
//根据角色ID获取角色
export const getRole = (roleId:number) => {
  return http.get<Role>('/api/role/'+roleId);
}

//获取角色列表
export const getRoles = () => {
  return http.get<Role[]>('/api/role');
}