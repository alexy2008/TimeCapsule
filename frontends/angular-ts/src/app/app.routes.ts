import { Routes } from '@angular/router';

// 所有页面都使用 loadComponent 懒加载，突出 standalone component 的现代 Angular 写法。
export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./views/home/home.component').then(m => m.HomeComponent),
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./views/create/create.component').then(m => m.CreateComponent),
  },
  {
    path: 'open/:code',
    loadComponent: () =>
      import('./views/open/open.component').then(m => m.OpenComponent),
  },
  {
    // 把 /open 和 /open/:code 拆成两条路由，比可选参数更直观，适合教学展示。
    path: 'open',
    loadComponent: () =>
      import('./views/open/open.component').then(m => m.OpenComponent),
  },
  {
    path: 'about',
    loadComponent: () =>
      import('./views/about/about.component').then(m => m.AboutComponent),
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./views/admin/admin.component').then(m => m.AdminComponent),
  },
];
