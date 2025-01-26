<!-- src/layouts/AdminLayout.vue -->
<template>
  <div class="admin-layout">
    <!-- 顶部导航栏 -->
    <header class="header">
      <span class="title">后台管理系统</span>
      <div class="user-info">
        <el-button type="text" @click="handleLogout">退出登录</el-button>
      </div>
    </header>

    <!-- 侧边栏菜单 & 主内容 -->
      <!-- { path: 'employees', component: () => import('@/views/admin/EmployeeList.vue') },
        { path: 'permissions', component: () => import('@/views/admin/PermissionTree.vue') },
        { path: 'alerts', component: () => import('@/views/admin/AlertManagement.vue') },
        { path: 'logs', component: () => import('@/views/admin/LogMonitor.vue') },
        { path: 'settings', component: () => import('@/views/admin/SystemConfig.vue') } -->
    <div class="main-container">
      <aside class="sidebar">
        <el-menu
          router
          :default-active="$route.path"
          class="menu"
        >
          <el-menu-item index="/admin/employees">
            <el-icon><User /></el-icon>
            <span>员工管理</span>
          </el-menu-item>
          <el-menu-item index="/admin/permissions">
            <el-icon><Lock /></el-icon>
            <span>权限管理</span>
          </el-menu-item>
          <el-menu-item index="/admin/alerts">
            <el-icon><Bell /></el-icon>
            <span>预警管理</span>
          </el-menu-item>
          <el-menu-item index="/admin/logs">
            <el-icon><Document /></el-icon>
            <span>日志管理</span>
          </el-menu-item>
          <el-menu-item index="/admin/settings">
            <el-icon><Setting /></el-icon>
            <span>系统设置</span>
          </el-menu-item>
        </el-menu>
      </aside>

      <!-- 主内容区域 -->
      <main class="content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { User, Lock } from '@element-plus/icons-vue';
import { useStore } from 'vuex';

const router = useRouter();
const store = useStore();

// 退出登录
const handleLogout = () => {
  store.commit('CLEAR_TOKEN');
  ElMessage.success('已退出登录');
  router.push('/');
};
</script>

<style scoped>
.admin-layout {
  display: flex;
  flex-direction: column;
}

.header {
  height: 60px;
  background: #fff;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e4e7ed;
}

.title {
  font-size: 18px;
  font-weight: bold;
}

.main-container {
  flex: 1;
  display: flex;
}

.sidebar {
  width: 200px;
  background: #fff;
  border-right: 1px solid #e4e7ed;
}

.content {
  flex: 1;
  padding: 24px;
  background: #f5f7fa;
  overflow: auto;
}

.menu {
  border-right: none;
}

</style>
