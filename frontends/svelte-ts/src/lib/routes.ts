/**
 * 路由配置
 * 使用 svelte-spa-router
 */
import type { Component } from 'svelte';

// 导入页面组件
import Home from '../views/Home.svelte';
import Create from '../views/Create.svelte';
import Open from '../views/Open.svelte';
import Admin from '../views/Admin.svelte';
import About from '../views/About.svelte';

// 路由映射表
export const routes: Record<string, Component> = {
  '/': Home,
  '/create': Create,
  '/open': Open,
  '/open/:code': Open,
  '/admin': Admin,
  '/about': About,
};
