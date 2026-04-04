/**
 * 主题切换 Hook
 * Next 客户端组件之间通过 useSyncExternalStore 共享主题，
 * 让 ThemeToggle 不必关心持久化和 DOM 同步细节。
 */
import { useSyncExternalStore, useCallback } from 'react'

type Theme = 'light' | 'dark'

// 主题状态在模块级共享，但初始化延后到真正运行在浏览器时再进行。
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
  // 只有客户端组件开始订阅时才执行初始化，避免服务端渲染阶段碰触浏览器 API。
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
