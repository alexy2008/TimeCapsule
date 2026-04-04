import styles from './AppFooter.module.css'

export default async function AppFooter() {
  const summary = ['Next.js', 'TypeScript', 'SQLite'].join(' · ')

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
