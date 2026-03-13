import { Routes } from '@angular/router';

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
