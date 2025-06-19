import http from '@/utils/request'
export interface RoleType {
 created_at: string;
    description:string;
    is_deleted: number;
    role_id: number;
    role_name: string;
    status: string;
    tenant_id: number;
    updated_at: string;  

}

export interface RolePermissionType {
      created_at: string;
      is_deleted: number;
      permission_id: number;
      role_id: number;
      role_permission_id:number;
      tenant_id: number;
      updated_at: string;
}
export interface PermissionType{
 created_at: string;
    is_deleted: number;
    menu_path: string;
    permission_id: number;
    permission_name: string;
    tenant_id: number;
    updated_at: string;
}

//获取角色列表
export const getRoles = () => {
  return http.get<RoleType[]>('/api/role');
}

//添加角色
export const createRole = (data:RoleType) => {
  return http.post('/api/role',{...data,is_deleted:0});
}

//更新角色
export const updateRole = (roleId:number,data:RoleType) => {
  return http.put('/api/role/'+roleId,{...data,role_id:roleId});
}

//删除角色
export const deleteRole = (roleId:number) => {
  return http.put('/api/role/'+roleId, {role_id:roleId, is_deleted: 1 });
}

//根据角色ID获取角色
export const getRole = (roleId:number) => {
  return http.get<RoleType>('/api/role/'+roleId);
}
//根据角色ID获取角色权限关联
export const getRolePermissionsByRoleId = (roleId:number) => {
  return http.get<RolePermissionType[]>(`/api/rolepermission/role/${roleId}`);
}

//根据权限ID获取权限
export const getPermission=(permissionId:number) => {
  return http.get<PermissionType>(`/api/permission/${permissionId}`);
}
//获取所有权限  
export const getPermissions = () => {
  return http.get<PermissionType[]>('/api/permission');
}
//添加角色权限关联
export const createRolePermission = (data:RolePermissionType) => {
  return http.post('/api/rolepermission', {...data, is_deleted: 0});
}

//更新角色权限关联
export const updateRolePermission = (rolePermissionId:number, data:RolePermissionType) => {
  return http.put(`/api/rolepermission/${rolePermissionId}`, {...data, role_permission_id: rolePermissionId});
}
//删除角色权限关联
export const deleteRolePermission = (rolePermissionId:number) => {
  return http.put(`/api/rolepermission/${rolePermissionId}`, { role_permission_id: rolePermissionId, is_deleted: 1 });
}
//获取所有角色权限关联
export const getRolePermissions = () => {
  return http.get<RolePermissionType[]>('/api/rolepermission');
}
