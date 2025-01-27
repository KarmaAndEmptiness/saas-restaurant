<template>
  <div>
    <el-radio-group v-model="timeType">
      <el-radio-button label="day">日</el-radio-button>
      <el-radio-button label="week">周</el-radio-button>
      <el-radio-button label="month">月</el-radio-button>
    </el-radio-group>

    <div ref="chart" style="height: 400px"></div>

    <el-table :data="tableData" border>
      <el-table-column
        v-for="col in columns"
        :key="col.prop"
        :prop="col.prop"
        :label="col.label"
        sortable
        :filters="col.filters"
        :filter-method="filterHandler"
      >
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import * as echarts from 'echarts'

const chart = ref<HTMLElement>()
const timeType = ref('day')

// 初始化图表
onMounted(() => {
  const myChart = echarts.init(chart.value!)
  myChart.setOption({
    xAxis: { type: 'category' },
    yAxis: { type: 'value' },
    series: [{ type: 'line' }]
  })
})

// 表格配置
const columns = [
  { prop: 'date', label: '日期' },
  { prop: 'amount', label: '金额', sortable: true },
  { prop: 'type', label: '类型', filters: [...] }
]

// 过滤处理函数
const filterHandler = (value: string, row: any, column: any) => {
  // 实现过滤逻辑
}
</script>
