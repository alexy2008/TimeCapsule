import { useTheme } from '@/hooks/useTheme'
import styles from './ThemeToggle.module.css'

export default function ThemeToggle() {
  const { theme, toggle } = useTheme()

  return (
    <button
      className={styles.themeToggle}
      onClick={toggle}
      title={theme === 'light' ? '切换到暗色模式' : '切换到亮色模式'}
    >
      <span className={styles.icon}>{theme === 'light' ? '\u263E' : '\u2600'}</span>
    </button>
  )
}
