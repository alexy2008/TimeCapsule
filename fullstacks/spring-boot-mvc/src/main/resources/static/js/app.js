function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme)
}

function resolveTheme() {
  const saved = localStorage.getItem('theme')
  if (saved === 'dark' || saved === 'light') {
    return saved
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function setupThemeToggle() {
  applyTheme(resolveTheme())
  const button = document.querySelector('[data-theme-toggle]')
  if (!button) return
  button.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'
    localStorage.setItem('theme', next)
    applyTheme(next)
  })
}

function setupAboutSecretEntry() {
  const trigger = document.querySelector('[data-secret-admin]')
  if (!trigger) return
  let clicks = 0
  trigger.addEventListener('click', () => {
    clicks += 1
    if (clicks >= 5) {
      window.location.href = '/admin'
    }
    window.setTimeout(() => {
      clicks = 0
    }, 1800)
  })
}

function setupCreateConfirm() {
  const form = document.querySelector('[data-create-form]')
  const dialog = document.querySelector('[data-confirm-dialog]')
  if (!form || !dialog) return

  let confirmed = false
  form.addEventListener('submit', (event) => {
    if (confirmed) {
      confirmed = false
      return
    }
    event.preventDefault()
    dialog.classList.add('is-open')
    document.body.classList.add('dialog-open')
  })

  dialog.querySelector('[data-dialog-cancel]')?.addEventListener('click', () => {
    dialog.classList.remove('is-open')
    document.body.classList.remove('dialog-open')
  })

  dialog.querySelector('[data-dialog-confirm]')?.addEventListener('click', () => {
    confirmed = true
    dialog.classList.remove('is-open')
    document.body.classList.remove('dialog-open')
    form.requestSubmit()
  })
}

function setupCodeCopy() {
  const button = document.querySelector('[data-copy-code]')
  if (!button) return
  button.addEventListener('click', async () => {
    const value = button.getAttribute('data-copy-code')
    if (!value) return
    await navigator.clipboard.writeText(value)
    const text = button.textContent
    button.textContent = '已复制'
    window.setTimeout(() => {
      button.textContent = text
    }, 1500)
  })
}

function formatCountdownParts(target) {
  const diff = target.getTime() - Date.now()
  if (diff <= 0) {
    return null
  }
  const totalSeconds = Math.floor(diff / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return [days, hours, minutes, seconds].map((value) => String(value).padStart(2, '0'))
}

function setupCountdown() {
  const countdown = document.querySelector('[data-countdown-target]')
  if (!countdown) return

  const targetValue = countdown.getAttribute('data-countdown-target')
  const target = targetValue ? new Date(targetValue) : null
  if (!target || Number.isNaN(target.getTime())) return

  const status = document.querySelector('[data-countdown-status]')
  const blocks = countdown.querySelectorAll('[data-countdown-block]')
  const update = () => {
    const parts = formatCountdownParts(target)
    if (!parts) {
      if (status) {
        status.textContent = '时间已到，胶囊即将开启…'
      }
      window.clearInterval(timer)
      window.setTimeout(() => window.location.reload(), 2500)
      return
    }
    blocks.forEach((block, index) => {
      block.textContent = parts[index] || '00'
    })
  }

  update()
  const timer = window.setInterval(update, 1000)
}

document.addEventListener('DOMContentLoaded', () => {
  setupThemeToggle()
  setupAboutSecretEntry()
  setupCreateConfirm()
  setupCodeCopy()
  setupCountdown()
})
