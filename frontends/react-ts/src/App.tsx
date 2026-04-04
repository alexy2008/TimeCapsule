import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AppHeader from '@/components/AppHeader'
import AppFooter from '@/components/AppFooter'
import { lazy, Suspense } from 'react'
import styles from './App.module.css'

// React 版本通过路由级懒加载展示“组件只有在访问时才下载”的常见工程实践。
const HomeView = lazy(() => import('@/views/HomeView'))
const CreateView = lazy(() => import('@/views/CreateView'))
const OpenView = lazy(() => import('@/views/OpenView'))
const AboutView = lazy(() => import('@/views/AboutView'))
const AdminView = lazy(() => import('@/views/AdminView'))

export default function App() {
  return (
    <BrowserRouter>
      {/* 背景特效放在根组件，保证所有页面共享同一套视觉基底。 */}
      <div className="ambient-glow"></div>
      <div className="background-grid"></div>

      <div className={styles.appContainer}>
        <AppHeader />
        <main className="app-main">
          {/* Suspense 负责承接路由懒加载期间的过渡态。 */}
          <Suspense fallback={<div className="cyber-glass center-card text-center">页面加载中...</div>}>
            <Routes>
              <Route path="/" element={<HomeView />} />
              <Route path="/create" element={<CreateView />} />
              <Route path="/open/:code?" element={<OpenView />} />
              <Route path="/about" element={<AboutView />} />
              <Route path="/admin" element={<AdminView />} />
            </Routes>
          </Suspense>
        </main>
        <AppFooter />
      </div>
    </BrowserRouter>
  )
}
