# HelloTime Nuxt 全栈实现 Review 报告

**Review 范围**: `fullstacks/nuxt-ts/`
**Review 时间**: 2026-04-13
**技术栈**: Nuxt 3 + Vue 3 + TypeScript + better-sqlite3 + jose (Nitro Server)
**运行端口**: 5178

---

## 1. 项目结构概览

```
fullstacks/nuxt-ts/
├── app.vue                          # 根组件（应用壳 + NuxtPage）
├── nuxt.config.ts                   # Nuxt 配置
├── pages/                           # 文件路由
│   ├── index.vue                    # 首页
│   ├── create.vue                   # 创建胶囊
│   ├── open/index.vue               # 输入胶囊码
│   ├── open/[code].vue              # 胶囊详情（SSR 取数）
│   ├── about.vue                    # 关于页
│   └── admin.vue                    # 管理面板
├── server/
│   ├── api/v1/                      # Nitro API 路由
│   │   ├── health.get.ts
│   │   ├── capsules/index.post.ts
│   │   ├── capsules/[code].get.ts
│   │   ├── admin/login.post.ts
│   │   ├── admin/capsules/index.get.ts
│   │   └── admin/capsules/[code].delete.ts
│   └── utils/                       # 服务端共享模块
│       ├── db.ts                    # SQLite 连接 + 全局单例
│       ├── config.ts                # 环境变量
│       ├── auth.ts                  # JWT (jose)
│       ├── capsules.ts              # 胶囊 CRUD
│       ├── validation.ts            # 输入校验
│       ├── http.ts                  # 统一响应格式
│       └── app-info.ts              # 技术栈声明
├── composables/                     # Vue 组合式函数
│   ├── useTheme.ts                  # 主题切换
│   ├── useAdmin.ts                  # 管理员状态
│   ├── useCapsule.ts                # 胶囊操作
│   ├── useCountdown.ts              # 倒计时
│   └── useTechStack.ts              # 技术栈取数
├── components/                      # UI 组件（10 个）
├── middleware/admin-session.ts      # 路由中间件
├── plugins/theme.ts                 # 主题初始化插件
├── types/index.ts                   # 共享类型定义
├── utils/
│   ├── api.ts                       # 客户端 API 层
│   └── techStack.ts                 # 标签简化工具
└── assets/cyber.css                 # 共享设计系统
```

**评价**: 结构遵循 Nuxt 3 约定，`pages/` 文件路由、`server/api/` 路由、`composables/` 组织合理。前端 API 层通过 `/api/v1/*` 访问 Nitro 服务端，形成与前后端分离实现的对照阅读价值。

---

## 2. 逐文件分析

### 2.1 核心配置

#### `nuxt.config.ts` ✅ 正确

```ts
export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: true },
  css: ['~/assets/cyber.css'],
  nitro: { experimental: { tasks: false } },
  routeRules: { '/api/**': { cors: true } },
})
```

- 配置简洁，CORS 规则正确覆盖所有 API 路径。
- `compatibilityDate` 设置合理，启用 devtools 便于开发。
- **未配置** `serverExternalPackages`：Nuxt 3 的 Nitro 通常自动处理 `better-sqlite3`，但显式声明会更安全。实际构建已验证通过，属于低风险。

#### `package.json` ✅ 正确

- Nuxt `^3.17.5`、better-sqlite3 `^12.4.1`、jose `^6.1.0`，依赖干净。
- `@types/better-sqlite3` 在 devDependencies 中，类型支持完整。
- 无多余依赖。

#### `tsconfig.json` ✅ 正确

- 仅继承 `.nuxt/tsconfig.json`，Nuxt 自动生成路径别名，无需手动配置。

---

### 2.2 服务端模块 (`server/utils/`)

#### `config.ts` ⚠️ 格式不规范

```ts
export const ADMIN_PASSWORD=proces...WORD || 'timecapsule-admin'
export const JWT_SECRET=proces...CRET || 'hellotime-nuxt-fullstack-secret'
```

