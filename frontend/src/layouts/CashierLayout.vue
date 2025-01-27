<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const activeTab = ref('member')

const tabs = [
  { name: 'member', label: '会员办理' },
  { name: 'payment', label: '充值消费' }, 
  { name: 'history', label: '交易记录' },
  { name: 'points', label: '积分管理' }
]

function navigate(name: string) {
  activeTab.value = name
  router.push({ name })
}
</script>

<template>
  <div class="cashier-layout">
    <div class="header">
      <h1>前台收银系统</h1>
    </div>
    
    <div class="main">
      <RouterView />
    </div>
    
    <div class="footer">
      <div 
        v-for="tab in tabs"
        :key="tab.name"
        :class="['tab', { active: activeTab === tab.name }]"
        @click="navigate(tab.name)"
      >
        {{ tab.label }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.cashier-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.header {
  padding: 20px;
  background: #409EFF;
  color: white;
}

.main {
  flex: 1;
  overflow: auto;
  padding: 20px;
}

.footer {
  display: flex;
  background: #f5f7fa;
  border-top: 1px solid #e4e7ed;
}

.tab {
  flex: 1;
  text-align: center;
  padding: 16px;
  cursor: pointer;
  color: #606266;
}

.tab.active {
  color: #409EFF;
  font-weight: bold;
  border-bottom: 2px solid #409EFF;
}
</style>
