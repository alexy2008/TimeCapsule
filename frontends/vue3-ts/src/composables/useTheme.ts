/**
 * 主题切换 Composable
 * 支持亮色/暗色模式切换，主题偏好持久化到 localStorage
 */
import { ref, watchEffect } from 'vue'

type Theme = 'light' | 'dark'

/**
 * 当前主题状态
 * 从 localStorage 读取初始值，默认为 'light'
 */
const theme = ref<Theme>((typeof localStorage !== 'undefined' && localStorage.getItem('theme') as Theme) || 'light')

/**
 * 应用主题到 DOM
 * 在 <html> 元素上设置 data-theme 属性，触发 CSS 变量切换
 * 同时将主题偏好保存到 localStorage
 */
function applyTheme(t: Theme) {
  document.documentElement.setAttribute('data-theme', t)
  localStorage.setItem('theme', t)
}

// 初始化：在 SSR 环境下检查 document 是否存在
if (typeof document !== 'undefined') {
  applyTheme(theme.value)
}

/**
 * 监听主题变化
 * 当 theme.value 改变时自动应用到 DOM
 */
watchEffect(() => {
  if (typeof document !== 'undefined') {
    applyTheme(theme.value)
  }
})

/**
 * useTheme 组合式函数
 * 提供主题状态和切换方法
 *
 * @returns theme 当前主题，toggle 切换方法
 */
export function useTheme() {
  /**
   * 切换主题
   * light <-> dark 切换
   */
  function toggle() {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  return { theme, toggle }
}
