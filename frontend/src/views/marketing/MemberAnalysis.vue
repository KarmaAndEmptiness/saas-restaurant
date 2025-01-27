<template>
  <div class="analysis-container">
    <el-row :gutter="20">
      <el-col :span="12">
        <div ref="pieChart" class="chart-box"></div>
      </el-col>
      <el-col :span="12">
        <div ref="heatmapChart" class="chart-box"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import * as echarts from 'echarts'

const pieChart = ref<HTMLElement>()
const heatmapChart = ref<HTMLElement>()

onMounted(() => {
  initPieChart()
  initHeatmap()
})

const initPieChart = () => {
  const chart = echarts.init(pieChart.value!)
  chart.setOption({
    tooltip: { trigger: 'item' },
    series: [{
      type: 'pie',
      radius: '60%',
      data: [
        { value: 35, name: '餐饮消费' },
        { value: 25, name: '休闲娱乐' },
        { value: 20, name: '会员服务' }
      ]
    }]
  })
}

const initHeatmap = () => {
  const chart = echarts.init(heatmapChart.value!)
  chart.setOption({
    tooltip: { position: 'top' },
    grid: { height: '80%', top: '10%' },
    xAxis: { type: 'category', data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
    yAxis: { type: 'category', data: ['0-6', '6-12', '12-18', '18-24'] },
    visualMap: { min: 0, max: 100, calculable: true },
    series: [{
      type: 'heatmap',
      data: generateHeatmapData(),
      emphasis: { itemStyle: { shadowBlur: 10 } }
    }]
  })
}

const generateHeatmapData = () => {
  // 生成模拟热力图数据
  return [...]
}
</script>

<style>
.chart-box {
  height: 500px;
  background: #fff;
  padding: 15px;
  border-radius: 8px;
}
</style>
