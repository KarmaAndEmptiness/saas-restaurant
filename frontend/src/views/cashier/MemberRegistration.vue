<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

interface Member {
  name: string
  phone: string
  idCard: string
  gender: string
  birthday: string
}

const member = ref<Member>({
  name: '',
  phone: '',
  idCard: '',
  gender: '',
  birthday: ''
})

const rules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
  ],
  idCard: [
    { required: true, message: '请输入身份证号', trigger: 'blur' },
    { pattern: /^\d{17}[\dXx]$/, message: '身份证号格式不正确', trigger: 'blur' }
  ]
}

async function scanIDCard() {
  try {
    // TODO: Implement ID card scanning integration
    ElMessage.info('正在调用身份证扫描...')
  } catch (error) {
    ElMessage.error('身份证扫描失败')
  }
}

function onSubmit() {
  ElMessage.success('会员注册成功')
  // TODO: Submit member data to API
}
</script>

<template>
  <div class="member-registration">
    <h2>会员办理</h2>
    <el-form 
      :model="member" 
      :rules="rules"
      label-width="120px"
    >
      <el-form-item label="姓名" prop="name">
        <el-input v-model="member.name" />
      </el-form-item>
      
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="member.phone" />
      </el-form-item>
      
      <el-form-item label="身份证号" prop="idCard">
        <el-input v-model="member.idCard" />
        <el-button 
          type="primary" 
          @click="scanIDCard"
          style="margin-left: 10px;"
        >
          扫描身份证
        </el-button>
      </el-form-item>
      
      <el-form-item label="性别">
        <el-radio-group v-model="member.gender">
          <el-radio label="male">男</el-radio>
          <el-radio label="female">女</el-radio>
        </el-radio-group>
      </el-form-item>
      
      <el-form-item label="生日">
        <el-date-picker
          v-model="member.birthday"
          type="date"
          placeholder="选择日期"
        />
      </el-form-item>
      
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped>
.member-registration {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h2 {
  margin-bottom: 30px;
  text-align: center;
}
</style>
