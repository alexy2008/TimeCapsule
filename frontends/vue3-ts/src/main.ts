/**
 * 应用入口文件
 * 创建 Vue 应用实例，注册路由和全局样式
 */
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// 导入全局样式（来自 spec 目录的共享设计令牌）
import '@spec/styles/tokens.css'    // 设计令牌（颜色、字体、间距等 CSS 变量）
import '@spec/styles/base.css'      // CSS 重置和基础样式
import '@spec/styles/components.css' // 共享组件样式（按钮、卡片、输入框等）
import '@spec/styles/layout.css'    // 布局工具类（flex、grid、间距等）

// 创建 Vue 应用实例
const app = createApp(App)

// 注册路由插件
app.use(router)

// 挂载到 #app 容器
app.mount('#app')
