import http from '@/utils/request'
export interface Role {
 created_at: string;
    description:string;
    is_deleted: number;
    role_id: number;
    role_name: string;
    status: string;
    tenant_id: number;
    updated_at: string;  

}

//获取角色列表
export const getRoles = () => {
  return http.get('/api/role');
}

//添加角色
export const createRole = (data:Role) => {
  return http.post('/api/role',{...data,is_deleted:0});
}

//更新角色
export const updateRole = (roleId:number,data:Role) => {
  return http.put('/api/role/'+roleId,{...data,role_id:roleId});
}

//删除角色
export const deleteRole = (roleId:number) => {
  return http.put('/api/role/'+roleId, {role_id:roleId, is_deleted: 1 });
}


