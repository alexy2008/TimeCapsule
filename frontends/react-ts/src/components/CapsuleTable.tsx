import { useState } from 'react'
import type { Capsule, PageData } from '@/types'

interface Props {
  capsules: Capsule[]
  pageInfo: Omit<PageData<Capsule>, 'content'>
  loading?: boolean
  onDelete: (code: string) => void
  onPage: (page: number) => void
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleString('zh-CN', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function CapsuleTable({ capsules, pageInfo, loading, onDelete, onPage }: Props) {
  const [expandedCode, setExpandedCode] = useState<string | null>(null)

  function toggleExpand(code: string) {
    setExpandedCode(prev => prev === code ? null : code)
  }

  return (
    <div>
      {loading ? (
        <div className="text-center" style={{ padding: '2rem', color: 'var(--text-secondary)' }}>加载中...</div>
      ) : capsules.length === 0 ? (
        <div className="text-center" style={{ padding: '2rem', color: 'var(--text-secondary)' }}>暂无胶囊</div>
      ) : (
        <div className="table-responsive">
          <table className="cyber-table">
            <thead>
              <tr>
                <th>标识码 (ID)</th>
                <th>数据标题</th>
                <th>创建者</th>
                <th>预计解锁时间</th>
                <th>当前状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {capsules.map(capsule => (
                <tr key={capsule.code} onClick={() => toggleExpand(capsule.code)} style={{ cursor: 'pointer' }}>
                  <td className="mono-font cyan-text">{capsule.code}</td>
                  <td>{capsule.title}</td>
                  <td className="mono-font">{capsule.creator}</td>
                  <td className="mono-font">{formatTime(capsule.openAt)}</td>
                  <td>
                    <span className={`badge ${capsule.opened ? 'badge-unlocked' : 'badge-locked'}`}>
                      {capsule.opened ? '已解密' : '锁定'}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-icon btn-danger-outline"
                      onClick={(e) => { e.stopPropagation(); onDelete(capsule.code); }}
                      title="删除"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </td>
                </tr>
              )).reduce<React.ReactNode[]>((acc, row, i) => {
                acc.push(row)
                if (expandedCode === capsules[i].code && capsules[i].content) {
                  acc.push(
                    <tr key={`${capsules[i].code}-content`} style={{ background: 'rgba(0,240,255,0.03)' }}>
                      <td colSpan={6} style={{ padding: '1rem 2rem', borderBottom: '1px solid var(--glass-border)' }}>
                        <p style={{ whiteSpace: 'pre-wrap', color: 'var(--text-secondary)' }}>{capsules[i].content}</p>
                      </td>
                    </tr>
                  )
                }
                return acc
              }, [])}
            </tbody>
          </table>
        </div>
      )}

      {pageInfo.totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '1.5rem' }}>
          <button
            className="btn btn-outline btn-sm"
            disabled={pageInfo.number === 0}
            onClick={() => onPage(pageInfo.number - 1)}
          >上一页</button>
          <span className="mono-font" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            {pageInfo.number + 1} / {pageInfo.totalPages}
          </span>
          <button
            className="btn btn-outline btn-sm"
            disabled={pageInfo.number >= pageInfo.totalPages - 1}
            onClick={() => onPage(pageInfo.number + 1)}
          >下一页</button>
        </div>
      )}
    </div>
  )
}
