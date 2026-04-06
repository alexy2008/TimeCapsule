# HelloTime 全栈实现对比分析

本文对仓库当前的三套全栈实现进行对比：

- `fullstacks/next-ts`
- `fullstacks/nuxt-ts`
- `fullstacks/spring-boot-mvc`

它们都实现了同一套时间胶囊业务，但目标并不完全相同：

- `Next.js` 展示的是现代 React App Router 全栈方案
- `Nuxt` 展示的是 Vue 系约定式 SSR / Nitro 全栈方案
- `Spring Boot MVC` 展示的是经典服务端渲染 + 渐进增强方案

## 1. 总览

| 维度 | Next.js 全栈 | Nuxt 全栈 | Spring Boot MVC 全栈 |
| :--- | :--- | :--- | :--- |
| 路径 | `fullstacks/next-ts/` | `fullstacks/nuxt-ts/` | `fullstacks/spring-boot-mvc/` |
| 默认端口 | `4177` | `4178` | `4179` |
| 核心框架 | Next.js 15 | Nuxt 3 | Spring Boot 3 MVC |
| 语言 | TypeScript | TypeScript | Java 21 |
| 运行模型 | React Server Components + Route Handlers | SSR + Nitro Server | Servlet MVC + Thymeleaf |
| 数据库 | SQLite | SQLite | SQLite |
| 管理员认证 | `httpOnly cookie` + middleware | Cookie + Nuxt middleware | `HttpSession` |
| UI 交互风格 | 服务端壳 + 客户端交互岛 | 页面级数据流 + composables | 服务端页面 + HTMX 局部刷新 |
| 技术栈展示项 | 3 项 | 3 项 | 5 项 |

## 2. 架构定位差异

### 2.1 Next.js

`Next` 的定位是“现代 React 全栈参考实现”。它最强调的是：

- App Router
- 服务端页面与客户端交互边界
- Route Handlers
- middleware / metadata / server-side data access

对应目录结构：

- 页面入口：[/Users/alex/AiWork/HelloTimeByClaude/fullstacks/next-ts/src/app](/Users/alex/AiWork/HelloTimeByClaude/fullstacks/next-ts/src/app)
- 服务端能力：[/Users/alex/AiWork/HelloTimeByClaude/fullstacks/next-ts/src/lib/server](/Users/alex/AiWork/HelloTimeByClaude/fullstacks/next-ts/src/lib/server)
- 客户端交互岛：`src/app/create/CreateClient.tsx`、`src/app/open/OpenPageClient.tsx`、`src/app/admin/AdminClient.tsx`

它现在已经不是“React 项目外面套一层 Next”，而是典型的：

- 路由页负责服务端壳
- 高交互页面下沉成 route-local client component
- 数据读写通过本站 `/api/v1/*`

### 2.2 Nuxt

`Nuxt` 的定位是“Vue 全栈开发体验参考实现”。它最强调的是：

- 文件路由
- `useAsyncData` / `useFetch`
- `useState` / composables
- Nitro server
- middleware / plugin

对应目录结构：

- 页面入口：[/Users/alex/AiWork/HelloTimeByClaude/fullstacks/nuxt-ts/pages](/Users/alex/AiWork/HelloTimeByClaude/fullstacks/nuxt-ts/pages)
- 服务端 API：[/Users/alex/AiWork/HelloTimeByClaude/fullstacks/nuxt-ts/server/api/v1](/Users/alex/AiWork/HelloTimeByClaude/fullstacks/nuxt-ts/server/api/v1)
- 服务端工具：[/Users/alex/AiWork/HelloTimeByClaude/fullstacks/nuxt-ts/server/utils](/Users/alex/AiWork/HelloTimeByClaude/fullstacks/nuxt-ts/server/utils)
- 状态与复用：[/Users/alex/AiWork/HelloTimeByClaude/fullstacks/nuxt-ts/composables](/Users/alex/AiWork/HelloTimeByClaude/fullstacks/nuxt-ts/composables)

相比 `Next`，`Nuxt` 的页面代码通常更短，页面和数据获取更靠近，框架味更直接。

### 2.3 Spring Boot MVC

`Spring Boot MVC` 的定位不是 JS 全栈，而是“经典服务端渲染全栈参考实现”。它强调的是：

- Spring MVC Controller
- Thymeleaf 模板
- Session 登录态
- HTMX 局部刷新

对应目录结构：

