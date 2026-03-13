import { createPortal } from 'react-dom'
import styles from './ConfirmDialog.module.css'

interface Props {
  visible: boolean
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDialog({ visible, title, message, onConfirm, onCancel }: Props) {
  if (!visible) return null

  return createPortal(
    <div className="overlay" onClick={e => { if (e.target === e.currentTarget) onCancel() }}>
      <div className="dialog">
        <h3 className={styles.dialogTitle}>{title}</h3>
        <p className={`${styles.dialogMessage} text-secondary`}>{message}</p>
        <div className="dialog-actions flex justify-end gap-3">
          <button className="btn btn-secondary" onClick={onCancel}>取消</button>
          <button className="btn btn-primary" onClick={onConfirm}>确认</button>
        </div>
      </div>
    </div>,
    document.body
  )
}
