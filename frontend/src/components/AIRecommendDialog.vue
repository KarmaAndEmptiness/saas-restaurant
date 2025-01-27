<template>
  <el-dialog v-model="visible" title="营销建议">
    <div v-loading="loading">
      <div v-for="(item, index) in recommendations" :key="index" class="recommend-item">
        <h4>{{ item.title }}</h4>
        <p>{{ item.description }}</p>
        <el-button size="small" @click="applyRecommend(item)">应用建议</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { getAIRecommendations } from '@/api/marketing'

const props = defineProps(['visible'])
const emit = defineEmits(['close'])

const recommendations = ref([])
const loading = ref(false)

const applyRecommend = (item: any) => {
  // 应用推荐策略
}

watch(() => props.visible, async (val) => {
  if (val) {
    loading.value = true
    try {
      const { data } = await getAIRecommendations()
      recommendations.value = data
    } finally {
      loading.value = false
    }
  }
})
</script>
