import { useState } from 'react'
import type { Capsule, PageData } from '@/types'
import styles from './CapsuleTable.module.css'

interface Props {
  capsules: Capsule[]
  pageInfo: Omit<PageData<Capsule>, 'content'>
  loading?: boolean
  onDelete: (code: string) => void
  onPage: (page: number) => void
  onRefresh: () => void
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function CapsuleTable({ capsules, pageInfo, loading, onDelete, onPage, onRefresh }: Props) {
  const [expandedCode, setExpandedCode] = useState<string | null>(null)

  function toggleExpand(code: string) {
    setExpandedCode(prev => prev === code ? null : code)
  }

  return (
    <div className={styles.capsuleTableWrapper}>
      <div className="table-header flex items-center justify-between mb-4">
        <h3>胶囊列表 ({pageInfo.totalElements} 条)</h3>
        <button className="btn btn-secondary btn-sm" onClick={onRefresh}>刷新</button>
      </div>

      {loading ? (
        <div className="text-center py-8 text-secondary">加载中...</div>
      ) : capsules.length === 0 ? (
        <div className="text-center py-8 text-secondary">暂无胶囊</div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>胶囊码</th>
              <th>标题</th>
              <th>发布者</th>
              <th>开启时间</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {capsules.map(capsule => (
              <tr key={capsule.code}>
                <td className={styles.codeCell}>{capsule.code}</td>
                <td>{capsule.title}</td>
                <td>{capsule.creator}</td>
                <td>{formatTime(capsule.openAt)}</td>
                <td>
                  <span className={`badge ${capsule.opened ? 'badge-success' : 'badge-warning'}`}>
                    {capsule.opened ? '已开启' : '未开启'}
                  </span>
                </td>
                <td className={styles.actionsCell}>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => toggleExpand(capsule.code)}
                  >
                    {expandedCode === capsule.code ? '收起' : '查看'}
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => onDelete(capsule.code)}>删除</button>
                </td>
              </tr>
            )).reduce<React.ReactNode[]>((acc, row, i) => {
              acc.push(row)
              if (expandedCode === capsules[i].code) {
                acc.push(
                  <tr key={`${capsules[i].code}-content`} className={styles.contentRow}>
                    <td colSpan={6}>
                      <div className={styles.contentPreview}>
                        <p className={styles.contentLabel}>内容：</p>
                        <p className={styles.contentText}>{capsules[i].content}</p>
                      </div>
                    </td>
                  </tr>
                )
              }
              return acc
            }, [])}
          </tbody>
        </table>
      )}

      {pageInfo.totalPages > 1 && (
        <div className="pagination flex items-center justify-center gap-2 mt-4">
          <button
            className="btn btn-secondary btn-sm"
            disabled={pageInfo.number === 0}
            onClick={() => onPage(pageInfo.number - 1)}
          >上一页</button>
          <span className="text-sm text-secondary">
            {pageInfo.number + 1} / {pageInfo.totalPages}
          </span>
          <button
            className="btn btn-secondary btn-sm"
            disabled={pageInfo.number >= pageInfo.totalPages - 1}
            onClick={() => onPage(pageInfo.number + 1)}
          >下一页</button>
        </div>
      )}
    </div>
  )
}