- 硬编码默认密码和 JWT 密钥，与其他全栈实现一致，demo 项目可接受。
- **问题**: 等号两侧缺少空格，`proces...WORD` 疑似文件内容截断显示问题，实际代码应为 `process.env.ADMIN_PASSWORD`。
- **建议**: 添加注释说明"仅为开发环境提供默认值，生产部署必须设置环境变量"。

#### `db.ts` ✅ 设计优秀

```ts
declare global {
  var __hellotimeNuxtDb: Database.Database | undefined
}
const db = globalThis.__hellotimeNuxtDb || createDatabase()
```

- 使用 `globalThis` 单例避免 HMR 重复创建连接，这是 Nuxt/Next 全栈项目的标准模式。
- WAL 模式 + 索引配置与契约一致。
- 注释"和 Next 版本一样启用 WAL，便于读者对照两套全栈实现的数据库初始化方式"体现了跨技术栈对照价值。

#### `auth.ts` ✅ 设计良好

- 使用 `jose`（纯 JS JWT 库），避免 native addon 依赖，与 Next 版本一致。
- `createAdminToken()` 设置 2h 过期，`verifyAdminToken()` 校验 `role: 'admin'`。
- **注释**: "Nuxt 全栈实现与 Next 一样把管理员态收敛到 cookie"——很好地解释了跨技术栈对应关系。

#### `capsules.ts` ✅ 实现完整

- `createUniqueCapsuleCode()` 8 位大写字母数字，最多重试 10 次。
- `toCapsule()` 根据 `open_at` 与当前时间比较确定 `opened` 状态，控制 `content` 可见性。
- 分页查询包含 `COUNT(*)` + `LIMIT/OFFSET`，`safeSize` 上限 100。
- **注释**: 每个导出函数职责明确，与 API 契约对齐。

#### `validation.ts` ✅ 校验完整

- 校验所有必填字段、长度限制（title 100, creator 30）、时间格式、未来时间。
- `validateCode()` 使用 `/^[A-Z0-9]{8}$/`，与 OpenAPI 规范一致。
- 返回联合类型 `{ error } | { value }`，比抛异常更类型安全。

#### `http.ts` ✅ 标准统一

- `success()` 和 `failure()` 收敛所有响应为 `{ success, data, message?, errorCode? }`。
- `failure` 设置 HTTP 状态码通过 `setResponseStatus`，错误码语义清晰。

#### `app-info.ts` ✅ 正确

```ts
export const BACKEND_TECH_STACK: TechStack = {
  framework: 'Nuxt 3 + Nitro',
  language: 'TypeScript 5',
  database: 'SQLite',
}
```

- 固定三项，与功能要求一致。

---

### 2.3 API 路由 (`server/api/v1/`)

#### `GET /api/v1/health` ✅ 完全合规

- 返回 `{ status: 'UP', timestamp, techStack }`，与 health schema 一致。
- 实现简洁，直接使用 `success()` 工具函数。

#### `POST /api/v1/capsules` ✅ 完全合规

- JSON 解析有 try-catch，返回 `INVALID_JSON` 错误码。
- 校验失败返回 `VALIDATION_ERROR`，400 状态码。
- 创建成功返回 `success(insertCapsule(...), '胶囊创建成功')`。
- **注释质量好**: "Nuxt server api 和 Next Route Handler 一样，先做协议层解析，再交给共享校验逻辑。"

#### `GET /api/v1/capsules/[code]` ✅ 完全合规

- 胶囊码归一化为大写，格式校验 + 查库 + 404 处理链路清晰。

#### `POST /api/v1/admin/login` ✅ 完全合规

- 密码校验 → JWT 签发 → 返回 `{ token }` + 消息。
- 注意：此实现**不设置 cookie**，token 仅通过响应体返回。前端 `useAdmin` 用 `useCookie` 保存。这与 Next 版本（服务端设置 httpOnly cookie）有差异，详见下文分析。

