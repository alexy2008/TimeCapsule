import { writable } from 'svelte/store';

type Theme = 'light' | 'dark';

// Svelte 版本用最轻的 store 方案演示“状态 + DOM 同步”的基本写法。
const getInitialTheme = (): Theme => {
  if (typeof localStorage !== 'undefined') {
    return (localStorage.getItem('theme') as Theme) || 'light';
  }
  return 'light';
};

export const theme = writable<Theme>(getInitialTheme());

export function applyTheme(t: Theme) {
  if (typeof document !== 'undefined') {
    // 全局样式通过 data-theme 切换明暗主题。
    document.documentElement.setAttribute('data-theme', t);
    localStorage.setItem('theme', t);
  }
}

if (typeof document !== 'undefined') {
  applyTheme(getInitialTheme());
}

// 订阅 store，让主题变化自动反映到 DOM，而不需要每个组件单独处理。
theme.subscribe((value) => {
  applyTheme(value);
});

export function toggleTheme() {
  theme.update(t => t === 'light' ? 'dark' : 'light');
}
