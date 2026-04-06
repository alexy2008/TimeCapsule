# 四个前端实现对比分析

> 这是详细版文档。快速摘要见 [frontend-comparison.md](frontend-comparison.md)。

本文对 HelloTime 仓库中的四个前端实现进行横向对比，覆盖代码量、技术特色、实现差异与适用场景。

对比对象：

- `frontends/vue3-ts`
- `frontends/react-ts`
- `frontends/angular-ts`
- `frontends/svelte-ts`

## 统计口径

- 统计时间：2026-04-01
- 统计范围：各前端目录下 `src/` 中的 `.ts`、`.tsx`、`.vue`、`.svelte`、`.html`、`.css`
- 不计入：`node_modules`、`dist`、`out-tsc`、构建配置、静态资源
- “生产代码”不包含 `__tests__`、`*.test.ts(x)`、`*.spec.ts`
- 由于 Angular 采用 `ts/html/css` 三文件拆分，同等功能下文件数通常会高于 Vue、React、Svelte

## 一、代码量对比

### 1. 总量概览

| 实现 | 源码文件数 | 生产代码行数 | 测试代码行数 | 总行数 |
| --- | ---: | ---: | ---: | ---: |
| Vue 3 | 27 | 2015 | 251 | 2266 |
| React | 28 | 1815 | 450 | 2265 |
| Angular | 60 | 2091 | 264 | 2355 |
| Svelte | 26 | 1803 | 0 | 1803 |

### 2. 代码构成差异

| 实现 | 主要代码形态 | 行数分布特征 |
| --- | --- | --- |
| Vue 3 | `vue` 单文件组件 + `ts` composables | `vue` 1331 行，模板、逻辑、局部样式集中在单文件内 |
| React | `tsx` 组件 + `ts` hooks + 少量 CSS Modules | `tsx` 1119 行，`ts` 619 行，`css` 77 行，JSX 与逻辑分离较明显 |
| Angular | `ts/html/css` 分拆 | `ts` 1106 行，`html` 625 行，`css` 360 行，结构最工程化、文件粒度最细 |
| Svelte | `svelte` 单文件组件 + 少量 `ts` 模块 | `svelte` 1451 行，`ts` 350 行，页面逻辑高度内聚 |

### 3. 测试投入对比

| 实现 | 测试情况 | 特点 |
| --- | --- | --- |
| Vue 3 | 6 个测试文件 / 251 行 | 覆盖组件与 composable，投入中等 |
| React | 8 个测试文件 / 450 行 | 四个实现中测试最多，含 hooks、组件、页面测试 |
| Angular | 4 个测试文件 / 264 行 | 以 service 与关键组件测试为主 |
| Svelte | 0 个测试文件 | 当前只有 `svelte-check`，缺少自动化行为测试 |

从纯“生产代码体量”看，四个实现其实非常接近，差距没有表面上大。Angular 略高，主要来自模板、样式、逻辑分文件带来的结构开销；Svelte 最低，但也伴随着较少的抽象层和测试投入。

## 二、技术特色概览

| 维度 | Vue 3 | React | Angular | Svelte |
| --- | --- | --- | --- | --- |
| 路由 | `vue-router`，路由级懒加载 | `react-router-dom`，`lazy + Suspense` | Angular Router，`loadComponent` 懒加载 | `svelte-spa-router`，路由表直连组件 |
| 状态组织 | `composables` + 模块级 `ref` | hooks + `useSyncExternalStore` 轻量共享状态 | `service + signal + computed + effect` | `writable store` + 页面内局部状态 |
| 组件形式 | SFC 单文件组件 | TSX + 函数组件 | standalone component，模板/样式分离 | `.svelte` 单文件组件 |
| 表单方案 | `reactive` + `v-model` | `useState` 受控表单 | `FormsModule` + `ngModel` | `bind:value` |
| 测试体系 | Vitest + Vue Test Utils + Testing Library | Vitest + Testing Library | Karma + Jasmine + ChromeHeadless | `svelte-check` |
| 风格定位 | 语义清晰、折中平衡 | 组合灵活、手工控制感强 | 工程规范最强、框架约束最重 | 语法最轻、上手成本最低 |

## 三、核心实现差异

### 1. 顶层装配与路由策略

Vue、React、Angular 都把“头部 + 主内容区 + 底部”放在根组件中，再由路由承载页面切换，整体结构很对齐。

