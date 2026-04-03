<script lang="ts">
  import ObjectLink from "@/lib/components/Link.svelte";
  const Link = ObjectLink;
  import ThemeToggle from "./ThemeToggle.svelte";
</script>

<header class="app-header">
  <Link to="/" class="logo logo-link">
    <img src="/favicon.svg" alt="HelloTime" class="logo-img" />
    <span class="text">HelloTime</span>
  </Link>
  <div class="header-actions">
    <nav class="top-nav">
      <Link to="/about">关于</Link>
    </nav>
    <div class="theme-toggle-wrap">
      <ThemeToggle />
    </div>
  </div>
</header>

<style>
  .logo-img {
    width: 28px;
    height: 28px;
    display: block;
  }

  :global(.logo-link) {
    text-decoration: none;
    color: var(--text-primary);
  }

  .header-actions {
    display: flex;
    align-items: center;
  }

  .theme-toggle-wrap {
    display: flex;
    align-items: center;
  }

  @media (max-width: 480px) {
    .text {
      display: none;
    }
  }
</style>
