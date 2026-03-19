import { writable } from 'svelte/store';

type Theme = 'light' | 'dark';

// Initial state from localStorage or default
const getInitialTheme = (): Theme => {
  if (typeof localStorage !== 'undefined') {
    return (localStorage.getItem('theme') as Theme) || 'light';
  }
  return 'light';
};

export const theme = writable<Theme>(getInitialTheme());

export function applyTheme(t: Theme) {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', t);
    localStorage.setItem('theme', t);
  }
}

// Initial apply
if (typeof document !== 'undefined') {
  applyTheme(getInitialTheme());
}

// Subscribe to changes
theme.subscribe((value) => {
  applyTheme(value);
});

export function toggleTheme() {
  theme.update(t => t === 'light' ? 'dark' : 'light');
}