#### `GET /api/v1/admin/capsules` ⚠️ 认证逻辑可提取

- `ensureAuthorized` 函数在此文件内定义。
- **问题**: 与 `admin/capsules/[code].delete.ts` 中的 `ensureAuthorized` 完全重复。

#### `DELETE /api/v1/admin/capsules/[code]` ✅ 完全合规

- 同样存在 `ensureAuthorized` 重复问题。
- 404 处理正确，删除后返回 `{ data: null, message: '删除成功' }`。

---

### 2.4 Composables

#### `useAdmin.ts` ✅ 实现完整

```ts
const token = useCookie<string | null>('admin_token', { sameSite: 'lax', default: () => null })
const isLoggedIn = computed(() => !!token.value)
```

- 使用 Nuxt `useCookie` 管理 token，SSR 客户端一致。
- `hydrateSession()` 用于 middleware 恢复登录态。
- 认证失效自动 logout，用户体验良好。

**注意点**: cookie 不是 httpOnly，意味着客户端 JS 可以读取 token。这与 Next 版本（服务端设置 httpOnly cookie）形成对比。对于 demo 项目可接受，但与后端 API 的 Bearer token 认证方式一致（前端通过 cookie 携带 token，服务端从 header 读取）。

#### `useCapsule.ts` ✅ 正确

- 使用 `useState` 全局共享胶囊状态。
- `create`、`get`、`clear` 方法职责清晰。
- 注意：`open/[code].vue` 页面实际上使用 `useAsyncData` + `$fetch` 直接调用 API，而非通过此 composable 的 `get` 方法。此 composable 的 `get` 方法目前未被调用。

#### `useTheme.ts` ✅ 实现合理

```ts
const themeCookie = useCookie<Theme>('theme', { sameSite: 'lax', default: () => 'light' })
const theme = useState<Theme>('theme', () => themeCookie.value || 'light')
```

- cookie + useState 双重存储：cookie 负责 SSR 一致性，useState 负责响应式更新。
- `import.meta.client` 守卫确保 DOM 操作仅在客户端执行。
- **与 plugin/theme.ts 的关系**: plugin 负责初始化（读取 localStorage + 系统偏好），composable 负责切换逻辑。两者协作，职责略有重叠但功能互补。

#### `useCountdown.ts` ⚠️ 有潜在问题

```ts
const timer = setInterval(() => {
  const next = calc()
  time.value = next
  if (next.expired) clearInterval(timer)
}, 1000)

onUnmounted(() => clearInterval(timer))
```

- **SSR 问题**: `setInterval` 在服务端也会执行（因为直接在函数体中创建），但服务端的组件生命周期中 `onUnmounted` 不会触发，可能导致内存泄漏或无意义的计算。建议用 `onMounted` 包裹 `setInterval`，或添加 `import.meta.client` 守卫。
- **响应式问题**: `targetIso` 是 props 传入的字符串，如果 prop 变化（虽然实际场景中不会），`setInterval` 不会重新创建。可用 `watch` 监听 prop 变化。

#### `useTechStack.ts` ⚠️ 未被使用

```ts
const { data } = await useAsyncData('tech-stack', () =>
  $fetch('/api/v1/health'), { server: true, lazy: false }
)
```

- 使用 `useAsyncData` 正确实现了 SSR 取数。
- **问题**: 此 composable 当前**未被任何页面或组件引用**。首页 (`index.vue`) 和关于页 (`about.vue`) 都硬编码了技术栈展示。`AppFooter` 也硬编码了 `['Nuxt', 'TypeScript', 'SQLite']`。此 composable 要么应被集成使用，要么应被移除以避免死代码。

---

### 2.5 页面组件

#### `pages/index.vue` ✅ 首页

- 导航卡片链接到 `/create` 和 `/open`，交互清晰。
- 技术栈展示硬编码 3 项，符合功能要求。
- `useSeoMeta` 设置页面元数据。

#### `pages/create.vue` ✅ 创建页

