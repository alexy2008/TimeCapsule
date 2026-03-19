<script lang="ts">
  import ObjectLink from "@/lib/components/Link.svelte";
  const Link = ObjectLink;
  import ThemeToggle from "./ThemeToggle.svelte";
  import logoUrl from "@spec/assets/logo.svg";
</script>

<header class="header">
  <div class="container flex items-center justify-between">
    <Link to="/" class="logo flex items-center gap-2">
      <img src={logoUrl} alt="logo" class="logo-img" />
      <span class="logo-text">时间胶囊</span>
    </Link>
    <nav class="nav flex items-center gap-4">
      <Link to="/" class="nav-link">首页</Link>
      <Link to="/create" class="nav-link">创建</Link>
      <Link to="/open" class="nav-link">开启</Link>
      <Link to="/about" class="nav-link">关于</Link>
      <ThemeToggle />
    </nav>
  </div>
</header>

<style>
  .header {
    height: var(--header-height);
    border-bottom: 1px solid var(--color-border);
    background-color: var(--color-bg);
    position: sticky;
    top: 0;
    z-index: 50;
    transition: background-color var(--transition-base), border-color var(--transition-base);
    display: flex;
    align-items: center;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    text-decoration: none;
    color: var(--color-text);
  }

  .logo-img {
    width: 32px;
    height: 32px;
  }

  .logo-text {
    font-size: var(--text-lg);
    font-weight: var(--font-bold);
  }

  :global(.nav-link) {
    font-size: var(--text-sm);
    font-weight: var(--font-medium);
    color: var(--color-text-secondary);
    transition: color var(--transition-fast);
    padding: var(--space-1) var(--space-2);
    text-decoration: none;
  }

  :global(.nav-link:hover),
  :global(.nav-link[aria-current="page"]) {
    color: var(--color-primary);
  }

  @media (max-width: 480px) {
    .logo-text {
      display: none;
    }
  }
</style>
