<script lang="ts">
  import Router from 'svelte-spa-router';
  import AppHeader from "./lib/components/AppHeader.svelte";
  import AppFooter from "./lib/components/AppFooter.svelte";
  import { routes } from "./lib/routes";
</script>

<div class="app-container">
  <AppHeader />
  
  <main class="main-content">
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
  
  .main-content {
    flex: 1;
    min-height: calc(100vh - var(--header-height) - 4rem);
  }
</style>
