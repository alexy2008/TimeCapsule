<script lang="ts">
  import { onMount } from 'svelte';
  import Router from 'svelte-spa-router';
  import AppHeader from "./lib/components/AppHeader.svelte";
  import AppFooter from "./lib/components/AppFooter.svelte";
  import { routes } from "./lib/routes";
  import { ensureTechStackLoaded } from './lib/tech-stack-state.svelte';

  onMount(() => {
    void ensureTechStackLoaded();
  });
</script>

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
