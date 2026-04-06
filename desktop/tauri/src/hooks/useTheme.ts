/**
 * 主题切换 Hook
 * React 版本继续使用 useSyncExternalStore 演示“无额外状态库也能共享全局主题”。
 */
import { useSyncExternalStore, useCallback } from 'react'

import { load } from '@tauri-apps/plugin-store'

type Theme = 'light' | 'dark'

let theme: Theme = 'light'
let initialized = false
const listeners = new Set<() => void>()
let store: any = null

async function getStoredThemeAsync() {
  try {
    store = await load('config.json', { autoSave: true } as any)
    const stored: any = await store.get('theme')
    const t = stored?.value || stored
    if (t === 'light' || t === 'dark') {
      theme = t
      document.documentElement.setAttribute('data-theme', t)
      listeners.forEach(l => l())
    }
  } catch (err) {
    console.error('Failed to load tauri store', err)
  }
}

function applyTheme(t: Theme) {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', t)
  }
  if (store) {
    store.set('theme', t)
  }
}

function initTheme() {
  if (initialized) return
  initialized = true
  getStoredThemeAsync()
  // 异步加载完毕前先采用默认或初值
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
