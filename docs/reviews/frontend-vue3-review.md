# HelloTime Vue3 前端深度 Review 报告

> **审查日期**: 2026-04-13  
> **审查范围**: `frontends/vue3-ts/src/` (33 个文件)  
> **技术栈**: Vue 3.5 + TypeScript 6 + Vite 7  
> **定位**: Composition API + composable 模式范例

---

## 目录

1. [项目结构概览](#1-项目结构概览)
2. [逐文件分析](#2-逐文件分析)
3. [代码质量评估](#3-代码质量评估)
4. [Vue 3 最佳实践评估](#4-vue-3-最佳实践评估)
5. [注释质量评估](#5-注释质量评估)
6. [潜在缺陷](#6-潜在缺陷)
7. [UI 一致性检查](#7-ui-一致性检查)
8. [优化建议](#8-优化建议)
9. [总结评分](#9-总结评分)

---

## 1. 项目结构概览

```
src/
├── api/index.ts              # API 客户端封装（共享模块）
├── types/index.ts            # TypeScript 类型定义（共享模块）
├── composables/
│   ├── useTheme.ts           # 主题切换（模块级单例）
│   ├── useAdmin.ts           # 管理员认证与操作
│   ├── useCountdown.ts       # 倒计时逻辑
│   ├── useCapsule.ts         # 胶囊 CRUD 操作
│   └── useTechStack.ts       # 技术栈信息加载（模块级缓存）
├── components/
│   ├── AppHeader.vue         # 顶部导航
│   ├── AppFooter.vue         # 底部技术栈展示
│   ├── ThemeToggle.vue       # 主题切换按钮
│   ├── ConfirmDialog.vue     # 确认弹窗（Teleport）
│   ├── CapsuleCodeInput.vue  # 8位码输入组件
│   ├── AdminLogin.vue        # 管理员登录表单
│   ├── CapsuleForm.vue       # 创建胶囊表单
│   ├── CapsuleCard.vue       # 胶囊详情卡片（锁定/解锁）
│   ├── CapsuleTable.vue      # 管理面板表格（分页）
│   └── CountdownClock.vue    # 倒计时显示
├── views/
│   ├── HomeView.vue          # 首页（技术栈展示）
│   ├── CreateView.vue        # 创建胶囊页
│   ├── OpenView.vue          # 查询胶囊页
│   ├── AdminView.vue         # 管理后台页
│   └── AboutView.vue         # 关于页（隐藏管理入口）
├── router/index.ts           # 路由配置
├── utils/techStack.ts        # 技术栈标签简化工具
├── main.ts                   # 应用入口
├── App.vue                   # 根组件
└── env.d.ts                  # 类型声明
```

**结构评价**: ⭐⭐⭐⭐⭐ 清晰的分层架构，composables 与 components 职责分离明确，与项目定位完全一致。

---

## 2. 逐文件分析

### 2.1 基础设施层

#### `main.ts` — 应用入口

```ts
import '@spec/styles/cyber.css'  // 通过 @spec alias 导入共享设计系统
```

- ✅ 正确通过 `@spec` 别名导入共享 `cyber.css`，确保所有前端实现视觉一致
- ✅ 简洁明了，无多余逻辑

#### `vite.config.ts` — 构建配置

```ts
alias: {
  '@': resolve(__dirname, 'src'),
  '@spec': resolve(__dirname, '../../spec'),
}
```

- ✅ 双别名配置合理：`@` 指向本地 `src`，`@spec` 指向 monorepo 根部的共享规范
- ✅ 代理配置正确：`/api` 和 `/tech-logos` 都代理到 `localhost:8080`
- ⚠️ 建议：`server.host` 使用 `'127.0.0.1'` 而非 `'localhost'`，与其他前端统一

#### `types/index.ts` — 类型定义

- ✅ 完整覆盖所有 API 实体：`Capsule`、`CreateCapsuleForm`、`ApiResponse<T>`、`PageData<T>`、`AdminToken`、`HealthInfo`
- ✅ `content?: string | null` 正确处理了未解锁时 content 为 null 的场景
- ✅ 中文注释清晰，每行字段都有说明
- ⚠️ 建议：`PageData` 的泛型约束可考虑 `T extends Capsule`，或更通用化

#### `api/index.ts` — API 客户端

- ✅ `request<T>()` 通用封装处理了 JSON 序列化、204 空响应、非 JSON 错误响应等边界情况
- ✅ 统一的 `ApiResponse<T>` 返回格式，错误时抛出 `Error` 对象
- ✅ 管理接口通过 `Authorization: Bearer ${token}` 头传递 JWT
- ⚠️ **潜在问题**: `openAt` 转换 `new Date(form.openAt).toISOString()` 假设 `form.openAt` 是 `datetime-local` 格式（如 `2026-04-13T14:00`），会被解释为本地时间。如果用户在不同时区，可能导致时间偏差。建议明确使用时区处理。
- 💡 建议：考虑添加请求取消（AbortController）支持和重试机制

---

### 2.2 Composables 层

#### `useTheme.ts` — 主题切换

**跨技术栈对照**: `useTheme` ↔ React `useTheme` hook ↔ Angular `ThemeService`

- ✅ 模块级单例模式保证全局唯一主题状态
- ✅ SSR 兼容：`getStorage()` 和 `typeof document !== 'undefined'` 检查
- ✅ `watchEffect` 自动响应变化并同步到 DOM
- ⚠️ **测试隐患**: 模块级 `ref` 会在测试用例间共享状态，需要在测试中手动重置或使用 `vi.resetModules()`
- ⚠️ 建议：导出 `type Theme` 以便其他组件使用

#### `useAdmin.ts` — 管理员逻辑

**跨技术栈对照**: `useAdmin` ↔ React `useAdmin` hook ↔ Angular `AdminService`

- ✅ 模块级 `token` ref 跨组件共享，设计合理
- ✅ `sessionStorage` 持久化 token，关闭标签页自动失效
- ✅ 登出时完整清理：token、capsules、pageInfo 全部重置
- ✅ 401 自动检测（检查消息中是否包含"认证"/"未授权"关键词）后 logout
- ⚠️ **脆弱的 401 检测**: 依赖错误消息字符串匹配 `"认证"` / `"未授权"` 不够可靠。建议检查 HTTP 状态码或统一错误码。后端返回的错误消息可能随时变化，导致自动登出逻辑失效。
- ⚠️ `isLoggedIn` 完全依赖本地 token，未做 token 过期校验。过期 token 会导致每次操作都触发 logout 流程。

#### `useCountdown.ts` — 倒计时

**跨技术栈对照**: `useCountdown` ↔ React `useCountdown` hook ↔ Angular `CountdownService`

- ✅ `onUnmounted` 正确清理 `setInterval`
- ⚠️ **缺少注释**: 这是唯一一个没有 JSDoc 注释的 composable，与其他 composable 风格不一致
- ⚠️ 每秒重新计算全部值（days/hours/minutes/seconds），可优化为只递减 seconds 并级联更新
- ⚠️ 导出的 `CountdownTime` 接口是 inline 在文件中的，与其他 composable 的做法不一致

#### `useCapsule.ts` — 胶囊 CRUD

**跨技术栈对照**: `useCapsule` ↔ React `useCapsule` hook ↔ Angular `CapsuleService`

- ✅ 经典的 loading/error/data 三件套模式
- ✅ 每次调用 `useCapsule()` 创建独立实例（非单例），符合 Vue composable 最佳实践
- ✅ `clear()` 方法重置状态
- ⚠️ **重复调用问题**: `useCapsule()` 每次返回新的 ref 实例。在 `OpenView` 和 `CreateView` 各自使用没问题，但如果同一组件多次调用会创建多个独立状态。
- 💡 建议：可考虑添加乐观更新和缓存机制

#### `useTechStack.ts` — 技术栈信息

**跨技术栈对照**: `useTechStack` ↔ React `useTechStack` hook ↔ Angular `TechStackService`

- ✅ `pendingRequest` 去重机制：多个组件同时挂载只发一次请求
- ✅ 模块级缓存避免重复请求
- ⚠️ **关键缺陷**: `loaded = false` 在失败后不会重置，但如果 `loaded = true`（成功后）也不会再请求。然而问题是：**请求失败后 `loaded` 保持 `false`**，按理下次调用应该重试，但由于 `pendingRequest` 在 finally 中被置为 `null`，实际会重试——这是正确的行为。但 `error` 状态在成功后不会被清除（`error.value = true` 在 catch 中设置，下次成功才清除），这可能在 UI 上短暂闪现错误状态。
- ⚠️ **onMounted 位置问题**: `onMounted` 在 composable 内部调用。如果在 setup 阶段之外（如异步回调中）调用 `useTechStack()`，`onMounted` 会失效。当前使用场景都在 `<script setup>` 中，所以实际不会出问题，但这是隐藏的使用约束。

---

### 2.3 组件层

#### `App.vue` — 根组件

- ✅ 使用 `<Suspense>` 包裹 `<RouterView>` 处理异步页面加载
- ✅ `background-grid` 和 `ambient-glow` 背景效果来自 `cyber.css`
- ✅ 结构简洁：header + main + footer 三段式布局

#### `AppHeader.vue` — 顶部导航

- ✅ Logo + 导航 + 主题切换的标准布局
- ✅ `router-link` 使用 `active-class="active"` 实现高亮
- ✅ 响应式：小屏幕隐藏 logo 文字

#### `AppFooter.vue` — 底部信息

- ✅ 使用 `useTechStack()` 获取后端技术栈
- ✅ `simplifyTechLabel` 简化版本号展示
- ⚠️ 硬编码前端技术栈字符串 `'Vue'`、`'TypeScript'`——这是合理的，因为 Vue 版本就确定是 Vue

#### `ThemeToggle.vue` — 主题切换

- ✅ SVG 内联图标（太阳/月亮），无外部依赖
- ✅ `aria-label` 无障碍支持
- ✅ 使用 `btn btn-icon outline-glow` 等 cyber.css 类名

#### `ConfirmDialog.vue` — 确认弹窗

- ✅ `<Teleport to="body">` 确保弹窗在 DOM 层级顶部
- ✅ overlay 点击关闭（`@click.self`）
- ✅ 使用 `defineProps` 和 `defineEmits` 类型化版本
- ⚠️ **无键盘支持**: 没有 ESC 键关闭弹窗的处理
- ⚠️ **无焦点陷阱**: 弹窗打开时 Tab 可以跳出弹窗范围
- 💡 建议：添加 `@keydown.escape` 和基本的焦点管理

#### `CapsuleCodeInput.vue` — 8位码输入

- ✅ v-model 双向绑定实现标准
- ✅ `maxlength="8"` 限制输入长度
- ✅ Enter 键提交支持
- ⚠️ **双 watcher 问题**: 同时 watch `props.modelValue → code` 和 `code → emit('update:modelValue')`。虽然 Vue 会自动避免无限循环（值相同不会触发更新），但这种模式不够优雅。更好的做法是使用 `computed` getter/setter 或单一 watcher。

#### `AdminLogin.vue` — 管理员登录

- ✅ 密码输入框使用 `type="password"` 和 `autocomplete="current-password"`
- ✅ 空密码禁用提交按钮
- ⚠️ 登录后密码不会被清空（`password.value = ''`），虽然这不是安全问题（客户端），但属于 UX 细节

#### `CapsuleForm.vue` — 创建胶囊表单

- ✅ `reactive` 管理表单数据和错误状态
- ✅ 完整的前端验证：非空检查 + 时间校验
- ✅ `minDateTime` computed 限制日期选择器最小值
- ✅ 响应式布局：`@media (max-width: 640px)` 时 meta 行变为单列
- ✅ `datetime-local` 的 `color-scheme` 根据主题适配（全局非 scoped 样式）
- ⚠️ **验证不完整**: 只验证了非空，没有验证长度限制（title ≤ 100, creator ≤ 30）。虽然有 `maxlength` 属性，但 JS 端没有做对应校验
- ⚠️ `handleSubmit` 中 `emit('submit', { ...form })` 浅拷贝了 reactive 对象，但如果父组件修改了返回值不会影响本地状态——这是正确的做法

#### `CapsuleCard.vue` — 胶囊详情卡片

- ✅ 锁定/解锁双状态渲染（`v-if/v-else`）
- ✅ 解锁动画效果：`animating` 状态 + `setTimeout` 2.5 秒
- ✅ `onBeforeUnmount` 清理定时器
- ✅ 进度条 `progress` computed 计算已过时间百分比
- ✅ `CountdownClock` 组件在锁定状态下展示倒计时
- ⚠️ **formatTime 重复**: 此文件和 `CapsuleTable.vue` 都有 `formatTime` 函数，应该提取为共享工具函数
- ⚠️ **XSS 安全**: `{{ capsule.content }}` 使用文本插值（不是 `v-html`），Vue 会自动转义，**没有 XSS 风险**。✓ 安全
- ⚠️ watch 中 `([, opened, content])` 解构但忽略第一个元素 `code`，代码可读性稍差

#### `CapsuleTable.vue` — 管理面板表格

- ✅ 分页控件：上一页/下一页 + 页码显示
- ✅ 展开/收起内容预览
- ✅ `overflow-x: auto` 处理小屏幕溢出
- ✅ 删除确认通过事件委托给父组件
- ⚠️ `formatTime` 与 `CapsuleCard.vue` 重复（同上）
- ⚠️ 表格在极小屏幕上可能仍然难以使用，考虑改为卡片式布局

#### `CountdownClock.vue` — 倒计时显示

- ✅ 使用 `useCountdown` composable
- ✅ 到期后 3 秒延迟触发 `expired` 事件（给用户看到 "🎉 时间已到" 的缓冲）
- ✅ `onUnmounted` 清理 `expiredTimer`
- ⚠️ `useCountdown` 的 interval 和 `expiredTimer` 的 timeout 是两个独立的定时器，管理稍显分散

---

### 2.4 视图层

#### `HomeView.vue` — 首页

- ✅ Hero 区域 + 操作卡片 + 技术栈展示三段式
- ✅ 技术栈 logo 的 URL 添加 `?v=版本号` 参数触发缓存更新
- ⚠️ `techItems` computed 中大量重复的 fallback 逻辑，可抽取为辅助函数

#### `CreateView.vue` — 创建页

- ✅ 两阶段流程：表单 → 成功展示胶囊码
- ✅ 确认弹窗防止误操作
- ✅ 胶囊码复制功能（`navigator.clipboard.writeText`）
- ⚠️ **模板注入风险**: `ConfirmDialog` 的 `:message` 使用模板字符串 `` `确定要创建标题为「${pendingForm?.title}」的时间胶囊吗？` ``。虽然 `message` 是作为文本 prop 传递给 `ConfirmDialog`，在 `{{ message }}` 中展示是安全的（Vue 文本插值会转义），但如果 `pendingForm?.title` 包含特殊字符如 `」` 可能导致显示混乱。这不是 XSS 问题，但属于显示 bug。
- ⚠️ `copyCode()` 未处理 clipboard API 失败的情况（非 HTTPS 环境下 `navigator.clipboard` 不可用）

#### `OpenView.vue` — 查询页

- ✅ URL 参数驱动：`/open/:code` 自动查询
- ✅ `watch` with `{ immediate: true }` 处理路由参数变化
- ✅ 倒计时到期后自动重新查询（`handleExpired`）
- ⚠️ **无 404/错误路由处理**: 如果访问 `/open/invalid-code`，会显示 API 错误信息，但没有友好的 "胶囊不存在" 页面

#### `AdminView.vue` — 管理后台

- ✅ 条件渲染：未登录显示 `AdminLogin`，已登录显示 `CapsuleTable`
- ✅ `watch(isLoggedIn, ..., { immediate: true })` 登录后自动加载列表
- ✅ 删除确认弹窗
- ⚠️ **无路由守卫**: `/admin` 路由没有认证守卫，任何人可以直接访问 URL 看到登录页面。虽然登录表单本身需要密码，但建议添加基本的路由鉴权逻辑。
- ⚠️ 登出后不会自动跳转回首页，用户停留在空白管理页面

#### `AboutView.vue` — 关于页

- ✅ 技术栈信息展示
- ✅ 隐藏管理入口：点击 "tech orb" 5 次跳转到 `/admin`（彩蛋功能）
- ⚠️ `clickCount` 没有超时重置：用户可以在任意时间间隔内点击 5 次。建议添加 `setTimeout` 在一定时间后重置计数器。

#### `router/index.ts` — 路由配置

- ✅ 懒加载所有视图组件
- ✅ `/open/:code?` 可选参数设计
- ⚠️ **无 catch-all 路由**: 缺少 `/:pathMatch(.*)*` 通配符路由，访问不存在的路径会显示空白
- ⚠️ **无路由元信息**: 没有使用 `meta` 字段标记页面标题、是否需要认证等

#### `utils/techStack.ts` — 工具函数

```ts
export function simplifyTechLabel(value: string): string {
  return normalized.replace(/\s+v?\d+(\.\d+)*.*$/i, '').trim()
}
```

- ✅ 正则去除版本号：`"Spring Boot 3.4.2"` → `"Spring Boot"`
- ⚠️ 只有一个工具函数，与 `formatTime` 未被提取形成不一致

---

## 3. 代码质量评估

### 3.1 组件设计 ⭐⭐⭐⭐☆ (4/5)

| 维度 | 评价 |
|------|------|
| 单一职责 | ✅ 每个组件职责明确 |
| Props/Events 设计 | ✅ 类型化 `defineProps`/`defineEmits` |
| 组件粒度 | ✅ 10 个组件拆分合理 |
| 复用性 | ⚠️ `formatTime` 重复定义 |
| 可测试性 | ✅ 6 个测试文件覆盖核心组件和 composable |

### 3.2 Composable 使用 ⭐⭐⭐⭐☆ (4/5)

| Composable | 单例/多实例 | 评价 |
|-------------|------------|------|
| `useTheme` | 模块级单例 | ✅ 全局主题必须单例 |
| `useAdmin` | 模块级 token + 局部状态 | ✅ token 共享 + 局部 UI 状态 |
| `useCapsule` | 每次新实例 | ✅ 各页面独立状态 |
| `useCountdown` | 每次新实例 | ✅ 各倒计时独立 |
| `useTechStack` | 模块级缓存 | ✅ 避免重复请求 |

### 3.3 状态管理 ⭐⭐⭐⭐☆ (4/5)

- ✅ 无全局状态库（Pinia/Vuex），完全使用 composable + ref 管理状态——符合项目精简定位
- ✅ 模块级 ref 在需要共享状态的地方（theme, admin token, tech stack）使用得当
- ⚠️ 模块级 ref 在测试中需要额外处理

---

## 4. Vue 3 最佳实践评估

### ✅ 遵循的实践

1. **`<script setup lang="ts">`** — 所有组件统一使用
2. **Composition API** — 全部逻辑在 setup 中，无 Options API 混用
3. **类型化 Props/Events** — `defineProps<{...}>()` 和 `defineEmits<{...}>()`
4. **懒加载路由** — `() => import('@/views/XxxView.vue')`
5. **Teleport** — `ConfirmDialog` 使用 `<Teleport to="body">`
6. **Suspense** — `App.vue` 包裹 `RouterView`
7. **响应式选择** — `reactive` 用于对象（表单），`ref` 用于标量
8. **生命周期清理** — `onUnmounted`/`onBeforeUnmount` 清理定时器

### ⚠️ 需改进的实践

1. **双 watcher v-model**（`CapsuleCodeInput`）→ 应使用 computed getter/setter
2. **`Suspense` 实验性特性** — Vue 3.5 中 Suspense 仍为实验性 API，生产项目需注意稳定性
3. **`useTechStack` 中的 `onMounted`** — composable 内调用 `onMounted` 是隐式约束，应在文档中说明
4. **无 `defineOptions`** — 可以用 `defineOptions({ name: 'ComponentName' }`) 增强调试体验

---

## 5. 注释质量评估

### ✅ 优点

- 核心文件（`api/index.ts`、`types/index.ts`、大部分 composable）都有中文 JSDoc 注释
- 注释解释 **"为什么"** 而非 **"是什么"**，如：
  - `useAdmin.ts`: *"通过模块级 ref 共享管理员令牌，并在刷新页面后从 sessionStorage 恢复"*
  - `useTechStack.ts`: *"技术栈信息会在多个页面重复展示，因此使用模块级状态缓存请求结果"*
- 跨技术栈对照写在 `useAdmin` 的头部注释中

### ⚠️ 不足

1. **`useCountdown.ts` 完全没有注释** — 是唯一缺少 JSDoc 的 composable
2. **跨技术栈对照不够系统** — 只在 `useAdmin` 中提了一句，其他 composable 没有。建议在每个 composable 头部统一添加对照说明
3. **组件注释较少** — 大部分组件没有注释，只有 `App.vue` 有一句

### 💡 注释建议模板

```ts
/**
 * 管理员 Composable
 * 封装管理员登录、胶囊列表查询、删除等逻辑
 * 
 * 跨技术栈对照:
 * - Vue: useAdmin() composable（本文件）
 * - React: useAdmin() custom hook
 * - Angular: AdminService injectable service
 */
```

---

## 6. 潜在缺陷

### 🔴 严重 (Critical)

**无**

### 🟡 中等 (Medium)

| # | 位置 | 问题 | 影响 |
|---|------|------|------|
| 1 | `useAdmin.ts:76` | 401 检测依赖字符串匹配 `"认证"`/`"未授权"` | 后端错误消息变更会导致自动登出失效 |
| 2 | `CreateView.vue:88` | `navigator.clipboard.writeText` 无错误处理 | 非 HTTPS 环境会静默失败 |
| 3 | `AdminView.vue` | 无路由守卫，`/admin` URL 可直接访问 | UX 问题（不是安全问题，因为登录仍需要密码） |
| 4 | `useTechStack.ts` | 请求失败后 `loaded=false` 但不会自动重试 | 用户需手动刷新页面 |

### 🟢 低 (Low)

| # | 位置 | 问题 |
|---|------|------|
| 1 | `CapsuleCard.vue` + `CapsuleTable.vue` | `formatTime` 重复定义 |
| 2 | `CapsuleCodeInput.vue:41-47` | 双 watcher v-model 模式不够优雅 |
| 3 | `router/index.ts` | 缺少 catch-all 404 路由 |
| 4 | `ConfirmDialog.vue` | 无 ESC 键关闭和焦点陷阱 |
| 5 | `AboutView.vue:114` | 彩蛋点击计数无超时重置 |
| 6 | `api/index.ts:71` | `openAt` 时区处理可能在不同时区产生偏差 |

### XSS 分析

**结论: 无 XSS 漏洞** ✅

- 所有动态内容使用 Vue 模板插值 `{{ }}`，Vue 自动进行 HTML 转义
- 没有使用 `v-html` 指令
- `ConfirmDialog` 的 `:message` prop 作为文本传递，同样安全
- API 响应数据全部通过文本插值展示

---

## 7. UI 一致性检查

### 与 `cyber.css` 设计系统对照

| 设计系统元素 | Vue3 使用情况 | 状态 |
|-------------|-------------|------|
| `.cyber-glass` 玻璃面板 | AdminLogin, CapsuleForm, CapsuleCodeInput, CapsuleCard, HomeView, AboutView, AppFooter | ✅ |
| `.cyber-input` 输入框 | 所有表单输入 | ✅ |
| `.cyber-form` 表单 | CapsuleForm | ✅ |
| `.btn-primary` 主按钮 | 所有提交按钮 | ✅ |
| `.btn-secondary` 次按钮 | 刷新、返回等 | ✅ |
| `.btn-outline` 描边按钮 | CreateView 返回首页 | ✅ |
| `.btn-danger` 危险按钮 | CapsuleTable 删除 | ✅ |
| `.btn-icon` 图标按钮 | ThemeToggle | ✅ |
| `.badge` 徽章 | CapsuleCard 锁定状态、CapsuleTable 状态 | ✅ |
| `.mono-font` 等宽字体 | 胶囊码、倒计时 | ✅ |
| `.text-glow` / `.text-glow-cyan` | 标题高亮 | ✅ |
| `data-theme` 主题切换 | useTheme 设置 `data-theme` 属性 | ✅ |
| `.background-grid` + `.ambient-glow` | App.vue 模板 | ✅ |
| `.center-card` 居中卡片 | CapsuleCodeInput | ✅ |
| `.search-input` 搜索输入 | CapsuleCodeInput | ✅ |
| `--magenta` 错误色 | 表单验证错误 | ✅ |

**UI 一致性评分: ⭐⭐⭐⭐⭐ (5/5)** — 完全遵循 cyber.css 设计系统，所有 CSS 类名和 CSS 变量使用正确。

---

## 8. 优化建议

### 高优先级

1. **提取 `formatTime` 共享工具函数**
   ```ts
   // src/utils/formatTime.ts
   export function formatTime(iso: string, options?: Intl.DateTimeFormatOptions): string {
     return new Date(iso).toLocaleString('zh-CN', options ?? {
       year: 'numeric', month: '2-digit', day: '2-digit',
       hour: '2-digit', minute: '2-digit', second: '2-digit',
     })
   }
   ```

2. **改进 401 检测逻辑**
   ```ts
   // 建议: 在 api/request() 中统一处理 HTTP 状态码
   if (response.status === 401) {
     throw new AuthError('认证已过期')  // 自定义错误类型
   }
   
   // useAdmin.ts 中改为类型检查
   catch (e: unknown) {
     if (e instanceof AuthError) { logout() }
   }
   ```

3. **添加 catch-all 404 路由**
   ```ts
   {
     path: '/:pathMatch(.*)*',
     name: 'not-found',
     component: () => import('@/views/NotFoundView.vue'),
   }
   ```

4. **修复 `copyCode` clipboard 兼容性**
   ```ts
   async function copyCode() {
     if (!created.value) return
     try {
       await navigator.clipboard.writeText(created.value.code)
     } catch {
       // 降级方案：选中文本
       const input = document.createElement('input')
       input.value = created.value.code
       document.body.appendChild(input)
       input.select()
       document.execCommand('copy')
       document.body.removeChild(input)
     }
     copied.value = true
     setTimeout(() => { copied.value = false }, 2000)
   }
   ```

### 中优先级

5. **`CapsuleCodeInput` 优化 v-model 实现**
   ```ts
   // 替代双 watcher 方案
   const code = computed({
     get: () => props.modelValue,
     set: (val) => emit('update:modelValue', val),
   })
   ```

6. **`useTechStack` 失败后允许重试**
   ```ts
   // 在 catch 中重置 loaded，允许下次调用重试
   catch {
     loaded = false  // 已有，但应确保 UI 给出重试入口
   }
   ```

7. **`ConfirmDialog` 增强无障碍**
   ```ts
   // 添加 ESC 键关闭
   @keydown.escape="$emit('cancel')"
   ```

8. **添加路由守卫（admin 页面）**
   ```ts
   // 在 router.beforeEach 中检查
   router.beforeEach((to) => {
     if (to.path === '/admin') {
       document.title = '管理后台 - HelloTime'
     }
   })
   ```

### 低优先级

9. 添加 `defineOptions({ name: 'XxxComponent' })` 提升调试体验
10. `AboutView` 彩蛋添加超时重置计数器
11. 为 `useCountdown` 补充 JSDoc 注释和跨技术栈对照
12. 考虑将 `useTheme` 的 `Theme` 类型导出

---

## 9. 总结评分

| 维度 | 评分 | 说明 |
|------|------|------|
| **代码质量** | ⭐⭐⭐⭐☆ 4/5 | 整体优秀，formatTime 重复和 401 检测扣分 |
| **Vue 3 最佳实践** | ⭐⭐⭐⭐☆ 4/5 | script setup + composables 模式规范，Suspense 实验性扣分 |
| **注释质量** | ⭐⭐⭐☆☆ 3.5/5 | 核心文件良好但不均匀，跨栈对照不够系统 |
| **安全性** | ⭐⭐⭐⭐⭐ 5/5 | 无 XSS 漏洞，text interpolation 安全 |
| **错误处理** | ⭐⭐⭐⭐☆ 4/5 | 统一的 loading/error 模式，但 401 检测和 clipboard 有缺陷 |
| **UI 一致性** | ⭐⭐⭐⭐⭐ 5/5 | 完全遵循 cyber.css 设计系统 |
| **可测试性** | ⭐⭐⭐⭐☆ 4/5 | 6 个测试文件覆盖核心逻辑，模块级 ref 需额外处理 |

### 综合评分: ⭐⭐⭐⭐☆ (4.1/5)

### 一句话总结

> **Vue3 实现是 HelloTime 五个前端中 Composition API + composable 模式的优秀范例**。代码结构清晰、类型安全、UI 与设计系统完全对齐。主要改进方向是：提取重复工具函数、增强 401 检测可靠性、补齐缺失的路由守卫和 404 页面、以及系统化跨技术栈注释。
