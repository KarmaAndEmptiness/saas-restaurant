import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './stores/auth'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import 'element-plus/dist/index.css'; // 引入
import '@/assets/common.css'
const app = createApp(App)
app.use(router)
app.use(store)
app.use(ElementPlus)
app.mount('#app')
