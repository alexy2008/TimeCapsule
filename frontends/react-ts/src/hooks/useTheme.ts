/**
 * 主题切换 Hook
 * React 版本继续使用 useSyncExternalStore 演示“无额外状态库也能共享全局主题”。
 */
import { useSyncExternalStore, useCallback } from 'react'

type Theme = 'light' | 'dark'

// 主题状态延迟初始化，避免在模块加载阶段直接访问浏览器对象。
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
    // 设计系统使用 data-theme 控制明暗色变量，因此切换主题时要同步更新根节点属性。
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
  // 初始化时立即把已保存的主题投射到 DOM，防止刷新后闪回默认主题。
  applyTheme(theme)
}

function subscribe(callback: () => void) {
  // 只有真正有组件订阅时才初始化，保持模块本身无副作用。
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
  const currentTheme = useSyncExternalStore(subscribe, getSnapshot)

  const toggle = useCallback(() => {
    setTheme(currentTheme === 'light' ? 'dark' : 'light')
  }, [currentTheme])

  return { theme: currentTheme, toggle }
}
