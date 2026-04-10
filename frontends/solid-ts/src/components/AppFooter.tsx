import { createMemo, Show } from 'solid-js'
import { simplifyTechLabel, useTechStack } from '@/lib/tech-stack'
import styles from './AppFooter.module.css'

export default function AppFooter() {
  const techStack = useTechStack()
  const summary = createMemo(() => {
    if (techStack.loading()) return '加载中...'
    if (techStack.error() || !techStack.techStack()) return '技术栈信息暂不可用'
    const stack = techStack.techStack()!
    return [
      'SolidJS',
      'TypeScript',
      simplifyTechLabel(stack.framework),
      simplifyTechLabel(stack.language),
      simplifyTechLabel(stack.database),
    ].join(' · ')
  })

  return (
    <footer class="app-footer">
      <div class={`stack-info cyber-glass-sm mono-font ${styles.footerInfo}`}>
        <span class="status-dot green"></span>
        <span class={styles.footerText}>{`HelloTime · 时间胶囊 · ${summary()}`}</span>
      </div>
    </footer>
  )
}
