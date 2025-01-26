<!-- src/views/admin/SystemConfig.vue -->
<template>
  <div class="system-config">
    <h2>系统配置</h2>
    <el-form :model="config" label-width="120px">
      <el-form-item label="系统名称">
        <el-input v-model="config.name" />
      </el-form-item>
      <el-form-item label="通知邮箱">
        <el-input v-model="config.email" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { fetchConfig, saveConfig } from '@/api/admin';

const config = reactive({
  name: '',
  email: ''
});

// 加载配置
const loadConfig = async () => {
  const res = await fetchConfig();
  Object.assign(config, res.data);
};

loadConfig();
</script>
