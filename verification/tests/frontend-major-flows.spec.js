const { test, expect } = require('@playwright/test')

const frontendName = process.env.FRONTEND_NAME || 'unknown'
const adminPassword = process.env.ADMIN_PASSWORD || 'timecapsule-admin'
const backendUrl = process.env.BACKEND_URL || 'http://localhost:8080'

function frameworkLogoSelector() {
  switch (frontendName) {
    case 'react-ts':
      return 'React Logo'
    case 'vue3-ts':
      return 'Vue Logo'
    case 'angular-ts':
      return 'Angular Logo'
    case 'svelte-ts':
      return 'Svelte Logo'
    case 'next-ts':
      return 'Next.js Logo'
    case 'nuxt-ts':
      return 'Nuxt Logo'
    case 'spring-boot-mvc':
      return 'Spring Boot Logo'
    default:
      return '前端框架 Logo'
  }
}

function frameworkLabel() {
  switch (frontendName) {
    case 'react-ts':
      return 'React'
    case 'vue3-ts':
      return 'Vue'
    case 'angular-ts':
      return 'Angular'
    case 'svelte-ts':
      return 'Svelte'
    case 'next-ts':
      return 'Next.js'
    case 'nuxt-ts':
      return 'Nuxt'
    case 'spring-boot-mvc':
      return 'Spring Boot'
    default:
      return ''
  }
}

function languageLabel() {
  return frontendName === 'spring-boot-mvc' ? 'Java' : 'TypeScript'
}

function languageLogoSelector() {
  return frontendName === 'spring-boot-mvc' ? 'Java Logo' : 'TypeScript Logo'
}

function isFullstackFrontend() {
  return frontendName === 'next-ts' || frontendName === 'nuxt-ts' || frontendName === 'spring-boot-mvc'
}

function futureDateTimeLocal() {
  const date = new Date(Date.now() + 24 * 60 * 60 * 1000)
  date.setSeconds(0, 0)
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000)
  return local.toISOString().slice(0, 16)
}

test.describe.configure({ mode: 'serial' })

test(`首页展示技术栈卡片 [${frontendName}]`, async ({ page }) => {
  await page.goto('/')

  const techCard = page.locator('.tech-stack-simple').first()

  await expect(page.getByRole('heading', { name: /封存此刻.*开启未来/ })).toBeVisible()
  await expect(page.getByText('TECHNOLOGY STACK')).toBeVisible()
  await expect(techCard).toContainText(languageLabel())
  await expect(techCard).toContainText(frameworkLabel())
  await expect(techCard).toContainText('SQLite')

  await expect(techCard.getByAltText(frameworkLogoSelector())).toBeVisible()
  await expect(techCard.getByAltText(languageLogoSelector())).toBeVisible()
  if (frontendName === 'spring-boot-mvc') {
    await expect(techCard).toContainText('Thymeleaf')
    await expect(techCard).toContainText('HTMX')
    await expect(techCard.getByAltText('Thymeleaf Logo')).toBeVisible()
    await expect(techCard.getByAltText('HTMX Logo')).toBeVisible()
    await expect(techCard.getByAltText('SQLite Logo')).toBeVisible()
  } else if (isFullstackFrontend()) {
    await expect(techCard.getByAltText('SQLite Logo')).toBeVisible()
  } else {
    await expect(techCard.getByAltText('后端框架 Logo')).toBeVisible()
    await expect(techCard.getByAltText('后端语言 Logo')).toBeVisible()
    await expect(techCard.getByAltText('数据库 Logo')).toBeVisible()
    await expect(techCard).toContainText(/SQLite|技术栈信息暂不可用|加载中|\?/)
  }
})

