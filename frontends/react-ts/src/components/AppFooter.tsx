import { useTechStack } from '@/hooks/useTechStack'
import { simplifyTechLabel } from '@/utils/techStack'
import styles from './AppFooter.module.css'

export default function AppFooter() {
  const { techStack, loading, error } = useTechStack()
  const summary = loading
    ? '加载中...'
    : error || !techStack
      ? '技术栈信息暂不可用'
      : [
          'React',
          'TypeScript',
          simplifyTechLabel(techStack.framework),
          simplifyTechLabel(techStack.language),
          simplifyTechLabel(techStack.database),
        ].join(' · ')

  return (
    <footer className="app-footer">
        <div className={`stack-info cyber-glass-sm mono-font ${styles.footerInfo}`}>
            <span className="status-dot green"></span>
            <span className={styles.footerText}>
              {`HelloTime · 时间胶囊 · ${summary}`}
            </span>
        </div>
    </footer>
  )
}
