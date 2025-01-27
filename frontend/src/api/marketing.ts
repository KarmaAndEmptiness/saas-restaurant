// api/marketing.ts
import request from '@/utils/request'

export const getConsumptionAnalysis = () => request.get('/marketing/analysis')
export const createCampaign = (data: any) => request.post('/marketing/campaigns', data)
export const getEffectAnalysis = (params: any) => request.get('/marketing/effect', { params })