- 表单提交 → ConfirmDialog 确认 → API 调用 → 成功展示胶囊码。
- 一键复制功能完整。
- 错误处理覆盖网络异常和业务错误。

#### `pages/open/index.vue` ✅ 输入页

- 使用 `CapsuleCodeInput` 组件，输入胶囊码后导航到 `/open/[code]`。

#### `pages/open/[code].vue` ✅ SSR 取数优秀

```ts
const { data, pending, refresh } = await useAsyncData(
  () => `capsule-${routeCode.value}`,
  async () => {
    const response = await $fetch<ApiResponse<Capsule>>(`/api/v1/capsules/${routeCode.value}`)
    return response.data
  },
  { watch: [routeCode], server: true, lazy: false }
)
```

- **这是 Nuxt 全栈实现的核心亮点**: `useAsyncData` + `server: true` 实现 SSR 首屏取数，用户直接看到胶囊详情而非加载状态。
- `watch: [routeCode]` 确保路由参数变化时自动重新取数。
- 倒计时结束后 `refresh()` 自动重新查询，当 `openAt` 到达时内容自动解锁。

#### `pages/about.vue` ✅ 实现完整

- 隐藏管理入口：连续点击技术球 5 次导航到 `/admin`，与项目其他实现一致。
- 技术栈展示硬编码 3 项。
- 功能描述文字内容丰富。

#### `pages/admin.vue` ✅ 管理面板

```ts
definePageMeta({ middleware: ['admin-session'] })
```

- 使用 Nuxt route middleware 恢复管理员会话。
- 登录 → 列表展示 → 分页 → 删除确认，功能完整。

---

### 2.6 Components

#### `AppHeader.vue` ✅ 简洁

- Logo + 导航 + 主题切换，响应式适配。

#### `AppFooter.vue` ⚠️ 可优化

```ts
const summary = ['Nuxt', 'TypeScript', 'SQLite'].join(' · ')
```

- 技术栈信息硬编码，与 `useTechStack` composable 和 `app-info.ts` 存在三处声明同一信息。建议统一从 composable 获取或统一使用硬编码但添加注释说明选择。

#### `ThemeToggle.vue` ✅ 正确

- 调用 `useTheme` 的 `toggle` 方法，太阳/月亮图标切换。

#### `CapsuleForm.vue` ✅ 前端校验完整

- 所有字段的前端校验（空值、时间格式、未来时间）。
- `minDateTime` 限制 datetime-local 输入。
- `reactive` 管理表单状态和错误信息。

#### `CapsuleCard.vue` ✅ 视觉效果丰富

- 解锁/锁定两种状态，解锁时有解密动画。
- `formatTime` 函数在此组件内定义。

#### `CapsuleCodeInput.vue` ✅ 正确

- v-model 支持，8 位胶囊码限制。

#### `CapsuleTable.vue` ✅ 功能完整

- 分页、行展开显示内容、删除按钮、状态徽章。
- `formatTime` 函数在此组件内重复定义。

#### `CountdownClock.vue` ✅ 实现良好

- 使用 `useCountdown` composable，天/时/分/秒显示。
- 倒计时结束后延迟 3 秒触发 `expired` 事件，体验良好。

#### `ConfirmDialog.vue` ✅ 正确

- `Teleport to="body"`，遮罩层点击取消，标准对话框模式。

#### `AdminLogin.vue` ✅ 简洁

- 表单提交 + loading/error 状态。

---

### 2.7 Middleware & Plugins

#### `middleware/admin-session.ts` ⚠️ 设计说明不足

```ts
export default defineNuxtRouteMiddleware(async () => {
  const { hydrateSession } = useAdmin()
  await hydrateSession()
})
```

- 仅在 admin 页面使用，职责是"恢复管理员会话状态"（如果有 cookie 尝试取数验证）。
- **与 Next 版本 middleware 的对比**: Next 版 middleware 负责 token 无效时清理 cookie，Nuxt 版 middleware 负责 hydrate 会话。两者职责不同但互补。
- **建议**: 添加注释说明"此 middleware 不阻断未认证用户访问，实际鉴权在 API 层完成"。

