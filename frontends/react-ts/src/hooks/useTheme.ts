/**
 * 主题切换 Hook
 * 支持亮色/暗色模式切换，主题偏好持久化到 localStorage
 * 使用 useSyncExternalStore 实现跨组件共享
 */
import { useSyncExternalStore, useCallback } from 'react'

type Theme = 'light' | 'dark'

// 模块级共享状态
let theme: Theme = (typeof localStorage !== 'undefined' && localStorage.getItem('theme') as Theme) || 'light'
const listeners = new Set<() => void>()

function applyTheme(t: Theme) {
  document.documentElement.setAttribute('data-theme', t)
  localStorage.setItem('theme', t)
}

// 初始化
if (typeof document !== 'undefined') {
  applyTheme(theme)
}

function subscribe(callback: () => void) {
  listeners.add(callback)
  return () => { listeners.delete(callback) }
}

function getSnapshot(): Theme {
  return theme
}

function setTheme(t: Theme) {
  theme = t
  applyTheme(t)
  listeners.forEach(l => l())
}

export function useTheme() {
  const currentTheme = useSyncExternalStore(subscribe, getSnapshot)

  const toggle = useCallback(() => {
    setTheme(currentTheme === 'light' ? 'dark' : 'light')
  }, [currentTheme])

  return { theme: currentTheme, toggle }
}
