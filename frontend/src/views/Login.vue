<template>
  <div class="login-container">
    <el-card class="login-box">
      <h2 class="title">智慧餐饮系统</h2>
      <el-form :model="loginForm" :rules="rules" ref="loginFormRef" @keyup.enter="handleLogin">
        <!-- 角色选择 -->
        <el-form-item prop="role">
          <el-select v-model="loginForm.role" placeholder="请选择角色" class="full-width">
            <el-option v-for="role in roleOptions" :key="role.value" :label="role.label" :value="role.value" />
          </el-select>
        </el-form-item>

        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入账号" prefix-icon="User" />
        </el-form-item>

        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" prefix-icon="Lock" show-password />
        </el-form-item>

        <!-- 图形验证码 -->
        <el-form-item prop="captcha">
          <div class="captcha-wrapper">
            <el-input v-model="loginForm.captcha" placeholder="请输入验证码" class="captcha-input" />
            <img :src="captchaImage" class="captcha-image" @click="refreshCaptcha" />
          </div>
        </el-form-item>

        <!-- 登录按钮 -->
        <el-form-item>
          <el-button type="primary" class="full-width" :loading="loading" @click="handleLogin">
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import { loginAPI, getCaptchaAPI } from '@/api/auth';

import { useStore } from 'vuex'
const router = useRouter();
const store = useStore();

// 表单数据
const loginForm = reactive({
  role: '',
  username: '',
  password: '',
  captcha: ''
});

// 角色选项（示例数据）
const roleOptions = [
  { label: '管理员', value: 'admin' },
  { label: '收银员', value: 'cashier' },
  { label: '财务', value: 'finance' },
  { label: '营销', value: 'marketing' }
];

// 表单验证规则
const rules = reactive<FormRules>({
  role: [{ required: true, message: '请选择角色', trigger: 'change' }],
  username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  captcha: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
});

// 验证码处理
const captchaImage = ref('');
const refreshCaptcha = async () => {
  const res = await getCaptchaAPI();
  captchaImage.value = res.data.image;
};

// 登录逻辑
const loginFormRef = ref<FormInstance>();
const loading = ref(false);
const handleLogin = async () => {
  // 表单验证
  await loginFormRef.value?.validate();
  loading.value = true;

  try {
    // 调用登录接口
    const res = await loginAPI({
      ...loginForm,
      password: encryptPassword(loginForm.password) // 密码加密
    });

    // 存储Token和用户信息
    store.commit('SET_TOKEN', res.data.token);
    store.commit('SET_USER_INFO', res.data.user);

    // 跳转到主页
    router.push('/');
    ElMessage.success('登录成功');
  } catch (error) {
    refreshCaptcha(); // 刷新验证码
    ElMessage.error('登录失败，请检查输入');
  } finally {
    loading.value = false;
  }
};

// 密码加密函数
const encryptPassword = (password: string) => {
  // 实际使用CryptoJS加密（此处为示例）
  return btoa(password);
};

// 初始化验证码
refreshCaptcha();
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #f0f2f5;
}

.login-box {
  width: 400px;
  padding: 24px;
}

.title {
  text-align: center;
  margin-bottom: 24px;
  color: #303133;
}

.full-width {
  width: 100%;
}

.captcha-wrapper {
  display: flex;
  gap: 8px;
}

.captcha-input {
  flex: 1;
}

.captcha-image {
  height: 40px;
  cursor: pointer;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}
</style>