#### `plugins/theme.ts` ✅ 初始化逻辑完整

- SSR 阶段：从 cookie 读取主题。
- 客户端阶段：优先 localStorage → cookie → 系统偏好 → 默认 light。
- DOM 操作仅在客户端执行。

---

### 2.8 客户端 API 层 (`utils/api.ts`)

#### ✅ 设计优秀

- 统一的 `request<T>` 封装处理 HTTP 状态码、JSON 解析、错误抛出。
- 6 个导出函数对应 6 个 API 端点，接口签名清晰。
- 管理员操作通过 `Authorization: Bearer ${token}` header 认证，与服务端 API 一致。

**注意**: 与 Next 版本的区别——Next 版本的管理员操作自动携带 cookie（httpOnly），Nuxt 版本的管理员操作通过手动传递 token（从 `useAdmin` 的 cookie 中读取后拼 header）。两者都能工作，但认证方式不同。

---

### 2.9 类型定义 (`types/index.ts`)

#### ✅ 完整且规范

- `Capsule`、`CreateCapsuleForm`、`ApiResponse<T>`、`PageData<T>`、`AdminToken`、`TechStack`、`HealthInfo` 共 7 个接口。
- 与 OpenAPI 规范完全对齐。
- 中文注释清晰说明每个字段含义。

---

## 3. 契约一致性检查（vs OpenAPI 规范）

| 端点 | OpenAPI 定义 | 实现 | 状态 |
|------|-------------|------|------|
| `GET /health` | 返回 `{ success, data: { status, timestamp, techStack } }` | ✅ 完全一致 | ✅ |
| `POST /capsules` | 请求 `{ title, content, creator, openAt }`，返回 201 + 胶囊对象 + message | ✅ 完全一致 | ✅ |
| `GET /capsules/{code}` | 返回 200 + 胶囊详情（content 受 openAt 控制），404 | ✅ 完全一致 | ✅ |
| `POST /admin/login` | 请求 `{ password }`，返回 `{ success, data: { token }, message }`，401 | ✅ 完全一致 | ✅ |
| `GET /admin/capsules` | BearerAuth，分页参数，返回分页数据，401 | ✅ 完全一致 | ✅ |
| `DELETE /admin/capsules/{code}` | BearerAuth，返回 `{ success, data: null, message }`，401/404 | ✅ 完全一致 | ✅ |

**6 个核心端点全部通过契约验证。** 错误码命名（`VALIDATION_ERROR`、`CAPSULE_NOT_FOUND`、`UNAUTHORIZED` 等）与规范一致。

---

## 4. 发现的问题总结

### 🔴 严重问题（P0）

**无严重问题。** 项目实现完整，所有 API 端点和页面功能正常。

### 🟡 中等问题（P1）

| # | 问题 | 位置 | 描述 |
|---|------|------|------|
| 1 | `ensureAuthorized` 重复 | `admin/capsules/index.get.ts`, `admin/capsules/[code].delete.ts` | 完全相同的认证检查逻辑在两个文件中重复定义，应提取到 `server/utils/auth.ts` |
| 2 | `useTechStack` 死代码 | `composables/useTechStack.ts` | 未被任何页面或组件引用，首页/关于页/页脚都硬编码技术栈信息 |
| 3 | `useCountdown` SSR 风险 | `composables/useCountdown.ts` | `setInterval` 在函数体中直接创建，服务端也会执行。建议用 `onMounted` 包裹或添加 `import.meta.client` 守卫 |
| 4 | `useCapsule.get` 未使用 | `composables/useCapsule.ts` | `open/[code].vue` 使用 `useAsyncData` 直接取数，此 composable 的 `get` 方法是死代码 |

### 🟢 建议改进（P2）

