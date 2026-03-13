import type { Capsule } from '@/types'
import CountdownClock from './CountdownClock'
import styles from './CapsuleCard.module.css'

interface Props {
  capsule: Capsule
  onExpired?: () => void
}

export default function CapsuleCard({ capsule, onExpired }: Props) {
  function formatTime(iso: string): string {
    return new Date(iso).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className={`card ${styles.capsuleCard}`}>
      <div className="card-header flex items-center justify-between">
        <h3 className="card-title">{capsule.title}</h3>
        <span className={`badge ${capsule.opened ? 'badge-success' : 'badge-warning'}`}>
          {capsule.opened ? '已开启' : '未到时间'}
        </span>
      </div>

      <div className={`${styles.capsuleMeta} text-sm text-secondary`}>
        <span>发布者: {capsule.creator}</span>
        <span>胶囊码: {capsule.code}</span>
      </div>

      <div className={`${styles.capsuleTimes} text-sm text-secondary`}>
        <span>创建于: {formatTime(capsule.createdAt)}</span>
        <span>开启于: {formatTime(capsule.openAt)}</span>
      </div>

      {capsule.opened && capsule.content ? (
        <div className={styles.capsuleContent}>
          <p>{capsule.content}</p>
        </div>
      ) : !capsule.opened ? (
        <div className={`${styles.capsuleLocked} text-center`}>
          <p className={styles.lockIcon}>&#128274;</p>
          <p className="text-secondary">胶囊尚未到开启时间</p>
          <CountdownClock targetIso={capsule.openAt} onExpired={onExpired} />
        </div>
      ) : null}
    </div>
  )
}
