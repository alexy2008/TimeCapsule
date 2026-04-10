import { Show } from 'solid-js'
import { Portal } from 'solid-js/web'
import styles from './ConfirmDialog.module.css'

interface ConfirmDialogProps {
  visible: boolean
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDialog(props: ConfirmDialogProps) {
  return (
    <Show when={props.visible}>
      <Portal>
        <div class={styles.overlay} onClick={event => event.target === event.currentTarget && props.onCancel()}>
          <div class={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="confirm-dialog-title">
            <h3 id="confirm-dialog-title" class={styles.dialogTitle}>
              {props.title}
            </h3>
            <p class={`${styles.dialogMessage} text-secondary`}>{props.message}</p>
            <div class={styles.actions}>
              <button class="btn btn-secondary" onClick={props.onCancel}>
                取消
              </button>
              <button class="btn btn-primary" onClick={props.onConfirm}>
                确认
              </button>
            </div>
          </div>
        </div>
      </Portal>
    </Show>
  )
}
