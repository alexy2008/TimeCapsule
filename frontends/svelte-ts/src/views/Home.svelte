<script lang="ts">
  import ObjectLink from "@/lib/components/Link.svelte";
  import { techStackState } from '../lib/tech-stack-state.svelte';
  import { simplifyTechLabel } from '../lib/tech-stack-utils';

  const Link = ObjectLink;
  const backendLogo = $derived(techStackState.techStack ? `/tech-logos/backend.svg?v=${encodeURIComponent(techStackState.techStack.framework)}` : '/tech-logos/backend.svg');
  const languageLogo = $derived(techStackState.techStack ? `/tech-logos/language.svg?v=${encodeURIComponent(techStackState.techStack.language)}` : '/tech-logos/language.svg');
  const databaseLogo = $derived(techStackState.techStack ? `/tech-logos/database.svg?v=${encodeURIComponent(techStackState.techStack.database)}` : '/tech-logos/database.svg');

  const techItems = $derived([
    { src: '/frontend.svg', alt: 'Svelte Logo', label: 'Svelte' },
    { src: '/frontend-language.svg', alt: 'TypeScript Logo', label: 'TypeScript' },
    {
      src: backendLogo,
      alt: '后端框架 Logo',
      label: techStackState.loading ? '...' : techStackState.error || !techStackState.techStack ? '?' : simplifyTechLabel(techStackState.techStack.framework),
    },
    {
      src: languageLogo,
      alt: '后端语言 Logo',
      label: techStackState.loading ? '加载中' : techStackState.error || !techStackState.techStack ? '?' : simplifyTechLabel(techStackState.techStack.language),
    },
    {
      src: databaseLogo,
      alt: '数据库 Logo',
      label: techStackState.loading ? '...' : techStackState.error || !techStackState.techStack ? '?' : simplifyTechLabel(techStackState.techStack.database),
    },
  ]);
</script>

<section id="view-home" class="view active">
  <div class="hero-section">
    <div class="hero-badge">TIMECAPSULE SYSTEM</div>
    <h1 class="hero-title">封存此刻 <span class="text-glow">开启未来</span></h1>
    <p class="hero-subtitle">将您的寄语、秘密或愿景封装于时间胶囊中，直到指定的未来时刻才能被访问。</p>

    <div class="action-cards">
      <Link to="/create" class="action-card cyber-glass action-card-link" aria-label="创建胶囊">
        <div class="card-icon cyan-glow">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 5v14M5 12h14"></path>
          </svg>
        </div>
        <h3>创建胶囊</h3>
        <p>封存此刻寄语，投递给未来的自己</p>
      </Link>

      <Link to="/open" class="action-card cyber-glass action-card-link" aria-label="开启胶囊">
        <div class="card-icon magenta-glow">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
        <h3>开启胶囊</h3>
        <p>输入提取凭据，唤醒沉睡的时间印记</p>
      </Link>
    </div>

    <div class="tech-stack-simple cyber-glass">
      <h4 class="stack-title">TECHNOLOGY STACK</h4>
      <div class="tech-logos-grid text-center">
        {#each techItems as item (`${item.alt}-${item.label}`)}
          <div class="tech-item" title={item.label}>
            <img src={item.src} class="stack-icon" alt={item.alt} />
            <span>{item.label}</span>
          </div>
        {/each}
      </div>
    </div>
  </div>
</section>

<style>
  :global(.action-card-link) {
    text-decoration: none;
    color: inherit;
  }
</style>
