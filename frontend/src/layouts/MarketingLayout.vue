<template>
  <div class="marketing-container">
    <router-view />
    <AIRecommendDialog :visible="showRecommend" @close="showRecommend = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AIRecommendDialog from '@/components/AIRecommendDialog.vue'

const showRecommend = ref(false)

onMounted(() => {
  // 模拟AI推荐触发
  setTimeout(() => {
    showRecommend.value = true
  }, 3000)
})
</script>

<style scoped>
.marketing-container {
  height: 100vh;
  padding: 20px;
  background: #f5f7fa;
}
</style>
