import type { Metadata } from 'next'
import Link from 'next/link'
import { buildPageMetadata } from '@/lib/metadata'
import styles from './home.module.css'

export const metadata: Metadata = buildPageMetadata('首页', '创建与开启时间胶囊的 Next.js 实现首页')

const techItems = [
  { src: '/frontend.svg', alt: 'Next.js Logo', label: 'Next.js' },
  { src: '/frontend-language.svg', alt: 'TypeScript Logo', label: 'TypeScript' },
  { src: '/sqlite-logo.svg', alt: 'SQLite Logo', label: 'SQLite' },
]

export default async function Page() {
  return (
    <section id="view-home" className="view active">
      <div className="hero-section">
        <div className="hero-badge">TIMECAPSULE SYSTEM</div>
        <h1 className="hero-title">封存此刻 <span className="text-glow">开启未来</span></h1>
        <p className="hero-subtitle">将您的寄语、秘密或愿景封装于时间胶囊中，直到指定的未来时刻才能被访问。</p>

        <div className="action-cards">
          <Link href="/create" className={`action-card cyber-glass ${styles.actionCardLink}`} aria-label="创建胶囊">
            <div className="card-icon cyan-glow">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14"></path>
              </svg>
            </div>
            <h3>创建胶囊</h3>
            <p>封存此刻寄语，投递给未来的自己</p>
          </Link>

          <Link href="/open" className={`action-card cyber-glass ${styles.actionCardLink}`} aria-label="开启胶囊">
            <div className="card-icon magenta-glow">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
            <h3>开启胶囊</h3>
            <p>输入提取凭据，唤醒沉睡的时间印记</p>
          </Link>
        </div>

        <div className="tech-stack-simple cyber-glass">
          <h4 className="stack-title">TECHNOLOGY STACK</h4>
          <div className="tech-logos-grid text-center">
            {techItems.map((item) => (
              <div key={`${item.alt}-${item.label}`} className="tech-item" title={item.label}>
                <img src={item.src} className="stack-icon" alt={item.alt} />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
