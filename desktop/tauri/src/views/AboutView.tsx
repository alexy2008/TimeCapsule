import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTechStack } from '@/hooks/useTechStack'

export default function AboutView() {
  const navigate = useNavigate()
  const clickCount = useRef(0)
  const { techStack, loading, error } = useTechStack()
  const backendLogo = techStack ? `http://localhost:8080/tech-logos/backend.svg?v=${encodeURIComponent(techStack.framework)}` : 'http://localhost:8080/tech-logos/backend.svg'
  const languageLogo = techStack ? `http://localhost:8080/tech-logos/language.svg?v=${encodeURIComponent(techStack.language)}` : 'http://localhost:8080/tech-logos/language.svg'
  const databaseLogo = techStack ? `http://localhost:8080/tech-logos/database.svg?v=${encodeURIComponent(techStack.database)}` : 'http://localhost:8080/tech-logos/database.svg'

  const techItems = [
    { src: '/tauri.svg', alt: 'Tauri', title: 'Tauri 2', version: 'Desktop Core' },
    { src: '/frontend.svg', alt: 'React', title: 'React 19', version: 'UI Layer' },
    {
      src: backendLogo,
      alt: '后端架构',
      title: loading ? '后端架构' : error || !techStack ? '暂不可用' : techStack.framework,
      version: loading ? '加载中...' : error || !techStack ? 'API Server' : techStack.framework,
    },
    {
      src: languageLogo,
      alt: '后端语言',
      title: loading ? '后端语言' : error || !techStack ? '暂不可用' : techStack.language,
      version: loading ? '加载中...' : error || !techStack ? '服务语言' : techStack.language,
    },
    {
      src: databaseLogo,
      alt: '数据库',
      title: loading ? '数据库' : error || !techStack ? '暂不可用' : techStack.database,
      version: loading ? '加载中...' : error || !techStack ? '存储层' : techStack.database,
    },
  ]

  function handleSecretClick() {
    clickCount.current++
    if (clickCount.current >= 5) {
      clickCount.current = 0
      navigate('/admin')
    }
  }

  return (
    <section id="view-about" className="view active">
        <div className="view-header">
            <button className="btn-back" onClick={() => navigate('/')}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                返回
            </button>
            <h2>关于时间胶囊 (HelloTime)</h2>
        </div>

        <div className="about-content-wrapper">
            {/* Highlight Section */}
            <div className="cyber-glass p-8 mb-8">
                <div className="flex-row gap-8">
                    <div className="about-hero-text">
                        <h3 className="text-glow-cyan mb-4">跨越时空的技术演示</h3>
                        <p className="text-secondary mb-6">
                            HelloTime 不仅仅是一个简单的时间胶囊应用，它是一个遵循 <strong className="cyan-text text-glow">RealWorld</strong>
                            规范的实验性全栈项目。
                            本项目旨在展示在相同的业务逻辑下，如何利用不同的现代化技术架构构建具有高度一致性、可维护性和交互体验的应用程序。
                        </p>
                        <p className="text-secondary">
                            每一行代码都经过精心设计，以确保在高性能后端引擎与现代化前端框架之间实现完美的契合。
                        </p>
                    </div>
                    <div className="about-hero-deco">
                        <div
                          className="tech-orb"
                          onClick={handleSecretClick}
                          role="button"
                          tabIndex={0}
                          aria-label="隐藏管理入口"
                          onKeyDown={(event) => {
                            if (event.key === 'Enter' || event.key === ' ') {
                              event.preventDefault()
                              handleSecretClick()
                            }
                          }}
                        >
                            <div className="orb-core"></div>
                            <div className="orb-ring ring-1"></div>
                            <div className="orb-ring ring-2"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Grid */}
            <div className="about-grid mb-8">
                <div className="cyber-glass p-6">
                    <div className="feature-header mb-4">
                        <div className="f-icon">🛸</div>
                        <h4>统一 API 交互</h4>
                    </div>
                    <p className="text-muted text-sm">完全遵循 OpenAPI 3.0 标准。无论底层是 Java, Go 还是 Python，前端都只需对接一套标准的 REST 接口。
                    </p>
                </div>
                <div className="cyber-glass p-6">
                    <div className="feature-header mb-4">
                        <div className="f-icon">🌗</div>
                        <h4>设计系统同步</h4>
                    </div>
                    <p className="text-muted text-sm mt-3">利用 CSS Custom Properties 维护一套原子化的 Design
                        Tokens。所有框架共享这套玻璃拟态的科技感视觉规范。</p>
                </div>
                <div className="cyber-glass p-6">
                    <div className="feature-header mb-4">
                        <div className="f-icon">⛓️</div>
                        <h4>数据层透明隔离</h4>
                    </div>
                    <p className="text-muted text-sm mt-3">胶囊内容的锁定逻辑在服务端实现硬隔离（API 永不返回未到期内容），确保了数据的时间安全性。</p>
                </div>
            </div>

            {/* Technical Deep Dive (Large Logos & Versions) */}
            <div className="cyber-glass p-8 mb-8">
                <h3 className="text-glow-cyan mb-6">核心驱动 (Core Technologies)</h3>
                <div className="tech-logos-grid" style={{ alignItems: 'flex-start', marginTop: '3rem' }}>
                    {techItems.map(item => (
                      <div key={`${item.alt}-${item.version}`} className="tech-item" style={{ flexDirection: 'column', gap: '1.5rem' }}>
                          <img src={item.src}
                              className="stack-icon" style={{ width: '64px', height: '64px' }} alt={item.alt} />
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