- 页面控制器：[/Users/alex/AiWork/HelloTimeByClaude/fullstacks/spring-boot-mvc/src/main/java/com/hellotime/controller/WebController.java](/Users/alex/AiWork/HelloTimeByClaude/fullstacks/spring-boot-mvc/src/main/java/com/hellotime/controller/WebController.java)
- 服务端模板：[/Users/alex/AiWork/HelloTimeByClaude/fullstacks/spring-boot-mvc/src/main/resources/templates](/Users/alex/AiWork/HelloTimeByClaude/fullstacks/spring-boot-mvc/src/main/resources/templates)
- 静态资源：[/Users/alex/AiWork/HelloTimeByClaude/fullstacks/spring-boot-mvc/src/main/resources/static](/Users/alex/AiWork/HelloTimeByClaude/fullstacks/spring-boot-mvc/src/main/resources/static)

这套实现最能体现“服务器主导页面”的风格。它不是用 Java 去模仿现代前端框架，而是保留了 Spring 自己的强项。

## 3. 页面与数据流

### 3.1 首页 / 关于页

- `Next`：服务端页面直接输出内容，适合 metadata 和静态预渲染
- `Nuxt`：页面本身承担数据读取与 SEO 定义，写法集中
- `Spring MVC`：Controller 拼装 model，模板直接渲染

结论：

- 想突出“服务端页面边界”，`Next` 更强
- 想突出“页面写起来顺手”，`Nuxt` 更自然
- 想突出“传统 MVC 页面生成”，`Spring MVC` 最鲜明

### 3.2 创建胶囊

- `Next`：路由页 + `CreateClient`，客户端提交本站 API
- `Nuxt`：页面组件内组合 composable 与对话框
- `Spring MVC`：服务端表单提交 + 结果页返回

这里三者代表了三种典型模型：

1. React 式客户端表单岛
2. Vue/Nuxt 式页面内数据流
3. 传统服务端表单流

### 3.3 开启胶囊

- `Next`：服务端先根据路由参数查首屏数据，客户端只负责后续交互与倒计时到期后的重查
- `Nuxt`：`/open/[code]` 直接用 `useAsyncData`
- `Spring MVC`：普通服务端页面渲染，倒计时和开启动画由前端脚本补足

在这一条链路上：

- `Next` 和 `Nuxt` 都体现了现代 SSR 路由取数
- `Spring MVC` 则体现了“服务端 HTML + 少量 JS 增强”的路线

### 3.4 管理员后台

- `Next`：服务端读 cookie 预取首屏列表，后续交互在 `AdminClient`
- `Nuxt`：middleware 预热登录态，页面内通过 composable 驱动列表
- `Spring MVC`：Session 登录，HTMX 刷新列表与删除，无需整页跳转

管理员模块是三套实现差异最直观的地方：

- `Next` 偏“服务端边界 + React 客户端岛”
- `Nuxt` 偏“页面级状态管理”
- `Spring MVC` 偏“服务器主导 + 局部 HTML 替换”

## 4. 认证与安全模型

| 维度 | Next.js | Nuxt | Spring Boot MVC |
| :--- | :--- | :--- | :--- |
| 认证介质 | `httpOnly cookie` | Cookie | `HttpSession` |
| 登录后首屏 | 服务端可见 | middleware 可见 | 服务端天然可见 |
| 管理页守卫 | Next middleware + page 预取 | Nuxt middleware | Controller / Session |
| 客户端暴露 token | 否 | 否 | 不适用 |

结论：

- `Next` 和 `Nuxt` 都已经是现代 cookie 化模型
- `Spring MVC` 用 Session 最符合传统服务端全栈的气质

## 5. 技术栈展示策略

### 5.1 Next / Nuxt

这两套全栈实现已经简化为固定 3 项：

- 框架
- 语言
- 数据库

并且不再调用健康检查接口动态推导，直接使用固定静态资源。

### 5.2 Spring Boot MVC

Spring MVC 保留了固定 5 项展示：

- Spring Boot
- Java
- Thymeleaf
- HTMX
- SQLite

这样做是合理的，因为它本身就是“服务端模板 + 渐进增强”的全栈样板，`Thymeleaf` 和 `HTMX` 都是需要被明确展示的核心技术。

## 6. 工程规模

以下为当前大致规模统计，仅用于横向体感对比，不作为质量判断标准：

| 实现 | 文件数 | 代码行数 | 说明 |
| :--- | :--- | :--- | :--- |
| `Next` | 约 `51` | 约 `3933` 行 | 分层明确，但 App Router / middleware / API 路由带来更多样板 |
| `Nuxt` | 约 `57` | 约 `3774` 行 | 页面和数据流更靠近，总代码略少于 Next |
| `Spring MVC` | 约 `54` | 约 `4339` 行 | Java + 模板 + 静态资源共同构成，总代码最多 |

代码量不能直接说明优劣，但能说明风格：

- `Next` 的复杂度主要来自边界清晰和目录分层
- `Nuxt` 的复杂度更集中在页面和 composable
- `Spring MVC` 的复杂度更多来自模板、Controller、样式与 Java 样板

## 7. 当前最像各自框架的地方

