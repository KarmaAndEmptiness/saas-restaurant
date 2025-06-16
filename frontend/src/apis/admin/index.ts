import http from '@/utils/request'
export interface User {
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
export interface UserRole {
    user_role_id?: number;  // 添加这个字段
    user_id: number;
    role_id: number;
    is_deleted?: number;
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
export const createUser = (data:User) => {
  return http.post('/api/user',{...data,is_deleted:0});
}

//更新用户
export const updateUser = (userId:number,data:User) => {
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

//批量添加用户角色关联
export const createUserRoles = (userId: number, roleIds: number[]) => {
  return http.post('/api/userrole/batch', {
    user_id: userId,
    role_ids: roleIds
  });
}

//删除用户所有角色关联
export const deleteUserRoles = (userId: number) => {
  return http.delete('/api/userrole/user/'+userId);
}

//添加用户角色关联
export const createUserRole = (data:UserRole) => {
  return http.post('/api/userrole',{...data,is_deleted:0});
}
//更新用户角色关联
export const updateUserRole = (userRoleId:number,data:UserRole) => {
  return http.put('/api/userrole/'+userRoleId, {user_role_id:userRoleId, ...data});
}

//删除用户角色关联
export const deleteUserRole = (userRoleId:number|undefined) => {
  return http.put('/api/userrole/'+userRoleId, {user_role_id:userRoleId, is_deleted: 1 });
}