- Vue 3 通过 `router-view` 承载页面，路由直接使用动态 `import()`，实现简单直接。
- React 在根组件中使用 `BrowserRouter`、`Routes`，并用 `lazy + Suspense` 做页面级代码分割，路由层的异步边界最显式。
- Angular 使用 `loadComponent` 做 standalone 组件懒加载，同时在 `app.config.ts` 中启用 `withComponentInputBinding()`，让路由参数可直接映射到组件输入，工程特征最鲜明。
- Svelte 使用 `svelte-spa-router`，路由表更加轻量，但当前是直接导入页面组件，没有像 React / Vue / Angular 那样显式做页面懒加载。

一个细节差异是“打开胶囊”页的路由定义：

- Vue 和 React 用一个可选参数路由 `/open/:code?`
- Angular 拆成 `/open` 与 `/open/:code` 两条路由
- Svelte 也拆成 `/open` 与 `/open/:code`

这意味着 Vue / React 在路由表达力上更紧凑，Angular / Svelte 则更偏显式声明。

### 2. 状态管理与业务逻辑抽象

四个实现都把 API 请求层单独抽出，但“页面逻辑到底放在哪一层”差异很大。

### Vue 3

Vue 采用 composable 模式，把管理员、主题、胶囊、技术栈等逻辑沉淀为 `useAdmin`、`useTheme`、`useCapsule`、`useTechStack`。这种写法兼顾复用性和可读性，属于 Vue 生态里最自然的一种组织方式。

特点：

- `ref` / `computed` 语义直观
- 模块级 `ref` 可以自然承载共享状态
- 页面只负责绑定与触发，业务逻辑大多在 composable 中

### React

React 版本没有引入 Zustand、Redux 之类的外部状态库，而是使用模块级变量 + `useSyncExternalStore` 自行实现轻量共享状态。这是一个比较“React 原教旨”的写法，技术上干净，但对实现者要求更高。

特点：

- `useTheme`、`useAdmin` 中都使用 `useSyncExternalStore`
- 避免额外依赖，整体依赖面最小
- 共享状态机制需要手工维护订阅、快照、闭包问题

这使 React 版本非常适合展示“只用 React 原生能力也能搭出可用共享状态层”，但从团队协作角度看，可读性和可维护性略逊于 Vue composable 与 Angular service。

### Angular

Angular 是四个实现里“框架特性落地最完整”的版本。它没有回到旧式 RxJS-heavy 写法，而是明确采用 Signals。

特点：

- `signal` 管理状态
- `computed` 推导登录态
- `effect` 同步主题到 DOM 和 `localStorage`
- service 负责业务，component 负责呈现

这一版的分层最清楚，尤其适合多人协作和长期演进。代价是样板代码、文件拆分、概念门槛都更高。

### Svelte

Svelte 版本整体最轻，但抽象层也最薄。主题和技术栈使用独立 store 模块，管理员页面等复杂流程则直接写在页面组件内部。

特点：

- 用 `writable` store 处理全局主题与技术栈
- 页面脚本块中直接写登录、列表拉取、删除逻辑
- 通过 `$:` 做派生与副作用

需要注意的是，这套实现虽然基于 Svelte 5，但实际风格更接近传统 Svelte store 模式，而不是明显的 runes 风格。它的优点是短平快，缺点是复杂页面一旦增长，逻辑会更容易堆积在单个 `.svelte` 文件里。

### 3. 组件组织方式

### Vue 3 与 Svelte

Vue 3 和 Svelte 都属于“单文件内高内聚”的代表：

- 模板、逻辑、局部样式放在一个文件里
- 阅读页面时上下文切换少
- 适合中小型项目和快速迭代

区别在于，Vue 进一步把业务逻辑抽到了 composable 中；Svelte 则更多保留在页面组件本身。因此二者在“文件体验”相似，但在“逻辑复用层”上 Vue 更成熟。

### React

React 采用 TSX 组件 + hooks + 局部 CSS Modules 的混合模式：

- 视图与逻辑在 TSX 中混合
- 通用逻辑下沉到 hooks
- 样式一部分走共享设计系统，一部分走 CSS Modules

这种模式弹性最大，但也最依赖团队约束，否则很容易出现“有的组件样式隔离、有的组件内联样式很多”的不统一现象。当前实现已经能看出这个倾向，例如首页按钮样式就直接写在 JSX 内。

