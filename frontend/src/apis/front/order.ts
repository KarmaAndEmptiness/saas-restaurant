import http from '@/utils/request'
export interface OrderType {
   created_at?: string;
      delivery_address: string|null;
      discount_ammout: string;
      is_deleted: number;
      order_detail: string|null;
      order_id?: number;
      order_status: "待确认" | "已确认" | "制作中" | "待派送" | "已完成";
      payment_method: "现金" | "微信" | "支付宝" | "银行卡";
      payment_status: string;
      remark: string|null;
      tenant_id: number;
      total_amount: string;
      updated_at?: string;
      user_id: number;
}

//获取订单列表
export const getOrders=()=>{
  return http.get('/api/ordertable');
}

//创建订单
export const createOrder = (data:OrderType) => {
  return http.post('/api/ordertable',{...data,is_deleted:0});
}

//更新订单
export const updateOrder=(orderId:number | null,data:OrderType)=>{
  return http.put('/api/ordertable/'+orderId,{...data,order_id:orderId});
}

//删除订单
export const deleteOrder = (orderId:number) => {
  return http.put('/api/member/'+orderId, {order_id:orderId, is_deleted: 1 });
}