test(`创建胶囊并验证锁定态 [${frontendName}]`, async ({ page }) => {
  const title = `E2E-${frontendName}-${Date.now()}`
  const content = `browser-flow-${frontendName}-${Date.now()}`
  const creator = 'Playwright'

  await page.goto('/')
  const createEntry = page.getByRole('button', { name: '创建胶囊' }).or(page.getByRole('link', { name: '创建胶囊' }))
  await createEntry.click()

  await page.getByLabel('标题').fill(title)
  await page.getByLabel('内容').fill(content)
  await page.getByLabel(/发布者|创建者/).fill(creator)
  await page.getByLabel(/开启时间|解锁时间/).fill(futureDateTimeLocal())

  await page.getByRole('button', { name: '封存胶囊' }).click()
  await page.getByRole('button', { name: '确认' }).click()

  await expect(page.getByRole('heading', { name: '胶囊创建成功' })).toBeVisible()

  const codeDisplay = page.locator('.code-display').first()
  const hasCodeDisplay = (await codeDisplay.count()) > 0
  const rawCodeText = hasCodeDisplay
    ? await codeDisplay.textContent()
    : await page.locator('body').textContent()
  const normalizedCodeText = (rawCodeText || '').replace(/\s+/g, '')
  const codeMatch = normalizedCodeText.match(/\b[A-Z0-9]{8}\b/)
  expect(codeMatch).not.toBeNull()
  const capsuleCode = codeMatch[0]

  await page.goto('/')
  const openEntry = page.getByRole('button', { name: '开启胶囊' }).or(page.getByRole('link', { name: '开启胶囊' }))
  await openEntry.click()
  await page.locator('input[maxlength="8"]').fill(capsuleCode)
  await page.getByRole('button', { name: '开启胶囊' }).click()

  await expect(page.getByText(title)).toBeVisible()
  await expect(page.getByText('未到时间')).toBeVisible()
  await expect(page.getByText(content)).toHaveCount(0)
})

test(`到时间后成功打开胶囊 [${frontendName}]`, async ({ page, request }) => {
  const title = `Timed-${frontendName}-${Date.now()}`
  const content = `timed-open-${frontendName}-${Date.now()}`
  const createResponse = await request.post(`${backendUrl}/api/v1/capsules`, {
    data: {
      title,
      content,
      creator: 'Playwright',
      openAt: new Date(Date.now() + 5000).toISOString(),
    },
  })

  expect(createResponse.ok()).toBeTruthy()
  const createBody = await createResponse.json()
  expect(createBody.success).toBeTruthy()

  const capsuleCode = createBody.data.code

  await page.goto('/')
  const openEntry = page.getByRole('button', { name: '开启胶囊' }).or(page.getByRole('link', { name: '开启胶囊' }))
  await openEntry.click()
  await page.locator('input[maxlength="8"]').fill(capsuleCode)
  await page.getByRole('button', { name: '开启胶囊' }).click()

  await expect(page.getByText(title)).toBeVisible()

  const openedBadge = page.locator('.badge-unlocked, .badge-success').filter({ hasText: /已开启|已解锁/ }).first()
  const lockedBadge = page.getByText('未到时间')

  if (await lockedBadge.count()) {
    await expect(lockedBadge).toBeVisible()
    await expect(page.getByText('时间已到，胶囊即将开启…')).toBeVisible({ timeout: 15000 })
  }

  await expect(page.getByText(content)).toBeVisible({ timeout: 10000 })
  await expect(openedBadge).toBeVisible()
})

test(`隐藏入口进入管理员并登录 [${frontendName}]`, async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: '关于' }).click()

  const secretTrigger = page.getByRole('button', { name: '隐藏管理入口' }).or(page.locator('.tech-orb').first())
  await expect(secretTrigger).toBeVisible()

  for (let i = 0; i < 5; i += 1) {
    await secretTrigger.click()
  }

  await expect(page.getByRole('heading', { name: '管理员登录' })).toBeVisible()
  await page.getByLabel(/管理员密码|密码/).fill(adminPassword)
  await page.getByRole('button', { name: '登录' }).click()

  await expect(page.getByRole('heading', { name: '管理员登录' })).toHaveCount(0)
  await expect(page.getByRole('heading', { name: /胶囊列表/ })).toBeVisible()
  await expect(page.getByRole('button', { name: '退出登录' })).toBeVisible()
})
