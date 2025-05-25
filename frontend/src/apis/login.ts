//@ts-ignore
import http from '@/utils/request'
interface LoginParam {
  username: string,
  password: string
}
//登录
export const login = (data: LoginParam) => {
  return http.post('/api/login', data);
}