| # | 问题 | 位置 | 描述 |
|---|------|------|------|
| 5 | `formatTime` 重复 | `CapsuleCard.vue`, `CapsuleTable.vue` | 同样的时间格式化逻辑在两个组件中重复定义，建议提取为共享工具函数 |
| 6 | 技术栈信息三处声明 | `index.vue`, `AppFooter.vue`, `useTechStack.ts` | 同一信息在页面硬编码、组件硬编码和 composable 中各声明一次，建议统一 |
| 7 | `config.ts` 缺少环境变量注释 | `server/utils/config.ts` | 硬编码默认密码处应添加"仅限开发环境"的警告注释 |
| 8 | `Math.random()` 安全性 | `server/utils/capsules.ts` | `createUniqueCapsuleCode` 使用 `Math.random()`，非加密安全。Demo 项目可接受，建议注释说明 |
| 9 | admin middleware 设计意图不清晰 | `middleware/admin-session.ts` | 建议添加注释说明"此 middleware 仅 hydrate 会话，不阻断未认证访问" |
| 10 | admin token cookie 非 httpOnly | `composables/useAdmin.ts` | `useCookie('admin_token')` 是客户端可读的 cookie，与 Next 版本的 httpOnly cookie 方案不同。建议注释说明设计选择 |

---

## 5. 设计亮点

### 5.1 useAsyncData SSR 首屏取数 ⭐

```ts
// pages/open/[code].vue
const { data } = await useAsyncData(
  () => `capsule-${routeCode.value}`,
  async () => {
    const response = await $fetch<ApiResponse<Capsule>>(`/api/v1/capsules/${routeCode.value}`)
    return response.data
  },
  { watch: [routeCode], server: true, lazy: false }
)
```

- **Nuxt 全栈的核心亮点**: 利用 `useAsyncData` + `server: true` 在 SSR 阶段直接通过内部 `$fetch` 调用 Nitro API，首屏即渲染完整胶囊详情。
- 与前后端分离实现（客户端必须先请求外部 API）形成鲜明对比。
- `watch: [routeCode]` 实现路由参数响应式更新，这是 Nuxt 3 的高级用法。

### 5.2 全局单例数据库

```ts
var __hellotimeNuxtDb: Database.Database | undefined
const db = globalThis.__hellotimeNuxtDb || createDatabase()
```

- 与 Next 版本的 `globalThis` 模式完全一致，体现跨技术栈对照。

### 5.3 统一 API 客户端层

- 虽然前后端同仓，但 `utils/api.ts` 通过 `/api/v1/*` 路径访问 Nitro 服务端。
- 与前后端分离实现的 `api/index.ts` 接口签名一致，保持学习对照价值。

### 5.4 主题初始化的 SSR 兼容

- `plugins/theme.ts` 处理 SSR/客户端初始化逻辑（cookie → localStorage → 系统偏好）。
- `useTheme` composable 处理运行时切换。
- `app.vue` 的 `useHead` 在 SSR 首屏设置 `data-theme` 属性，避免闪烁。

### 5.5 跨技术栈注释质量

注释不仅解释"是什么"，还解释"为什么"和"与其他技术栈如何对应"：

- "和 Next 版本一样启用 WAL，便于读者对照两套全栈实现的数据库初始化方式。"
- "Nuxt 全栈实现与 Next 一样把管理员态收敛到 cookie，页面和 server api 都围绕同一份 token 工作。"
- "相比分离版前台，全栈架构下的组件具有感知系统栈的能力。"

---

## 6. 与 Next.js 全栈实现对比