### 7.1 Next.js

最有代表性的部分：

- App Router 页面
- Route Handlers
- middleware
- 服务端首屏取数

代表文件：

- [/Users/alex/AiWork/HelloTimeByClaude/fullstacks/next-ts/src/app/admin/page.tsx](/Users/alex/AiWork/HelloTimeByClaude/fullstacks/next-ts/src/app/admin/page.tsx)
- [/Users/alex/AiWork/HelloTimeByClaude/fullstacks/next-ts/src/app/open/[code]/page.tsx](/Users/alex/AiWork/HelloTimeByClaude/fullstacks/next-ts/src/app/open/[code]/page.tsx)
- [/Users/alex/AiWork/HelloTimeByClaude/fullstacks/next-ts/src/middleware.ts](/Users/alex/AiWork/HelloTimeByClaude/fullstacks/next-ts/src/middleware.ts)

### 7.2 Nuxt

最有代表性的部分：

- `pages/` 文件路由
- `useAsyncData`
- `definePageMeta`
- Nitro `server/api`

代表文件：

- [/Users/alex/AiWork/HelloTimeByClaude/fullstacks/nuxt-ts/pages/open/[code].vue](/Users/alex/AiWork/HelloTimeByClaude/fullstacks/nuxt-ts/pages/open/[code].vue)
- [/Users/alex/AiWork/HelloTimeByClaude/fullstacks/nuxt-ts/pages/admin.vue](/Users/alex/AiWork/HelloTimeByClaude/fullstacks/nuxt-ts/pages/admin.vue)
- [/Users/alex/AiWork/HelloTimeByClaude/fullstacks/nuxt-ts/server/api/v1](/Users/alex/AiWork/HelloTimeByClaude/fullstacks/nuxt-ts/server/api/v1)

### 7.3 Spring Boot MVC

最有代表性的部分：

- Controller 返回模板
- Thymeleaf fragments
- HTMX 局部更新
- Session 认证

代表文件：

- [/Users/alex/AiWork/HelloTimeByClaude/fullstacks/spring-boot-mvc/src/main/java/com/hellotime/controller/WebController.java](/Users/alex/AiWork/HelloTimeByClaude/fullstacks/spring-boot-mvc/src/main/java/com/hellotime/controller/WebController.java)
- [/Users/alex/AiWork/HelloTimeByClaude/fullstacks/spring-boot-mvc/src/main/resources/templates/fragments/admin-table.html](/Users/alex/AiWork/HelloTimeByClaude/fullstacks/spring-boot-mvc/src/main/resources/templates/fragments/admin-table.html)
- [/Users/alex/AiWork/HelloTimeByClaude/fullstacks/spring-boot-mvc/src/main/resources/static/js/app.js](/Users/alex/AiWork/HelloTimeByClaude/fullstacks/spring-boot-mvc/src/main/resources/static/js/app.js)

## 8. 适用场景建议

### 选择 Next.js，如果你想展示：

- React 的现代服务端能力
- App Router / middleware / metadata
- 服务端与客户端边界清晰的大型工程风格

### 选择 Nuxt，如果你想展示：

- Vue 全栈开发体验
- 页面级 SSR 数据流
- 约定优先、上手顺手的全栈结构

### 选择 Spring Boot MVC，如果你想展示：

- 非 JS 的全栈路线
- 服务端模板渲染
- 经典 MVC + 渐进增强
- 企业级 Java 技术栈的完整页面方案

## 9. 选型建议

如果把这三套全栈实现当作“技术栈展示样板”，可以按下面的目标理解：

| 目标 | 更适合的实现 | 原因 |
| :--- | :--- | :--- |
| 展示现代 React 全栈边界 | `Next.js` | App Router、middleware、Route Handlers、服务端壳与客户端岛分层最完整 |
| 展示现代 Vue 全栈体验 | `Nuxt` | `pages/`、`useAsyncData`、Nitro、middleware 和 composables 的组合最自然 |
| 展示经典 Java 全栈路线 | `Spring Boot MVC` | Thymeleaf + Session + HTMX，把“服务器主导页面”表现得最直接 |

如果从“使用体验”角度看：

- `Nuxt` 最顺手，页面和数据流最贴近写法直觉
- `Next` 最工程化，边界和扩展能力最强
- `Spring Boot MVC` 最有差异化，和前两者形成清晰对照

## 10. 结论

这三套全栈实现已经覆盖了仓库想展示的三条主线：

1. 现代 React 全栈
2. 现代 Vue 全栈
3. 传统 Java MVC 全栈

它们的价值不在于“谁更大”，而在于“谁更像自己的框架”。后续如果继续新增全栈实现，建议优先补能明显拉开路线差异的技术栈，而不是再加一套和现有方案高度相似的同类实现。
