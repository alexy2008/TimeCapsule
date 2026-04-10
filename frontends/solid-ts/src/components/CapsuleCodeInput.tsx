interface CapsuleCodeInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit: (code: string) => void
  loading?: boolean
  error?: string | null
}

export default function CapsuleCodeInput(props: CapsuleCodeInputProps) {
  function submit() {
    if (props.value.length === 8) {
      props.onSubmit(props.value)
    }
  }

  return (
    <div class="search-container cyber-glass center-card">
      <p class="mb-6">输入8位胶囊码开启您的时间胶囊。</p>
      <div class="search-input-wrapper">
        <input
          type="text"
          class="cyber-input search-input mono-font text-center"
          placeholder="        "
          maxLength={8}
          value={props.value}
          onInput={event => props.onChange(event.currentTarget.value)}
          onKeyUp={event => event.key === 'Enter' && submit()}
          autocomplete="off"
        />
        <div class="search-line-effect"></div>
      </div>
      {props.error && <p style={{ color: 'var(--magenta)', 'margin-top': '1rem', 'text-align': 'center' }}>{props.error}</p>}
      <div class="action-row mt-6">
        <button class="btn btn-primary" onClick={submit} disabled={props.loading || props.value.length !== 8}>
          {props.loading ? '查询中...' : '开启胶囊'}
        </button>
      </div>
    </div>
  )
}
