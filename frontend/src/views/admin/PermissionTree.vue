<template>
  <div class="permission-management">
    <el-button type="primary" @click="savePermissions">保存权限</el-button>
    <el-tree
      ref="treeRef"
      :data="permissions"
      node-key="id"
      show-checkbox
      :props="treeProps"
      :default-expand-all="true"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { fetchPermissions, updatePermissions } from '@/api/admin';

const treeRef = ref();
const permissions = ref([]);
const treeProps = {
  label: 'name',
  children: 'children'
};

// 加载权限数据
const loadPermissions = async () => {
  const res = await fetchPermissions();
  permissions.value = res.data;
};

// 保存权限配置
const savePermissions = async () => {
  const checkedKeys = treeRef.value.getCheckedKeys();
  await updatePermissions(checkedKeys);
  ElMessage.success('权限更新成功');
};

onMounted(() => {
  loadPermissions();
});
</script>

<style scoped>
.permission-management {
  padding: 20px;
}
</style>
