import { For, Show, createSignal } from 'solid-js'
import type { Capsule, PageData } from '@/types'

interface CapsuleTableProps {
  capsules: Capsule[]
  pageInfo: Omit<PageData<Capsule>, 'content'>
  loading?: boolean
  onDelete: (code: string) => void
  onPage: (page: number) => void
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function CapsuleTable(props: CapsuleTableProps) {
  const [expandedCode, setExpandedCode] = createSignal<string | null>(null)

  function toggleExpand(code: string) {
    setExpandedCode(current => (current === code ? null : code))
  }

  return (
    <div>
      <Show
        when={!props.loading}
        fallback={<div class="text-center" style={{ padding: '2rem', color: 'var(--text-secondary)' }}>加载中...</div>}
      >
        <Show
          when={props.capsules.length > 0}
          fallback={<div class="text-center" style={{ padding: '2rem', color: 'var(--text-secondary)' }}>暂无胶囊</div>}
        >
          <div class="table-responsive">
            <table class="cyber-table">
              <thead>
                <tr>
                  <th>标识码 (ID)</th>
                  <th>数据标题</th>
                  <th>发布者</th>
                  <th>开启时间</th>
                  <th>当前状态</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <For each={props.capsules}>
                  {capsule => (
                    <>
                      <tr onClick={() => toggleExpand(capsule.code)} style={{ cursor: 'pointer' }}>
                        <td class="mono-font cyan-text">{capsule.code}</td>
                        <td>{capsule.title}</td>
                        <td class="mono-font">{capsule.creator}</td>
                        <td class="mono-font">{formatTime(capsule.openAt)}</td>
                        <td>
                          <span class={`badge ${capsule.opened ? 'badge-unlocked' : 'badge-locked'}`}>
                            {capsule.opened ? '已解密' : '锁定'}
                          </span>
                        </td>
                        <td>
                          <button
                            class="btn btn-icon btn-danger-outline"
                            onClick={event => {
                              event.stopPropagation()
                              props.onDelete(capsule.code)
                            }}
                            title="删除"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <polyline points="3 6 5 6 21 6"></polyline>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                          </button>
                        </td>
                      </tr>
                      <Show when={expandedCode() === capsule.code && capsule.content}>
                        <tr style={{ background: 'rgba(0,240,255,0.03)' }}>
                          <td colSpan={6} style={{ padding: '1rem 2rem', 'border-bottom': '1px solid var(--glass-border)' }}>
                            <p style={{ 'white-space': 'pre-wrap', color: 'var(--text-secondary)' }}>{capsule.content}</p>
                          </td>
                        </tr>
                      </Show>
                    </>
                  )}
                </For>
              </tbody>
            </table>
          </div>
        </Show>
      </Show>

      <Show when={props.pageInfo.totalPages > 1}>
        <div style={{ display: 'flex', 'justify-content': 'center', 'align-items': 'center', gap: '1rem', 'margin-top': '1.5rem' }}>
          <button class="btn btn-outline btn-sm" disabled={props.pageInfo.number === 0} onClick={() => props.onPage(props.pageInfo.number - 1)}>
            上一页
          </button>
          <span class="mono-font" style={{ 'font-size': '0.85rem', color: 'var(--text-secondary)' }}>
            {props.pageInfo.number + 1} / {props.pageInfo.totalPages}
          </span>
          <button
            class="btn btn-outline btn-sm"
            disabled={props.pageInfo.number >= props.pageInfo.totalPages - 1}
            onClick={() => props.onPage(props.pageInfo.number + 1)}
          >
            下一页
          </button>
        </div>
      </Show>
    </div>
  )
}
