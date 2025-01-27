import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/Login.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/admin',
      component: () => import('@/layouts/AdminLayout.vue'),
      meta: { requiresAuth: true, role: 'admin' },
      children: [
        { path: 'employees', component: () => import('@/views/admin/EmployeeList.vue') },
        { path: 'permissions', component: () => import('@/views/admin/PermissionTree.vue') },
        { path: 'alerts', component: () => import('@/views/admin/AlertManagement.vue') },
        { path: 'logs', component: () => import('@/views/admin/LogMonitor.vue') },
        { path: 'settings', component: () => import('@/views/admin/SystemConfig.vue') },
      ],
    },
    // 新增路由配置
    {
      path: '/report',
      component: () => import('@/layouts/ReportLayout.vue'),
      children: [
        {
          path: 'financial',
          name: 'FinancialStats',
          component: () => import('@/views/report/FinancialStats.vue'),
        },
        {
          path: 'settlement',
          name: 'CrossStoreSettlement',
          component: () => import('@/views/report/CrossStoreSettlement.vue'),
        },
        {
          path: 'custom',
          name: 'CustomReport',
          component: () => import('@/views/report/CustomReport.vue'),
        },
      ],
    },
    {
      path: '/marketing',
      component: () => import('@/layouts/MarketingLayout.vue'),
      children: [
        {
          path: 'analysis',
          name: 'MemberAnalysis',
          component: () => import('@/views/marketing/MemberAnalysis.vue'),
        },
        {
          path: 'design',
          name: 'CampaignDesign',
          component: () => import('@/views/marketing/CampaignDesign.vue'),
        },
        {
          path: 'effect',
          name: 'EffectAnalysis',
          component: () => import('@/views/marketing/EffectAnalysis.vue'),
        },
      ],
    },
  ],
})

export default router
