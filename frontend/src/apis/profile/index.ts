import http from '@/utils/request'
export interface UserInfo {
  address: string|null
  avatar_url: string|null
  birthday: string|null
  city: string|null
  created_at: string
  email: string
  gender: string|null
  is_deleted: number
  last_login: string|null
  password: string
  phone: string
  province: string|null
  status: string|null
  tenant_id: number
  updated_at:string
  user_id: number
  username: string
}
export const getUserInfo=(id:string|number | null)=>{
  return http.get<UserInfo>('/api/user/'+id);
}
export const updateUserInfo=(id:string | null,data:UserInfo)=>{
  return http.put('/api/user/'+id,data);
}

export const getUsers = () => {
  return http.get<UserInfo[]>('/api/user');
}