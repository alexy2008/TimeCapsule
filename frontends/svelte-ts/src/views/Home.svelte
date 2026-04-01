<script lang="ts">
  import { onMount } from 'svelte';
  import ObjectLink from "@/lib/components/Link.svelte";
  import { loadTechStack, techStack, techStackLoading, techStackError } from '../lib/tech-stack';
  const Link = ObjectLink;
  import logoUrl from "@spec/assets/logo.svg";
  const frontendDescription = 'Svelte 5 · TypeScript';

  onMount(async () => {
    await loadTechStack();
  });
</script>

<div class="page">
  <div class="container text-center">
    <div class="hero">
      <img src={logoUrl} alt="时间胶囊" class="hero-logo" />
      <h1 class="hero-title">时间胶囊</h1>
      <p class="hero-subtitle text-secondary">
        封存此刻的心意，在未来的某个时刻开启
      </p>
      <div class="hero-actions">
        <Link to="/create" class="action-btn">
          <span class="action-btn-create">
            <span class="action-main">
              <span class="action-icon">&#9998;</span>
              <span class="action-label">创建胶囊</span>
            </span>
            <span class="action-desc">封存此刻的心意</span>
          </span>
        </Link>
        <Link to="/open" class="action-btn">
          <span class="action-btn-open">
            <span class="action-main">
              <span class="action-icon">&#128275;</span>
              <span class="action-label">开启胶囊</span>
            </span>
            <span class="action-desc">取出未来的惊喜</span>
          </span>
        </Link>
      </div>
    </div>

    <div class="features mt-16">
      <div class="tech-section">
        <div class="card text-center tech-card">
          <h3 class="tech-card-title">技术栈</h3>

          <div class="tech-block">
            <div class="tech-logo-group" aria-label="前端技术栈图标">
              <span class="tech-logo-item">
                <img src="/frontend.svg" alt="Svelte Logo" class="tech-logo" />
              </span>
              <span class="tech-logo-item">
                <img src="/typescript-logo.svg" alt="TypeScript Logo" class="tech-logo" />
              </span>
            </div>
            <p class="tech-label">前端</p>
            <p class="text-sm text-secondary mt-2">{frontendDescription}</p>
          </div>

          <div class="tech-divider" aria-hidden="true"></div>

          <div class="tech-block">
            <div class="tech-logo-group" aria-label="后端技术栈图标">
              <span class="tech-logo-item">
                <img src="/tech-logos/backend.svg" alt="后端框架 Logo" class="tech-logo" />
              </span>
              <span class="tech-logo-item">
                <img src="/tech-logos/language.svg" alt="后端语言 Logo" class="tech-logo" />
              </span>
              <span class="tech-logo-item">
                <img src="/tech-logos/database.svg" alt="后端数据库 Logo" class="tech-logo" />
              </span>
            </div>
            <p class="tech-label">后端</p>
            <p class="text-sm text-secondary mt-2">
              {$techStackLoading
                ? '加载中...'
                : $techStackError || !$techStack
                  ? '技术栈信息暂不可用'
                  : `${$techStack.framework} · ${$techStack.language} · ${$techStack.database}`}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .hero {
    padding: var(--space-16) 0 var(--space-8);
  }

  .hero-logo {
    width: 80px;
    height: 80px;
    margin: 0 auto var(--space-6);
  }

  .hero-title {
    font-size: 2.5rem;
    margin-bottom: var(--space-3);
  }

  .hero-subtitle {
    font-size: var(--text-xl);
    margin-bottom: var(--space-8);
  }

  .hero-actions {
    display: flex;
    justify-content: center;
    gap: var(--space-5);
  }

  .tech-logo {
    width: 52px;
    height: 52px;
    object-fit: contain;
    display: block;
  }

  .tech-section {
    display: flex;
    justify-content: center;
  }

  .tech-card {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: min(100%, 440px);
    min-height: 220px;
    margin: 0 auto;
  }

  .tech-card-title {
    margin-bottom: var(--space-5);
  }

  .tech-block {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .tech-logo-group {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: var(--space-5);
    margin: 0 auto var(--space-4);
    flex-wrap: wrap;
  }

  .tech-logo-item {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .tech-logo-item + .tech-logo-item {
    padding-left: var(--space-5);
    margin-left: var(--space-1);
    border-left: 1px solid var(--color-border);
  }

  .tech-label {
    font-size: var(--text-base);
    font-weight: var(--font-semibold);
  }

  .tech-divider {
    width: 100%;
    height: 1px;
    margin: var(--space-6) 0;
    background: var(--color-border);
  }

  :global(.action-btn) {
    display: block;
    text-decoration: none;
  }

  .action-btn-create,
  .action-btn-open {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-1);
    padding: var(--space-4) var(--space-10);
    border-radius: var(--radius-xl);
    color: #ffffff;
    transition: transform var(--transition-fast), box-shadow var(--transition-fast), filter var(--transition-fast);
    box-shadow: var(--shadow-md);
    min-width: 200px;
  }

  .action-main {
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }

  .action-btn-create {
    background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
  }

  .action-btn-open {
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  }

  .action-btn-create:hover,
  .action-btn-open:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-lg);
    filter: brightness(1.08);
  }

  .action-icon {
    font-size: 2rem;
    line-height: 1;
  }

  .action-label {
    font-size: var(--text-lg);
    font-weight: var(--font-semibold);
    letter-spacing: 0.02em;
  }

  .action-desc {
    font-size: var(--text-sm);
    opacity: 0.85;
  }

  @media (max-width: 480px) {
    .hero-actions {
      flex-direction: column;
      align-items: center;
    }

    :global(.action-btn) {
      width: 100%;
      max-width: 280px;
    }
  }

  /* 暗色模式：降低背景亮度，增强光晕边界 */
  :global([data-theme="dark"]) .action-btn-create {
    background: linear-gradient(135deg, #15803d 0%, #166534 100%);
    box-shadow: 0 0 0 1px rgba(74, 222, 128, 0.25), var(--shadow-md);
  }

  :global([data-theme="dark"]) .action-btn-open {
    background: linear-gradient(135deg, #1d4ed8 0%, #1e3a8a 100%);
    box-shadow: 0 0 0 1px rgba(96, 165, 250, 0.25), var(--shadow-md);
  }

  :global([data-theme="dark"]) .action-btn-create:hover,
  :global([data-theme="dark"]) .action-btn-open:hover {
    filter: brightness(1.15);
  }
</style>
