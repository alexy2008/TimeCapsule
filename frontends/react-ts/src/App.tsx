import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AppHeader from '@/components/AppHeader'
import AppFooter from '@/components/AppFooter'
import { lazy, Suspense } from 'react'

const HomeView = lazy(() => import('@/views/HomeView'))
const CreateView = lazy(() => import('@/views/CreateView'))
const OpenView = lazy(() => import('@/views/OpenView'))
const AboutView = lazy(() => import('@/views/AboutView'))
const AdminView = lazy(() => import('@/views/AdminView'))

export default function App() {
  return (
    <BrowserRouter>
      <AppHeader />
      <main style={{ minHeight: 'calc(100vh - var(--header-height) - 4rem)' }}>
        <Suspense>
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
    </BrowserRouter>
  )
}
