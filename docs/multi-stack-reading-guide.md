# HelloTime 多技术栈阅读指南

本文面向第一次进入仓库的读者，帮助快速建立“同一需求在不同技术栈中分别落在哪里”的地图。阅读顺序按照功能主线组织，而不是按照目录树机械展开。

## 1. 先看什么

如果你只想快速理解项目，建议按下面顺序阅读：

1. `spec/api/openapi.yaml`
2. `docs/comment-guidelines.md`
3. 一个后端实现
4. 一个前端实现
5. 一套全栈实现

这样可以先建立统一接口认知，再观察不同框架如何落地同一套规则。

## 2. 业务主线

HelloTime 的核心流程只有四条：

1. 创建胶囊
2. 按胶囊码查询胶囊
3. 在开启时间之前隐藏内容
4. 管理员登录后查看和删除胶囊

阅读任意实现时，都优先沿这四条主线去找代码。

## 3. 前后端分离实现如何对照

### 创建胶囊

- 后端
  - `backends/*/service/*capsule*`
  - `backends/*/controller` / `router` / `handler`
- 前端
  - `frontends/*/api`
  - `frontends/*/hooks` / `composables` / `services`
  - `frontends/*/views/create*`

### 打开胶囊

- 后端负责根据 `openAt` 决定是否返回内容。
- 前端只负责展示返回结果，不自行伪造开启状态。

这部分最适合拿来对照不同实现中的职责边界。

### 管理员功能

- 登录态保存位置：
  - React / Vue / Angular / Svelte 分离实现主要使用 `sessionStorage`
  - Next / Nuxt 全栈实现主要用 cookie
  - Spring Boot MVC 使用 `HttpSession`
- 这是一个很好的学习点：
  - 同样是“管理员态”，在 SPA、SSR、MVC 里会自然落在不同机制上。

## 4. 同类抽象如何映射

| 关注点 | Vue | React | Angular | Svelte | Next / Nuxt | Spring MVC |
| --- | --- | --- | --- | --- | --- | --- |
| 业务逻辑复用 | composable | hook | service | 状态模块 | server utils + client component/composable | service |
| 页面入口 | `views/*.vue` | `views/*.tsx` | `views/*` | `views/*.svelte` | `app/` 或 `pages/` | `controller + templates` |
| 接口封装 | `api/index.ts` | `api/index.ts` | `api/index.ts` | `lib/api/index.ts` | `src/api` 或 server api | controller / handler |
| 登录态持久化 | `sessionStorage` | `sessionStorage` | `sessionStorage` | `sessionStorage` | cookie | `HttpSession` |

读者不需要一次掌握所有细节，只要知道这些抽象在不同栈里承担的是同一类职责即可。

## 5. 推荐阅读路径

### 路径 A：先学前后端分离

适合刚接触现代前端和 REST API 的读者。

1. `backends/spring-boot`
2. `frontends/react-ts`
3. `frontends/vue3-ts`
4. `frontends/angular-ts`
5. `frontends/svelte-ts`

这样可以先用一个熟悉的后端建立业务认知，再对比四种前端组织方式。

### 路径 B：先学全栈

适合想理解 SSR、服务端路由和会话处理的读者。

1. `fullstacks/next-ts`
2. `fullstacks/nuxt-ts`
3. `fullstacks/spring-boot-mvc`

这条路径更适合对比“同一个产品页面，如何在 React SSR、Vue SSR、Spring MVC 中完成”。

## 6. 阅读时重点关注的注释

本仓库新增和调整注释时，优先解释以下内容：

- 为什么这里要做时间格式转换。
- 为什么这里要统一错误格式。
- 为什么这里选择 `sessionStorage` / cookie / session。
- 为什么这里的逻辑放在 hook、service 或 server util，而不是页面里。
- 为什么全栈实现不依赖外部 `8080` 后端。

如果你在阅读中遇到这类注释，优先看它们，它们通常比步骤性注释更能帮助你理解实现差异。

## 7. 初学者常见误区

- 误区一：前端页面决定胶囊是否开启。
  - 实际上开启规则应由后端或服务端实现控制，前端只负责渲染结果。
- 误区二：不同技术栈必须写出完全相同的结构。
  - 实际上本项目强调“功能一致、实现风格允许不同”。
- 误区三：注释越多越好。
  - 这个项目允许较丰富注释，但仍应优先保留有教学价值的说明。

## 8. 建议的对照练习

可以按下面三个问题做横向对照：

1. “管理员令牌保存在哪里，为什么这样选？”
2. “胶囊内容在什么时候被隐藏，判断放在哪一层？”
3. “创建胶囊时，时间字符串在哪一层被转成 ISO 8601？”

这三个问题基本覆盖了本仓库最重要的跨栈共性与差异。
