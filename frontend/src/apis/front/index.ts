import http from '@/utils/request'
export interface Order {
  

}


//获取用户列表
export const getOrders = () => {
  return http.get('/api/order');
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
//根据角色ID获取角色
export const getRole = (roleId:number) => {
  return http.get<Role>('/api/role/'+roleId);
}

//获取角色列表
export const getRoles = () => {
  return http.get<Role[]>('/api/role');
}