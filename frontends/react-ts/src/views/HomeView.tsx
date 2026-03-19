import { Link } from 'react-router-dom'
import logoSvg from '@spec/assets/logo.svg'
import reactLogo from '/react-logo.svg'
import springBootLogo from '/spring-boot-logo.svg'
import sqliteLogo from '/sqlite-logo.svg'
import styles from './HomeView.module.css'

export default function HomeView() {
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
              <img src={reactLogo} alt="React" className={styles.techLogo} />
              <h3>前端</h3>
              <p className="text-sm text-secondary mt-2">React 19 + TypeScript，组件化开发，声明式 UI</p>
            </div>
            <div className="card text-center">
              <img src={springBootLogo} alt="Spring Boot" className={styles.techLogo} />
              <h3>后端</h3>
              <p className="text-sm text-secondary mt-2">Spring Boot 3 + Java 21，企业级 REST API</p>
            </div>
            <div className="card text-center">
              <img src={sqliteLogo} alt="SQLite" className={styles.techLogo} />
              <h3>数据库</h3>
              <p className="text-sm text-secondary mt-2">SQLite，轻量级嵌入式数据库，零配置部署</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
