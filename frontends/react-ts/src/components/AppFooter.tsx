import { useEffect, useState } from 'react'
import { getHealthInfo } from '@/api'
import type { TechStack } from '@/types'
import styles from './AppFooter.module.css'

export default function AppFooter() {
  const [techStack, setTechStack] = useState<TechStack | null>(null)

  useEffect(() => {
    getHealthInfo()
      .then(res => setTechStack(res.data.techStack))
      .catch(() => setTechStack(null))
  }, [])

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerInner}`}>
        <p className="text-sm text-secondary">
          <span>Powered By:</span>
          <span className={styles.techStack}>
            {techStack
              ? `React 19 | ${techStack.framework} | ${techStack.language} | ${techStack.database}`
              : '加载中...'}
          </span>
        </p>
      </div>
    </footer>
  )
}
