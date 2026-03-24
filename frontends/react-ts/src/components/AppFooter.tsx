import { useTechStack } from '@/hooks/useTechStack'
import styles from './AppFooter.module.css'

export default function AppFooter() {
  const { techStack, loading, error } = useTechStack()

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerInner}`}>
        <p className="text-sm text-secondary">
          <span>Powered By:</span>
          <span className={styles.techStack}>
            {loading
              ? '加载中...'
              : error || !techStack
                ? '技术栈信息暂不可用'
                : `React 19 | ${techStack.framework} | ${techStack.language} | ${techStack.database}`}
          </span>
        </p>
      </div>
    </footer>
  )
}
