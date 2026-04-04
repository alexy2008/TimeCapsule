import { useTheme } from '@/hooks/useTheme'

export default function ThemeToggle() {
  const { theme, toggle } = useTheme()

  return (
    // 组件本身只关心“当前主题”和“切换动作”，持久化与 DOM 同步都由 hook 处理。
    <button className="btn btn-icon outline-glow" aria-label="Toggle Theme" onClick={toggle} title={theme === 'light' ? '切换暗色模式' : '切换亮色模式'}>
       {theme === 'light' ? (
           <svg className="moon-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
               <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
           </svg>
       ) : (
           <svg className="sun-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
               <circle cx="12" cy="12" r="5"></circle>
               <line x1="12" y1="1" x2="12" y2="3"></line>
               <line x1="12" y1="21" x2="12" y2="23"></line>
               <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
               <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
               <line x1="1" y1="12" x2="3" y2="12"></line>
               <line x1="21" y1="12" x2="23" y2="12"></line>
               <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
               <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
           </svg>
       )}
    </button>
  )
}
