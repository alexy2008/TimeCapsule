<script lang="ts">
  import { onMount } from 'svelte';
  import Router from 'svelte-spa-router';
  import AppHeader from "./lib/components/AppHeader.svelte";
  import AppFooter from "./lib/components/AppFooter.svelte";
  import { routes } from "./lib/routes";
  import { ensureTechStackLoaded } from './lib/tech-stack-state.svelte';

  onMount(() => {
    // 技术栈数据在根组件预加载，供头部、页脚和页面复用。
    void ensureTechStackLoaded();
  });
</script>

<!-- Svelte 版本的根组件同样只负责应用壳和路由出口。 -->
<div class="ambient-glow"></div>
<div class="background-grid"></div>

<div class="app-container">
  <AppHeader />

  <main class="app-main">
    <Router {routes} />
  </main>

  <AppFooter />
</div>

<style>
  .app-container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
  
</style>
