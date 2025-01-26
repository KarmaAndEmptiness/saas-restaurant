<template>
  <div class="main-container">
    <!-- 顶部导航栏 -->
    <el-header class="header">
      <div class="left">
        <span class="system-name">智慧餐饮系统</span>
        <el-button 
          v-for="subsystem in accessibleSubsystems" 
          :key="subsystem.path"
          :type="currentSubsystem === subsystem.path ? 'primary' : 'text'"
          @click="switchSubsystem(subsystem.path)"
        >
          {{ subsystem.name }}
        </el-button>
      </div>
      <div class="right">
        <el-dropdown>
          <span class="user-info">
            <el-icon><User /></el-icon>
            {{ authStore.userInfo?.username }}
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-header>

    <!-- 侧边栏菜单 -->
    <div class="main-content">
      <el-aside width="200px" class="sidebar">
        <el-menu
          :default-active="activeMenu"
          :router="true"
          @select="handleMenuSelect"
        >
          <template v-for="menu in currentMenus" :key="menu.path">
            <el-menu-item :index="menu.path">
              <el-icon><component :is="menu.icon" /></el-icon>
              <span>{{ menu.name }}</span>
            </el-menu-item>
          </template>
        </el-menu>
      </el-aside>

      <!-- 主内容区域 -->
      <div class="content">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { User } from '@element-plus/icons-vue';
import { useAuthStore } from '@/stores/auth';
import type { Subsystem, MenuItem } from '@/types/layout';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

// 根据用户权限获取可访问的子系统（示例数据）
const accessibleSubsystems = computed<Subsystem[]>(() => {
  const role = authStore.userInfo?.role;
  // 实际应从权限配置中获取
  return [
    { name: '后台管理', path: '/admin', roles: ['admin'] },
    { name: '前台交易', path: '/cashier', roles: ['cashier', 'admin'] },
    { name: '报表中心', path: '/finance', roles: ['finance', 'admin'] },
    { name: '会员营销', path: '/marketing', roles: ['marketing', 'admin'] }
  ].filter(sys => sys.roles.includes(role || ''));
});

// 当前激活的子系统
const currentSubsystem = ref(accessibleSubsystems.value[0]?.path || '');

// 当前子系统的菜单（示例数据）
const currentMenus = computed<MenuItem[]>(() => {
  switch (currentSubsystem.value) {
    case '/admin':
      return [
        { name: '员工管理', path: '/admin/employees', icon: 'User' },
        { name: '权限管理', path: '/admin/permissions', icon: 'Lock' }
      ];
    case '/cashier':
      return [
        { name: '会员办理', path: '/cashier/members', icon: 'CreditCard' },
        { name: '收银台', path: '/cashier/checkout', icon: 'ShoppingCart' }
      ];
    // 其他子系统菜单...
    default:
      return [];
  }
});

// 菜单激活状态
const activeMenu = computed(() => route.path);

// 切换子系统
const switchSubsystem = (path: string) => {
  currentSubsystem.value = path;
  router.push(path);
};

// 菜单选择
const handleMenuSelect = (path: string) => {
  router.push(path);
};

// 退出登录
const handleLogout = () => {
  authStore.clearToken();
  router.push('/login');
  ElMessage.success('已退出登录');
};
</script>

<style scoped>
.main-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  border-bottom: 1px solid #e4e7ed;
  padding: 0 24px;
}

.left {
  display: flex;
  align-items: center;
  gap: 24px;
}

.system-name {
  font-size: 18px;
  font-weight: bold;
  color: #303133;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.main-content {
  flex: 1;
  display: flex;
}

.sidebar {
  background: #fff;
  border-right: 1px solid #e4e7ed;
}

.content {
  flex: 1;
  padding: 24px;
  background: #f5f7fa;
  overflow: auto;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
