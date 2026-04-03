/**
 * 路由配置
 * 使用 svelte-spa-router
 */
import { wrap } from 'svelte-spa-router/wrap';
import RouteLoading from './components/RouteLoading.svelte';

// 路由映射表
export const routes: Record<string, ReturnType<typeof wrap>> = {
  '/': wrap({
    asyncComponent: () => import('../views/Home.svelte'),
    loadingComponent: RouteLoading,
  }),
  '/create': wrap({
    asyncComponent: () => import('../views/Create.svelte'),
    loadingComponent: RouteLoading,
  }),
  '/open': wrap({
    asyncComponent: () => import('../views/Open.svelte'),
    loadingComponent: RouteLoading,
  }),
  '/open/:code': wrap({
    asyncComponent: () => import('../views/Open.svelte'),
    loadingComponent: RouteLoading,
  }),
  '/admin': wrap({
    asyncComponent: () => import('../views/Admin.svelte'),
    loadingComponent: RouteLoading,
  }),
  '/about': wrap({
    asyncComponent: () => import('../views/About.svelte'),
    loadingComponent: RouteLoading,
  }),
};
