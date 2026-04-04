import type { Metadata } from 'next'
import Link from 'next/link'
import { buildPageMetadata } from '@/lib/metadata'
import AboutSecretOrb from '@/components/AboutSecretOrb'

export const metadata: Metadata = buildPageMetadata('关于', '了解 HelloTime 的设计理念与核心技术栈')

const techItems = [
  { src: '/frontend.svg', alt: 'Next.js', title: 'Next.js', version: 'Next.js 15' },
  { src: '/frontend-language.svg', alt: 'TypeScript', title: 'TypeScript', version: 'TypeScript 5' },
  { src: '/sqlite-logo.svg', alt: 'SQLite', title: 'SQLite', version: 'SQLite' },
]

export default async function Page() {
  return (
    <section id="view-about" className="view active">
      <div className="view-header">
        <Link className="btn-back" href="/">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          返回
        </Link>
        <h2>关于时间胶囊 (HelloTime)</h2>
      </div>

      <div className="about-content-wrapper">
        <div className="cyber-glass p-8 mb-8">
          <div className="flex-row gap-8">
            <div className="about-hero-text">
              <h3 className="text-glow-cyan mb-4">跨越时空的技术演示</h3>
              <p className="text-secondary mb-6">
                HelloTime 不仅仅是一个简单的时间胶囊应用，它是一个遵循 <strong className="cyan-text text-glow">RealWorld</strong>
                规范的实验性全栈项目。本项目旨在展示在相同的业务逻辑下，如何利用不同的现代化技术架构构建具有高度一致性、可维护性和交互体验的应用程序。
              </p>
              <p className="text-secondary">
                每一行代码都经过精心设计，以确保在高性能后端引擎与现代化前端框架之间实现完美的契合。
              </p>
            </div>
            <div className="about-hero-deco">
              <AboutSecretOrb />
            </div>
          </div>
        </div>

        <div className="about-grid mb-8">
          <div className="cyber-glass p-6">
            <div className="feature-header mb-4">
              <div className="f-icon">🛸</div>
              <h4>统一 API 交互</h4>
            </div>
            <p className="text-muted text-sm">完全遵循 OpenAPI 3.0 标准。无论底层是 JavaScript 运行时还是 SQLite 数据层，页面都只需对接一套标准的 Route Handlers。</p>
          </div>
          <div className="cyber-glass p-6">
            <div className="feature-header mb-4">
              <div className="f-icon">🌗</div>
              <h4>设计系统同步</h4>
            </div>
            <p className="text-muted text-sm mt-3">利用 CSS Custom Properties 维护一套原子化的 Design Tokens。所有实现共享这套玻璃拟态的科技感视觉规范。</p>
          </div>
          <div className="cyber-glass p-6">
            <div className="feature-header mb-4">
              <div className="f-icon">⛓️</div>
              <h4>数据层透明隔离</h4>
            </div>
            <p className="text-muted text-sm mt-3">胶囊内容的锁定逻辑在服务端实现硬隔离，确保了数据的时间安全性，也让 App Router 可以直接在服务端完成首屏渲染。</p>
          </div>
        </div>

        <div className="cyber-glass p-8 mb-8">
          <h3 className="text-glow-cyan mb-6">核心驱动 (Core Technologies)</h3>
          <div className="tech-logos-grid" style={{ alignItems: 'flex-start', marginTop: '3rem' }}>
            {techItems.map((item) => (
              <div key={`${item.alt}-${item.version}`} className="tech-item" style={{ flexDirection: 'column', gap: '1.5rem' }}>
                <img src={item.src} className="stack-icon" style={{ width: '64px', height: '64px' }} alt={item.alt} />
                <div className="text-center">
                  <div className="text-glow" style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{item.title}</div>
                  <div className="text-tertiary mono-font mt-2" style={{ fontSize: '0.9rem' }}>{item.version}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
