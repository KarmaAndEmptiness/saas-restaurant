<!-- src/views/admin/LogMonitor.vue -->
<template>
  <div class="log-monitor">
    <h2>日志监控</h2>
    <el-table :data="logs" border>
      <el-table-column prop="time" label="时间" width="180" />
      <el-table-column prop="user" label="操作人" />
      <el-table-column prop="action" label="操作内容" />
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { fetchLogs } from '@/api/admin';

const logs = ref([]);

// 加载日志数据
const loadLogs = async () => {
  const res = await fetchLogs();
  logs.value = res.data;
};

loadLogs();
</script>
