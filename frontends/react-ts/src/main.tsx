/**
 * 应用入口文件
 * 创建 React 应用实例，注册路由和全局样式
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

// 导入全局样式（Cyber-Glass 最新 UI 原型原型）
import '@spec/styles/cyber.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
