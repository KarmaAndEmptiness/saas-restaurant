import http from '@/utils/request'
export interface TenantAdminLoginParam {
  username: string,
  password: string
}
export interface TenantLoginParam extends TenantAdminLoginParam
{
tenantToken:string
}
export interface tenantAdminLoginResponse
{
    token: string;
    username: string;
    roles:string[];
}
export interface tenantLoginResponse extends tenantAdminLoginResponse
{
    user_id: string;
    tenant_id: string;
    roles_id: number[];
}
//租户管理员登录
export const tenantAdminLogin = (data:TenantAdminLoginParam) => {
  return http.post<tenantAdminLoginResponse>('/api/tenant/admin/login', data,true);
}

//租户登录
export const tenantLogin = (data: TenantLoginParam) => {
  return http.post<tenantLoginResponse>('/api/tenant/login', data,true);
}
