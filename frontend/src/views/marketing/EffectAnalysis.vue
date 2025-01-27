<template>
  <div class="effect-container">
    <div ref="compareChart" class="chart-box"></div>
    <el-table :data="detailData" @row-click="handleDrillDown">
      <!-- 表格列配置 -->
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import * as echarts from 'echarts'

const compareChart = ref<HTMLElement>()
const detailData = ref([])

onMounted(() => {
  initCompareChart()
})

const initCompareChart = () => {
  const chart = echarts.init(compareChart.value!)
  chart.setOption({
    xAxis: { data: ['活动前', '活动后'] },
    yAxis: { type: 'value' },
    series: [
      {
        type: 'bar',
        data: [320, 450],
      },
    ],
  })
}

const handleDrillDown = (row: any) => {
  // 跳转明细页面或显示弹窗
}
</script>
