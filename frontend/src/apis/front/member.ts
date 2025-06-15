import http from '@/utils/request'
export interface MemberType {
    created_at: string;
      is_deleted :number;
      level_id :number;
      member_id: number;
      password :string;
      phone :string;
      points :number;
      status :string;
      tenant_id :number;
      total_points :number;
      total_spent: string;
      updated_at: string;
      username:string;
      level?:string;
}
export interface MemberLevelType{

benefits:string| null,
    discount_rate: string,
    icon_url: string|null,
    level_id: number,
    level_name: "普通" | "白银" | "黄金" | "钻石",
    required_points: number,
    required_spent: string,
    tenant_id: number
                    
}
export interface ConsumptionRecordType
{
amount: string,
      created_at: string,
      member_id: number,
      order_items: string,
      points: string,
      record_id: number,
      tenant_id: number
}
//获取会员列表
export const getMembers=()=>{
  return http.get('/api/member');
}

//创建会员
export const createMember = (data:MemberType) => {
  return http.post('/api/member',{...data,is_deleted:0});
}

//更新会员
export const updateMember=(id:number | null,data:MemberType)=>{
  return http.put('/api/member/'+id,{...data,member_id:id});
}

//删除会员
export const deleteMember = (memberId:number) => {
  return http.put('/api/member/'+memberId, {member_id:memberId, is_deleted: 1 });
}

//获取会员等级信息
export const getMemberLevel=(levelId:number)=>{
  return http.get<MemberLevelType>('/api/memberlevel/'+levelId);
}
//获取会员等级列表
export const getMemberLevels=()=>{
  return http.get<MemberLevelType[]>('/api/memberlevel');
}
//获取会员消费记录
export const getConsumptionRecords=(memberId:number)=>{
  return http.get<ConsumptionRecordType[]>('/api/consumptionrecord/member/'+memberId);
}