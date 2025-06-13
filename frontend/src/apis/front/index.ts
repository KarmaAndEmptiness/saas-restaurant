import http from '@/utils/request'
export interface Order {
order_id: number  

}


//获取用户列表
export const getOrders = () => {
  return http.get('/api/order');
}

//添加用户
export const createUser = (data:Order) => {
  return http.post('/api/user',{...data,is_deleted:0});
}

//更新用户
export const updateUser = (userId:number,data:Order) => {
  return http.put('/api/user/'+userId,data);
}

//删除用户
export const deleteUser = (userId:number) => {
  return http.put('/api/user/'+userId, {user_id:userId, is_deleted: 1 });
}

