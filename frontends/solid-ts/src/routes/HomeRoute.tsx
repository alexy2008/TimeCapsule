import { A } from '@solidjs/router'
import { For, createMemo } from 'solid-js'
import { simplifyTechLabel, useTechStack } from '@/lib/tech-stack'
import styles from './HomeRoute.module.css'

export default function HomeRoute() {
  const techStack = useTechStack()

  const techItems = createMemo(() => {
    const stack = techStack.techStack()
    const backendLogo = stack ? `/tech-logos/backend.svg?v=${encodeURIComponent(stack.framework)}` : '/tech-logos/backend.svg'
    const languageLogo = stack ? `/tech-logos/language.svg?v=${encodeURIComponent(stack.language)}` : '/tech-logos/language.svg'
    const databaseLogo = stack ? `/tech-logos/database.svg?v=${encodeURIComponent(stack.database)}` : '/tech-logos/database.svg'

    return [
      { src: '/frontend.svg', alt: 'Solid Logo', label: 'SolidJS' },
      { src: '/frontend-language.svg', alt: 'TypeScript Logo', label: 'TypeScript' },
      { src: backendLogo, alt: '后端框架 Logo', label: techStack.loading() ? '...' : techStack.error() || !stack ? '?' : simplifyTechLabel(stack.framework) },
      { src: languageLogo, alt: '后端语言 Logo', label: techStack.loading() ? '加载中' : techStack.error() || !stack ? '?' : simplifyTechLabel(stack.language) },
      { src: databaseLogo, alt: '数据库 Logo', label: techStack.loading() ? '...' : techStack.error() || !stack ? '?' : simplifyTechLabel(stack.database) },
    ]
  })

  return (
    <section id="view-home" class="view active">
      <div class="hero-section">
        <div class="hero-badge">TIMECAPSULE SYSTEM</div>
        <h1 class="hero-title">
          封存此刻 <span class="text-glow">开启未来</span>
        </h1>
        <p class="hero-subtitle">将您的寄语、秘密或愿景封装于时间胶囊中，直到指定的未来时刻才能被访问。</p>

        <div class="action-cards">
          <A href="/create" class={`action-card cyber-glass ${styles.actionCardLink}`} aria-label="创建胶囊">
            <div class="card-icon cyan-glow">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 5v14M5 12h14"></path>
              </svg>
            </div>
            <h3>创建胶囊</h3>
            <p>封存此刻寄语，投递给未来的自己</p>
          </A>

          <A href="/open" class={`action-card cyber-glass ${styles.actionCardLink}`} aria-label="开启胶囊">
            <div class="card-icon magenta-glow">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
            <h3>开启胶囊</h3>
            <p>输入提取凭据，唤醒沉睡的时间印记</p>
          </A>
        </div>

        <div class="tech-stack-simple cyber-glass">
          <h4 class="stack-title">TECHNOLOGY STACK</h4>
          <div class="tech-logos-grid text-center">
            <For each={techItems()}>
              {item => (
                <div class="tech-item" title={item.label}>
                  <img src={item.src} class="stack-icon" alt={item.alt} />
                  <span>{item.label}</span>
                </div>
              )}
            </For>
          </div>
        </div>
      </div>
    </section>
  )
}
