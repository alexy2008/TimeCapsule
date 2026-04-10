import { For, createMemo, createSignal } from 'solid-js'
import { useNavigate } from '@solidjs/router'
import { useTechStack } from '@/lib/tech-stack'

export default function AboutRoute() {
  const navigate = useNavigate()
  const techStack = useTechStack()
  const [clickCount, setClickCount] = createSignal(0)

  const techItems = createMemo(() => {
    const stack = techStack.techStack()
    const backendLogo = stack ? `/tech-logos/backend.svg?v=${encodeURIComponent(stack.framework)}` : '/tech-logos/backend.svg'
    const languageLogo = stack ? `/tech-logos/language.svg?v=${encodeURIComponent(stack.language)}` : '/tech-logos/language.svg'
    const databaseLogo = stack ? `/tech-logos/database.svg?v=${encodeURIComponent(stack.database)}` : '/tech-logos/database.svg'

    return [
      { src: '/frontend.svg', alt: 'Solid Logo', title: 'SolidJS', version: 'SolidJS 1' },
      { src: '/frontend-language.svg', alt: 'TypeScript Logo', title: 'TypeScript', version: 'TypeScript 5' },
      {
        src: backendLogo,
        alt: '后端框架',
        title: techStack.loading() ? '后端框架' : techStack.error() || !stack ? '暂不可用' : stack.framework,
        version: techStack.loading() ? '加载中...' : techStack.error() || !stack ? '技术栈信息暂不可用' : stack.framework,
      },
      {
        src: languageLogo,
        alt: '后端语言',
        title: techStack.loading() ? '后端语言' : techStack.error() || !stack ? '暂不可用' : stack.language,
        version: techStack.loading() ? '加载中...' : techStack.error() || !stack ? '技术栈信息暂不可用' : stack.language,
      },
      {
        src: databaseLogo,
        alt: '数据库',
        title: techStack.loading() ? '数据库' : techStack.error() || !stack ? '暂不可用' : stack.database,
        version: techStack.loading() ? '加载中...' : techStack.error() || !stack ? '技术栈信息暂不可用' : stack.database,
      },
    ]
  })

  function handleSecretClick() {
    const next = clickCount() + 1
    if (next >= 5) {
      setClickCount(0)
      navigate('/admin')
      return
    }
    setClickCount(next)
  }

  return (
    <section id="view-about" class="view active">
      <div class="view-header">
        <button class="btn-back" onClick={() => navigate('/')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          返回
        </button>
        <h2>关于时间胶囊 (HelloTime)</h2>
      </div>

      <div class="about-content-wrapper">
        <div class="cyber-glass p-8 mb-8">
          <div class="flex-row gap-8">
            <div class="about-hero-text">
              <h3 class="text-glow-cyan mb-4">跨越时空的技术演示</h3>
              <p class="text-secondary mb-6">
                HelloTime 不仅仅是一个简单的时间胶囊应用，它是一个遵循 <strong class="cyan-text text-glow">RealWorld</strong> 规范的实验性全栈项目。本项目旨在展示在相同的业务逻辑下，如何利用不同的现代化技术架构构建具有高度一致性、可维护性和交互体验的应用程序。
              </p>
              <p class="text-secondary">每一行代码都经过精心设计，以确保在高性能后端引擎与现代化前端框架之间实现完美的契合。</p>
            </div>
            <div class="about-hero-deco">
              <div
                class="tech-orb"
                onClick={handleSecretClick}
                role="button"
                tabIndex={0}
                aria-label="隐藏管理入口"
                onKeyDown={event => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    handleSecretClick()
                  }
                }}
              >
                <div class="orb-core"></div>
                <div class="orb-ring ring-1"></div>
                <div class="orb-ring ring-2"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="about-grid mb-8">
          <div class="cyber-glass p-6">
            <div class="feature-header mb-4">
              <div class="f-icon">🧬</div>
              <h4>细粒度响应式</h4>
            </div>
            <p class="text-muted text-sm">SolidJS 通过 signal、memo 和 resource 直接驱动界面变化，避免整棵组件树无谓重渲染。</p>
          </div>
          <div class="cyber-glass p-6">
            <div class="feature-header mb-4">
              <div class="f-icon">🌗</div>
              <h4>设计系统同步</h4>
            </div>
            <p class="text-muted text-sm mt-3">统一复用 cyber 设计系统，让不同框架实现仍然保持同一套科技感视觉基底和主题切换体验。</p>
          </div>
          <div class="cyber-glass p-6">
            <div class="feature-header mb-4">
              <div class="f-icon">⛓️</div>
              <h4>统一 API 契约</h4>
            </div>
            <p class="text-muted text-sm mt-3">所有前后端分离实现共享同一份 OpenAPI 契约，Solid 版本也只消费统一的 REST 接口和固定技术图标路径。</p>
          </div>
        </div>

        <div class="cyber-glass p-8 mb-8">
          <h3 class="text-glow-cyan mb-6">核心驱动 (Core Technologies)</h3>
          <div class="tech-logos-grid" style={{ 'align-items': 'flex-start', 'margin-top': '3rem' }}>
            <For each={techItems()}>
              {item => (
                <div class="tech-item" style={{ 'flex-direction': 'column', gap: '1.5rem' }}>
                  <img src={item.src} class="stack-icon" style={{ width: '64px', height: '64px' }} alt={item.alt} />
                  <div class="text-center">
                    <div class="text-glow" style={{ 'font-size': '1.1rem', 'font-weight': 'bold' }}>
                      {item.title}
                    </div>
                    <div class="text-tertiary mono-font mt-2" style={{ 'font-size': '0.9rem' }}>
                      {item.version}
                    </div>
                  </div>
                </div>
              )}
            </For>
          </div>
        </div>
      </div>
    </section>
  )
}
