/**
 * 主题切换 Hook
 * 支持亮色/暗色模式切换，主题偏好持久化到 localStorage
 * 使用 useSyncExternalStore 实现跨组件共享
 */
import { useSyncExternalStore, useCallback } from 'react'

type Theme = 'light' | 'dark'

// 模块级共享状态 - 延迟初始化
let theme: Theme = 'light'
let initialized = false
const listeners = new Set<() => void>()

function getStoredTheme(): Theme {
  try {
    const stored = localStorage.getItem('theme')
    if (stored === 'light' || stored === 'dark') {
      return stored
    }
  } catch {
    // localStorage 不可用时忽略
  }
  return 'light'
}

function applyTheme(t: Theme) {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', t)
  }
  try {
    localStorage.setItem('theme', t)
  } catch {
    // localStorage 不可用时忽略
  }
}

function initTheme() {
  if (initialized) return
  initialized = true
  theme = getStoredTheme()
  applyTheme(theme)
}

function subscribe(callback: () => void) {
  // 首次订阅时初始化
  initTheme()
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
  const currentTheme = useSyncExternalStore(subscribe, getSnapshot, () => 'light')

  const toggle = useCallback(() => {
    setTheme(currentTheme === 'light' ? 'dark' : 'light')
  }, [currentTheme])

  return { theme: currentTheme, toggle }
}
