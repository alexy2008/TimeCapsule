/**
 * 应用入口文件
 * 创建 React 应用实例，注册路由和全局样式
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

// 导入全局样式（来自 spec 目录的共享设计令牌）
import '@spec/styles/tokens.css'
import '@spec/styles/base.css'
import '@spec/styles/components.css'
import '@spec/styles/layout.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
