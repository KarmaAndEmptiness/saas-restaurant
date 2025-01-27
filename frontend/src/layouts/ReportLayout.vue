<template>
  <div class="report-container">
    <!-- 时间筛选器 -->
    <div class="filter-bar">
      <el-date-picker
        v-model="timeRange"
        type="daterange"
        range-separator="-"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="handleTimeChange"
      />
    </div>

    <!-- 数据卡片 -->
    <el-row :gutter="20" class="data-cards">
      <el-col :span="6" v-for="(item, index) in summaryData" :key="index">
        <el-card shadow="hover">
          <div class="card-title">{{ item.title }}</div>
          <div class="card-value">{{ item.value }}</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 内容区域 -->
    <router-view />

    <!-- 固定导出按钮 -->
    <div class="export-actions">
      <el-dropdown trigger="click">
        <el-button type="primary" circle icon="Download" />
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="exportPDF">PDF</el-dropdown-item>
            <el-dropdown-item @click="exportExcel">Excel</el-dropdown-item>
            <el-dropdown-item @click="exportCSV">CSV</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<style scoped>
.report-container {
  position: relative;
  padding: 20px;
}

.export-actions {
  position: fixed;
  right: 40px;
  bottom: 40px;
  z-index: 1000;
}

.data-cards {
  margin-bottom: 20px;
}

.card-title {
  color: #666;
  font-size: 14px;
}

.card-value {
  font-size: 24px;
  font-weight: bold;
  margin-top: 10px;
}
</style>
