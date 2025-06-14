import http from '@/utils/request'
export interface InventoryType{
      inventory_id: number;
      is_deleted: number;
      item_category: string;
      item_cost: string;
      item_name: string;
      max_stock: number;
      min_stock: number;
      quantity: number;
      status: "正常" | "偏低" | "紧缺" | "过剩"|string;
      supplier: string;
      tenant_id: number;
      updated_at: string;
}

export interface InventoryRecordType{
  created_at: string;
      item_id: number;
      operator_id: number;
      quantity: string;
      record_id: number;
      record_type: "入库" | "出库";
      remark: string;
      tenant_id: number;
      operator?:string;
}
//获取库存列表
export const getInventories = () => {
  return http.get('/api/inventory');
}

//添加库存
export const createInventory = (data:InventoryType) => {
  return http.post('/api/inventory',{...data,is_deleted:0});
}

//更新库存
export const updateInventory = (iventoryId:number,data:InventoryType) => {
  return http.put('/api/inventory/'+iventoryId,data);
}

//删除用户
export const deleteInventory = (inventoryId:number) => {
  return http.put('/api/inventory/'+inventoryId, {inventory_id:inventoryId, is_deleted: 1 });
}

//根据ID获取出入库记录
export const getInventoryRecordsByInventoryId = (inventoryId:number) => {
  return http.get<InventoryRecordType[]>('/api/inventoryrecord/inventory/'+inventoryId);
}

//创建出入库记录
export const  createInventoryRecord= (data:InventoryRecordType) => {
  return http.post('/api/inventoryrecord',data);
}

