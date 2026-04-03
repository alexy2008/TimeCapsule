/**
 * 应用入口文件
 * 创建 Vue 应用实例，注册路由和全局样式
 */
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// 导入全局样式（统一收敛到赛博设计系统）
import '@spec/styles/cyber.css'

// 创建 Vue 应用实例
const app = createApp(App)

// 注册路由插件
app.use(router)

// 挂载到 #app 容器
app.mount('#app')
