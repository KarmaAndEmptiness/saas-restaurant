import http from '@/utils/request';
export interface CampaignType{
  campaign_content: string;
      campaign_end: string;
      campaign_id: number;
      campaign_name: string;
      campaign_start: string;
      created_at: string;
      created_by: string|null;
      is_deleted: number;
      level_id: number;
      status: string;
      tenant_id: number;
      updated_at: string;
}
//获取营销活动列表
export const getCampaigns=()=>{
  return http.get<CampaignType[]>('/api/marketingcampaign');
}

//创建活动
export const createCampaign = (data:CampaignType) => {
  return http.post('/api/marketingcampaign',{...data,is_deleted:0});
}

//更新活动
export const updateCampaign = (campaignId:number,data:CampaignType) => {
  return http.put('/api/marketingcampaign/'+campaignId,data);
}

//删除活动
export const deleteCampaign = (campaignId:number) => {
  return http.put('/api/marketingcampaign/'+campaignId, {campaign_id:campaignId, is_deleted: 1 });
}
