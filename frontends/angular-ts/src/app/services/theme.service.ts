import { Injectable, signal, effect, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);

  // 主题状态既用于组件显示，也要同步到 DOM 根节点供全局样式选择器使用。
  readonly theme = signal<Theme>(
    (typeof localStorage !== 'undefined'
      ? (localStorage.getItem('theme') as Theme)
      : null) ?? 'light'
  );

  constructor() {
    effect(() => {
      const t = this.theme();
      // 设计系统基于 [data-theme="dark"] 切换，因此 service 负责把响应式状态投射到 DOM。
      this.document.documentElement.setAttribute('data-theme', t);
      localStorage.setItem('theme', t);
    });
  }

  toggle(): void {
    this.theme.update(t => (t === 'light' ? 'dark' : 'light'));
  }
}
