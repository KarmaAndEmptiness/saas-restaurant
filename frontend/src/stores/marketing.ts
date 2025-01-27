// src/stores/marketing.ts
import { Module } from 'vuex'
import { RootState } from '../types/store'

export interface MarketingState {
  campaigns: Campaign[]
  currentCampaign: Campaign | null
  recommendations: Recommendation[]
  loading: boolean
}

const state: MarketingState = {
  campaigns: [],
  currentCampaign: null,
  recommendations: [],
  loading: false
}

const mutations = {
  SET_CAMPAIGNS(state: MarketingState, payload: Campaign[]): void {
    state.campaigns = payload
  },
  SET_CURRENT_CAMPAIGN(state: MarketingState, payload: Campaign | null): void {
    state.currentCampaign = payload
  },
  SET_RECOMMENDATIONS(state: MarketingState, payload: Recommendation[]): void {
    state.recommendations = payload
  },
  SET_LOADING(state: MarketingState, payload: boolean): void {
    state.loading = payload
  }
}

const actions = {
  async loadCampaigns({ commit }: any): Promise<void> {
    commit('SET_LOADING', true)
    try {
      const response = await fetch('/api/marketing/campaigns')
      const data: Campaign[] = await response.json()
      commit('SET_CAMPAIGNS', data)
    } catch (error) {
      console.error('Failed to load campaigns:', error)
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async fetchRecommendations({ commit }: any): Promise<void> {
    try {
      const response = await fetch('/api/marketing/recommendations')
      const data: Recommendation[] = await response.json()
      commit('SET_RECOMMENDATIONS', data)
    } catch (error) {
      console.error('Failed to fetch recommendations:', error)
    }
  }
}

const marketingModule: Module<MarketingState, RootState> = {
  namespaced: true,
  state,
  mutations,
  actions
}

export default marketingModule
