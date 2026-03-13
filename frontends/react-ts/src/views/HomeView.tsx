import { Link } from 'react-router-dom'
import logoSvg from '@spec/assets/logo.svg'
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
              <div className={styles.featureIcon}>&#9993;</div>
              <h3>写下心意</h3>
              <p className="text-sm text-secondary mt-2">把想对未来说的话封存在时间胶囊中</p>
            </div>
            <div className="card text-center">
              <div className={styles.featureIcon}>&#9200;</div>
              <h3>设定时间</h3>
              <p className="text-sm text-secondary mt-2">选择胶囊开启的日期，在此之前内容将被隐藏</p>
            </div>
            <div className="card text-center">
              <div className={styles.featureIcon}>&#127873;</div>
              <h3>分享胶囊码</h3>
              <p className="text-sm text-secondary mt-2">将专属胶囊码分享给想要收到惊喜的人</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
