import { useTechStack } from '@/hooks/useTechStack'
import { simplifyTechLabel } from '@/utils/techStack'

export default function AppFooter() {
  const { techStack, loading, error } = useTechStack()
  const summary = loading
    ? '加载中...'
    : error || !techStack
      ? '技术栈信息暂不可用'
      : [
          'React',
          'TypeScript',
          simplifyTechLabel(techStack.framework),
          simplifyTechLabel(techStack.language),
          simplifyTechLabel(techStack.database),
        ].join(' · ')

  return (
    <footer className="app-footer">
        <div className="stack-info cyber-glass-sm mono-font" style={{ textAlign: 'center' }}>
            <span className="status-dot green"></span>
            <span style={{ fontSize: '0.85rem', opacity: 0.82 }}>
              {`HelloTime · 时间胶囊 · ${summary}`}
            </span>
        </div>
    </footer>
  )
}
