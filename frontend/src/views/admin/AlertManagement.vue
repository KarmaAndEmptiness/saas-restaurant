<template>
  <div class="alert-management">
    <el-button type="primary" @click="openRuleDialog">新增规则</el-button>
    <el-table :data="alerts" style="margin-top: 20px">
      <el-table-column prop="name" label="规则名称" />
      <el-table-column prop="condition" label="触发条件" />
      <el-table-column prop="notificationType" label="通知方式" />
      <el-table-column label="操作" width="150">
        <template #default="{ row }">
          <el-button type="text" @click="editRule(row)">编辑</el-button>
          <el-button type="text" @click="deleteRule(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 规则配置弹窗 -->
    <el-dialog v-model="ruleDialogVisible" title="预警规则">
      <el-form :model="ruleForm">
        <el-form-item label="规则名称">
          <el-input v-model="ruleForm.name" />
        </el-form-item>
        <el-form-item label="触发条件">
          <el-input-number v-model="ruleForm.threshold" :min="0" />
        </el-form-item>
        <el-form-item label="通知方式">
          <el-select v-model="ruleForm.notificationType">
            <el-option label="短信" value="sms" />
            <el-option label="邮件" value="email" />
          </el-select>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
// 类似员工管理的CRUD逻辑（省略具体实现）
</script>
