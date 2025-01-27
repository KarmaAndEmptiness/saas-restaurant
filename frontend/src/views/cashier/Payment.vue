<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const balance = ref(0)
const amount = ref(0)
const paymentMethod = ref('cash')

const paymentMethods = [
  { value: 'cash', label: '现金', icon: 'money' },
  { value: 'alipay', label: '支付宝', icon: 'alipay' },
  { value: 'wechat', label: '微信支付', icon: 'wechat' }
]

async function getBalance() {
  // TODO: Fetch balance from API
  balance.value = 1000
}

function onPayment() {
  if (amount.value <= 0) {
    ElMessage.error('请输入正确的金额')
    return
  }
  
  // TODO: Process payment
  balance.value += amount.value
  ElMessage.success(`支付成功！当前余额：${balance.value}元`)
  amount.value = 0
}
</script>

<template>
  <div class="payment">
    <h2>充值消费</h2>
    
    <div class="balance">
      <span>当前余额：</span>
      <span class="amount">{{ balance }}</span>元
    </div>
    
    <div class="payment-form">
      <el-input
        v-model.number="amount"
        placeholder="请输入金额"
        type="number"
        min="0"
      >
        <template #append>元</template>
      </el-input>
      
      <div class="payment-methods">
        <el-radio-group v-model="paymentMethod">
          <el-radio
            v-for="method in paymentMethods"
            :key="method.value"
            :label="method.value"
          >
            <el-icon>
              <component :is="method.icon" />
            </el-icon>
            {{ method.label }}
          </el-radio>
        </el-radio-group>
      </div>
      
      <el-button 
        type="primary" 
        @click="onPayment"
        class="payment-button"
      >
        确认支付
      </el-button>
    </div>
  </div>
</template>

<style scoped>
.payment {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h2 {
  margin-bottom: 30px;
  text-align: center;
}

.balance {
  margin: 20px 0;
  font-size: 18px;
  text-align: center;
}

.amount {
  font-size: 24px;
  font-weight: bold;
  color: #409EFF;
}

.payment-form {
  margin-top: 30px;
}

.payment-methods {
  margin: 20px 0;
}

.payment-button {
  width: 100%;
  margin-top: 20px;
  height: 50px;
  font-size: 18px;
}
</style>
