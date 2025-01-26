import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/Login.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView,
    }, {
      path: '/admin',
      component: () => import('@/layouts/AdminLayout.vue'),
      meta: { requiresAuth: true, role: 'admin' },
      children: [
        { path: 'employees', component: () => import('@/views/admin/EmployeeList.vue') },
        { path: 'permissions', component: () => import('@/views/admin/PermissionTree.vue') },
        { path: 'alerts', component: () => import('@/views/admin/AlertManagement.vue') },
        { path: 'logs', component: () => import('@/views/admin/LogMonitor.vue') },
        { path: 'settings', component: () => import('@/views/admin/SystemConfig.vue') }
      ]
    }
  ],
})

export default router