### Angular

Angular 的组件拆分最标准：

- `component.ts`
- `component.html`
- `component.css`

优点是职责清晰，模板与逻辑互不干扰；缺点是简单改动也要在多个文件间切换。对于同一个中小型 Demo，它的工程重量感会明显高于另外三种实现。

### 4. 页面复杂度承载方式

管理后台最能体现四个实现的差异。

- Vue：页面主要负责交互编排，登录、分页、删除等核心逻辑交由 `useAdmin`
- React：页面负责交互编排，核心逻辑交由 `useAdmin`，但 hook 内部需要自行处理共享状态同步
- Angular：页面最薄，基本只是把事件转发给 `AdminService`
- Svelte：管理页直接承担登录、列表、删除、分页的大部分逻辑

如果项目复杂度继续上升：

- Angular 最不容易失控
- Vue 次之，composable 体系足以继续扩展
- React 取决于是否继续坚持自建共享状态层
- Svelte 最需要尽早抽离页面内业务逻辑

### 5. 测试与工程化差异

Vue 与 React 的测试体验最接近，都建立在 Vite + Vitest 之上，反馈速度快，配置相对轻。

React 的测试投入目前最充分，说明这套实现更强调可回归性。Vue 的测试覆盖也比较合理，但广度略低于 React。

Angular 仍然使用 Angular CLI 默认的 Karma + Jasmine + ChromeHeadless，这套方案更传统、更“官方标准”，但本地反馈速度与轻量程度不如 Vitest 体系。

Svelte 当前只有 `svelte-check`，说明它在类型与编译检查层面是安全的，但交互行为和页面流程缺少自动化保障。这是四个实现中最明显的工程短板。

## 四、综合评价

### Vue 3：最均衡

Vue 版本在抽象层次、代码量、可读性、开发效率之间取得了最好平衡。

- 组件写法自然
- composable 抽象清晰
- 路由、表单、主题切换都比较顺手
- 没有明显过重或过轻的问题

如果目标是“给大多数开发者一个容易理解、容易扩展的参考实现”，Vue 3 是最稳妥的版本。

### React：最灵活，但更依赖工程约束

React 版本的亮点在于用最少依赖完成了共享状态与页面组织，展示了较强的组合能力。

- 原生 hooks 利用充分
- `useSyncExternalStore` 用法比较有代表性
- 测试投入最高

但它也更容易因为个人风格差异而出现实现不一致，长期维护时最好补充更明确的状态管理约定与样式约定。

### Angular：最工程化

Angular 版本最适合展示“强约束框架如何组织一个中等复杂度前端”。

- standalone component
- Signals
- service 分层
- 懒加载路由

它的可维护性上限很高，但对 Demo 项目来说，认知负担和结构成本也是最高的。

### Svelte：最轻量，但当前抽象和测试都偏薄

Svelte 版本在代码量和语法密度上最有优势，阅读和起步成本最低。

- 单文件体验好
- 写法直接
- 很适合快速搭建功能

但当前实现里，复杂页面逻辑较集中，自动化测试缺失，且对 Svelte 5 新特性的利用并不充分。因此它更像“最快可工作的版本”，而不是“最完整的工程化版本”。

## 五、选型建议

如果把这四个实现视为不同目标下的参考答案，可以这样理解：

- 想要一个最均衡、最适合作为默认参考实现的版本：选 Vue 3
- 想展示 React 原生 hooks 与轻量共享状态组织方式：选 React
- 想展示企业级分层、强约束和长期维护友好性：选 Angular
- 想展示最少样板代码、最快落地速度：选 Svelte

如果后续要继续演进仓库，我建议优先做两件事：

1. 为 Svelte 增补基础测试，至少覆盖创建、查询、管理后台三个关键流程
2. 为 React 增加更明确的状态管理约定，避免后续页面继续扩大后出现 hook 与局部状态职责混杂

## 六、结论

四个前端实现都完成了相同业务目标，但它们体现的是四种完全不同的工程哲学：

- Vue 3 强调“平衡”
- React 强调“组合自由”
- Angular 强调“结构化治理”
- Svelte 强调“轻量直接”

如果只看总代码量，它们差距并不悬殊；真正拉开差异的，是状态抽象层、路由装配方式、组件组织粒度，以及测试与工程化投入。这些差异比“用了什么框架”本身，更能决定后续维护成本和团队协作体验。
