<template>
  <div class="employee-management">
    <!-- 搜索和新增按钮 -->
    <div class="header">
      <el-input v-model="searchKeyword" placeholder="搜索员工" style="width: 300px" clearable @clear="loadEmployees">
        <template #append>
          <el-button icon="Search" @click="loadEmployees" />
        </template>
      </el-input>
      <el-button type="primary" @click="openEditDialog(null)">新增员工</el-button>
    </div>

    <!-- 员工表格 -->
    <el-table :data="employees" border stripe v-loading="loading">
      <el-table-column prop="name" label="姓名" width="120" />
      <el-table-column prop="role" label="角色" width="150" />
      <el-table-column prop="phone" label="联系电话" />
      <el-table-column prop="createTime" label="创建时间" width="180" />
      <el-table-column label="操作" width="200">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="openEditDialog(row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :total="total"
      :page-sizes="[10, 20, 50]"
      layout="total, sizes, prev, pager, next"
      @size-change="loadEmployees"
      @current-change="loadEmployees"
    />

    <!-- 新增/编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-form :model="formData" :rules="formRules" ref="formRef">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="formData.name" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="formData.role">
            <el-option v-for="role in roleOptions" :key="role.value" :label="role.label" :value="role.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="formData.phone" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import { fetchEmployees, deleteEmployee, saveEmployee } from '@/api/admin';

// 表格数据
const employees = ref([]);
const loading = ref(false);
const searchKeyword = ref('');
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

// 表单数据
const formRef = ref<FormInstance>();
const dialogVisible = ref(false);
const dialogTitle = ref('新增员工');
const formData = reactive({
  id: '',
  name: '',
  role: '',
  phone: ''
});

// 角色选项
const roleOptions = [
  { label: '管理员', value: 'admin' },
  { label: '收银员', value: 'cashier' },
  { label: '财务', value: 'finance' }
];

// 表单验证规则
const formRules: FormRules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式错误', trigger: 'blur' }
  ]
};

// 加载员工数据
const loadEmployees = async () => {
  loading.value = true;
  try {
    const res = await fetchEmployees({
      page: currentPage.value,
      pageSize: pageSize.value,
      keyword: searchKeyword.value
    });
    employees.value = res.data.list;
    total.value = res.data.total;
  } finally {
    loading.value = false;
  }
};

// 打开编辑弹窗
const openEditDialog = (row: any) => {
  if (row) {
    Object.assign(formData, row);
    dialogTitle.value = '编辑员工';
  } else {
    formData.id = '';
    formData.name = '';
    formData.role = '';
    formData.phone = '';
    dialogTitle.value = '新增员工';
  }
  dialogVisible.value = true;
};

// 提交表单
const submitForm = async () => {
  await formRef.value?.validate();
  await saveEmployee(formData);
  ElMessage.success('操作成功');
  dialogVisible.value = false;
  loadEmployees();
};

// 删除员工
const handleDelete = async (id: string) => {
  await ElMessageBox.confirm('确定删除该员工？', '提示', { type: 'warning' });
  await deleteEmployee(id);
  ElMessage.success('删除成功');
  loadEmployees();
};

onMounted(() => {
  loadEmployees();
});
</script>

<style scoped>
.employee-management {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
</style>
