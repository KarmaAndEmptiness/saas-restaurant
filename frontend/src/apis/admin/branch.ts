import http from '@/utils/request'
export interface BranchType {
   address: string,
      branch_id:number,
      branch_name: string,
      capacity: number,
      created_at: string,
      is_deleted: number,
      manager_id:number,
      opening_hours: string,
      phone: string,
      status: string,
      tenant_id: number,
      updated_at: string,
      manager:string, 

}



//获取分店列表
export const getBranches = () => {
  return http.get('/api/branch');
}

//添加分店
export const createBranch = (data:BranchType) => {
  return http.post('/api/branch',{...data,is_deleted:0});
}

//更新分店
export const updateBranch = (branchId:number,data:BranchType) => {
  return http.put('/api/branch/'+branchId,{...data,branch_id:branchId, is_deleted:0});
}

//删除分店
export const deleteBranch = (branchId:number) => {
  return http.put('/api/branch/'+branchId, {branch_id:branchId, is_deleted:1 });
}

