import http from '@/utils/request'
export interface TenantAdminLoginParam {
  username: string,
  password: string
}
export interface TenantLoginParam extends TenantAdminLoginParam
{
tenantToken:string
}
export interface loginResponse
{
 roles: string[]|null;
    tenant_id: number;
    token: string;
    user_id: number;
    username: string;
}
//租户管理员登录
export const tenantAdminLogin = (data:TenantAdminLoginParam) => {
  return http.post('/api/tenant/admin/login', data);
}

//租户登录
export const tenantLogin = (data: TenantLoginParam) => {
  return http.post<loginResponse>('/api/tenant/login', data);
}
