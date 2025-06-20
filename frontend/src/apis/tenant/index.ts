import http from '@/utils/request'
export interface TenantType {
  created_at:string,
    email:string,
    is_deleted: number,
    phone: string,
    status: string|null,
    tenant_id: number,
    tenant_name: string,
    tenant_token: string|null,
    updated_at: string

}

//获取租户列表
export const getTenants = () => {
  return http.get<TenantType[]>('/api/tenant');
}

//添加租户
export const createTenant = (data:TenantType) => {
  return http.post('/api/tenant',{...data,is_deleted:0});
}

//更新租户
export const updateTenant = (tenantId:number,data:TenantType) => {
  return http.put('/api/tenant/'+tenantId,{...data,tenant_id:tenantId},true);
}

//删除租户
export const deleteTenant = (tenantId:number) => {
  return http.put('/api/tenant/'+tenantId, {tenant_id:tenantId, is_deleted: 1 });
}
//获取租户token
export const getToken = (tenantId:number) => {
  return http.get('/api/tenant/gettoken/'+tenantId);
}