| 特性 | Nuxt 全栈 | Next.js 全栈 | 对比 |
|------|----------|-------------|------|
| SSR 取数 | `useAsyncData` + `server: true` | Server Component 直接查库 | 两者都实现首屏零闪动，方式不同 |
| API 路由 | `server/api/v1/*.ts` (Nitro) | `app/api/v1/*/route.ts` | Nuxt 的文件命名更简洁 |
| 状态管理 | `useState` + `useCookie` | React `useState` + cookie | Nuxt 的 `useState` 自动 SSR 同步 |
| 认证方式 | cookie（非 httpOnly）+ Bearer header | httpOnly cookie + Bearer header | Next 版本安全性更高 |
| 主题初始化 | plugin + composable | `Script beforeInteractive` | Nuxt 的 plugin 更结构化 |
| Middleware | `defineNuxtRouteMiddleware` (hydrate) | `NextResponse` (cookie 清理) | 职责不同但互补 |
| 数据库全局单例 | `globalThis.__hellotimeNuxtDb` | `globalThis.__hellotimeNextDb` | 模式完全一致 |
| 死代码 | `useTechStack` composable 未使用 | 无明显死代码 | Nuxt 版本需清理 |

---

## 7. 评分

| 维度 | 分数 | 说明 |
|------|------|------|
| 代码质量 | ⭐⭐⭐⭐ | Nuxt 3 组合良好，server/api 路由清晰，useAsyncData 使用正确。扣一分因 ensureAuthorized 重复和死代码 |
| 风格 | ⭐⭐⭐⭐⭐ | 符合 Nuxt/Vue 3 最佳实践，composables 自动导入，文件路由约定标准 |
| 注释 | ⭐⭐⭐⭐⭐ | 中文注释丰富且有教学价值，跨技术栈对照注释是亮点 |
| 安全性 | ⭐⭐⭐⭐ | JWT 验证完整，cookie sameSite 配置正确。admin cookie 非 httpOnly 扣一分 |
| 契约一致性 | ⭐⭐⭐⭐⭐ | 6 个核心端点与 OpenAPI 规范完全一致 |
| 优化空间 | ⭐⭐⭐ | ensureAuthorized 重复、useTechStack 死代码、useCountdown SSR 风险、技术栈信息多处声明 |

**总体评价**: ⭐⭐⭐⭐ (4.3/5)

这是一个高质量的 Nuxt 3 全栈实现，充分利用了 `pages/` 文件路由、`useAsyncData` SSR 取数、Nitro server/api 等 Nuxt 核心特性。代码结构清晰，注释质量高，API 契约完全一致。主要改进空间在于：(1) 消除 `ensureAuthorized` 重复代码；(2) 清理 `useTechStack` 死代码或将技术栈信息统一为单一来源；(3) 修复 `useCountdown` 的 SSR 兼容性问题。

---

## 8. 附录：API 端点清单

| # | 方法 | 路径 | 状态码 | 认证 | 文件 |
|---|------|------|--------|------|------|
| 1 | GET | `/api/v1/health` | 200 | 无 | `server/api/v1/health.get.ts` |
| 2 | POST | `/api/v1/capsules` | 201/400 | 无 | `server/api/v1/capsules/index.post.ts` |
| 3 | GET | `/api/v1/capsules/:code` | 200/400/404 | 无 | `server/api/v1/capsules/[code].get.ts` |
| 4 | POST | `/api/v1/admin/login` | 200/401 | 无 | `server/api/v1/admin/login.post.ts` |
| 5 | GET | `/api/v1/admin/capsules` | 200/401 | Bearer | `server/api/v1/admin/capsules/index.get.ts` |
| 6 | DELETE | `/api/v1/admin/capsules/:code` | 200/401/404 | Bearer | `server/api/v1/admin/capsules/[code].delete.ts` |

## 9. 附录：页面路由清单

| # | 路径 | SSR 取数 | 说明 |
|---|------|---------|------|
| 1 | `/` | 无 | 首页，硬编码技术栈展示 |
| 2 | `/create` | 无 | 创建胶囊表单 |
| 3 | `/open` | 无 | 输入胶囊码 |
| 4 | `/open/[code]` | ✅ useAsyncData | 胶囊详情，SSR 首屏取数 |
| 5 | `/admin` | 无（middleware hydrate） | 管理面板 |
| 6 | `/about` | 无 | 关于页面 + 隐藏管理入口 |
