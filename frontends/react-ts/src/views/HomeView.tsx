import { Link } from 'react-router-dom'
import logoSvg from '@spec/assets/logo.svg'
import { useTechStack } from '@/hooks/useTechStack'
import styles from './HomeView.module.css'

export default function HomeView() {
  const { techStack, loading, error } = useTechStack()
  const backendDescription = loading
    ? '加载中...'
    : error || !techStack
      ? '技术栈信息暂不可用'
      : `${techStack.framework} · ${techStack.language}`
  const databaseDescription = loading
    ? '加载中...'
    : error || !techStack
      ? '技术栈信息暂不可用'
      : techStack.database

  return (
    <div className="page">
      <div className="container text-center">
        <div className={styles.hero}>
          <img src={logoSvg} alt="时间胶囊" className={styles.heroLogo} />
          <h1 className={styles.heroTitle}>时间胶囊</h1>
          <p className={`${styles.heroSubtitle} text-secondary`}>
            封存此刻的心意，在未来的某个时刻开启
          </p>
          <div className={styles.heroActions}>
            <Link to="/create" className={styles.actionBtn}>
              <span className={styles.actionBtnCreate}>
                <span className={styles.actionMain}>
                  <span className={styles.actionIcon}>&#9998;</span>
                  <span className={styles.actionLabel}>创建胶囊</span>
                </span>
                <span className={styles.actionDesc}>封存此刻的心意</span>
              </span>
            </Link>
            <Link to="/open" className={styles.actionBtn}>
              <span className={styles.actionBtnOpen}>
                <span className={styles.actionMain}>
                  <span className={styles.actionIcon}>&#128275;</span>
                  <span className={styles.actionLabel}>开启胶囊</span>
                </span>
                <span className={styles.actionDesc}>取出未来的惊喜</span>
              </span>
            </Link>
          </div>
        </div>

        <div className="features mt-16">
          <div className="grid grid-cols-3 gap-6">
            <div className="card text-center">
              <img src="/frontend.svg" alt="前端技术栈" className={styles.techLogo} />
              <h3>前端</h3>
              <p className="text-sm text-secondary mt-2">React 19 + TypeScript</p>
            </div>
            <div className="card text-center">
              <img src="/tech-logos/backend.svg" alt="后端技术栈" className={styles.techLogo} />
              <h3>后端</h3>
              <p className="text-sm text-secondary mt-2">{backendDescription}</p>
            </div>
            <div className="card text-center">
              <img src="/tech-logos/database.svg" alt="数据库技术栈" className={styles.techLogo} />
              <h3>数据库</h3>
              <p className="text-sm text-secondary mt-2">{databaseDescription}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
