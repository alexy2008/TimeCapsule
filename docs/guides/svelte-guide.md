# Svelte 前端实现导读

> **适合谁**：有编程基础，了解 HTML/CSS/JS，第一次接触 Svelte 的开发者
> **配合使用**：打开 `frontends/svelte-ts/` 对照阅读
> **这篇文档讲什么**：解释 Svelte 5 的响应式系统和组件设计，
> 追踪一次用户操作从触发到界面更新的完整数据流

---

## 1. Svelte 是什么

Svelte 是一个编译器框架。与 React/Vue 在浏览器里运行框架代码不同，Svelte **在编译时把响应式逻辑转换成原生 JavaScript**。

它解决的核心问题是：**当数据变化时，如何让界面自动更新**。

Svelte 的答案是：**用编译时转换把响应式声明转为命令式更新代码**。你的代码看起来像是普通 JavaScript，但 Svelte 编译器在后台做了魔法。

和其他框架相比，Svelte 最不一样的地方：
1. **编译时响应式** — 不是运行时追踪，而是编译时静态分析和转换
2. **局部作用域** — 组件的样式天然 scoped，无需 CSS-in-JS
3. **极简语法** — `.svelte` 单文件里直接赋值就能触发响应式更新

---

## 2. 先跑起来

### 环境要求

| 工具 | 版本 | 检查命令 |
|------|------|----------|
| Node.js | 18+ | `node -v` |
| npm | 9+ | `npm -v` |

### 启动

```bash
# 安装依赖
cd frontends/svelte-ts
npm install

# 开发模式（启用热更新）
npm run dev

# 生产构建
npm run build
```

打开 `http://localhost:5176`，你应该看到时间胶囊的首页。

> **需要后端吗？**
> 是的，前端需要连接一个后端才能完整运行。推荐先启动 Spring Boot：
> ```bash
> cd backends/spring-boot && ./run
> ```
> 或者用 `scripts/switch-backend.sh` 切换到任意后端。

---

## 3. 目录结构与组件设计思路

```
src/
├── main.ts                    ← 应用入口，挂载根组件
├── App.svelte                 ← 根组件
├── lib/
│   ├── api/
│   │   └── index.ts           ← 后端 API 调用
│   ├── types/
│   │   └── index.ts           ← TypeScript 类型定义
│   ├── components/            ← 可复用 UI 组件
│   │   ├── AppHeader.svelte
│   │   ├── AppFooter.svelte
│   │   ├── CapsuleForm.svelte
│   │   └── ...
│   ├── *-state.svelte.ts      ← 状态管理（命名约定）
│   │   ├── create-state.svelte.ts  ← 创建页面的状态
│   │   ├── open-state.svelte.ts    ← 打开页面的状态
│   │   └── ...
│   └── theme.ts               ← 主题切换（全局状态）
├── views/
│   ├── Home.svelte            ← 页面级组件
│   ├── Create.svelte
│   ├── Open.svelte
│   ├── Admin.svelte
│   └── About.svelte
└── app.css                    ← 全局样式
```

### 组件 vs 视图

这个项目把 UI 代码分成两类：

**视图（Views）**：对应一个完整页面，绑定路由。比如 `Create.svelte` 对应 `/create`
路径，它负责页面级别的状态和布局。

**组件（Components）**：可复用的 UI 块，不感知路由。比如 `CapsuleForm.svelte`
可以在 `Create.svelte` 或任何其他视图里使用。

> 这个划分是项目的架构约定，不是 Svelte 的要求。
> Svelte 本身不区分"视图"和"组件"，都是 `.svelte` 文件。

### API 层与类型定义

`api/index.ts` 和 `types/index.ts` 在**五个前端实现里完全相同**，
和框架无关。这样设计的好处是：切换框架时，API 调用逻辑不需要重写。

---

## 4. 核心概念：Svelte 5 的响应式系统

前端框架最核心的问题是：**数据变了，界面怎么知道要更新？**

Svelte 5 的答案是：**用编译时转换让普通赋值自动触发更新**。

### 响应式就是简单赋值

在 Svelte 里，你只需要普通赋值：

```svelte
<script>
  let count = 0

  function increment() {
    count += 1  // ← 就这样，Svelte 编译器会自动生成响应式逻辑
  }
</script>

<p>计数：{count}</p>
<button on:click={increment}>+1</button>
```

Svelte 编译器在后台：
1. 检测到 `count` 被赋值
2. 自动生成 `count = count + 1` 后触发 DOM 更新的代码
3. 最终生成的 JavaScript 代码会调用内部的 `$$invalidate()` 函数来告诉 Svelte "count 改变了，重新渲染"

**这就是 Svelte 5 的核心魔法**：你写的是普通 JavaScript，但编译器把它转换成响应式的。

### 在项目里的用法

主要在 `*-state.svelte.ts` 文件里定义状态：

```typescript
// lib/create-state.svelte.ts
// Svelte 5 用 $state() rune 来标记响应式对象

const state = $state({
  loading: false,
  error: null as string | null,
  created: null as Capsule | null,
})

export const createState = state

export async function confirmCreateSubmission() {
  state.loading = true        // ← 普通赋值
  state.error = null

  try {
    const response = await createCapsule(state.pendingForm!)
    state.created = response.data  // ← 更新样也是普通赋值
  } catch (e: unknown) {
    state.error = e instanceof Error ? e.message : '创建失败'
  } finally {
    state.loading = false
  }
}
```

在组件里使用：

```svelte
<!-- Create.svelte -->
<script lang="ts">
  import { createState, confirmCreateSubmission } from '../lib/create-state.svelte'
</script>

<button onclick={confirmCreateSubmission} disabled={createState.loading}>
  {createState.loading ? '创建中...' : '确定'}
</button>
```

**关键点**：
- 没有 `useState()` / `signal()` / `ref()` 这样的函数包装
- 就是普通的 JavaScript 对象和赋值
- Svelte 编译器自动把它们转换成响应式的

### 派生值（`$derived` rune）

当一个值是由另一个响应式值计算得来时，用 `$derived`：

```svelte
<script>
  let count = 0
  let doubled = $derived(count * 2)  // 当 count 变化时自动重新计算
</script>

<p>{count} × 2 = {doubled}</p>
```

在 TypeScript 文件里也可以用：

```typescript
// Svelte 5 的 $derived 是 rune，支持在 .svelte.ts 里使用
let hours = $derived.by(() => {
  const diff = new Date(openAt).getTime() - now.getTime()
  return Math.floor(diff / 3600000)
})
```

---

## 5. 一次用户操作的完整数据流

我们追踪用户填写表单、点击「封存胶囊」到看到成功结果的完整过程。

### 第 1 步：用户输入，双向绑定

**文件**：`lib/components/CapsuleForm.svelte`

用户在表单里输入标题。Svelte 用指令 `bind:value` 实现双向绑定：

```svelte
<script lang="ts">
  import type { CreateCapsuleForm } from '../types'

  let form: CreateCapsuleForm = {
    title: '',
    content: '',
    creator: '',
    openAt: '',
  }

  // form 对象在这里可以直接赋值，Svelte 会自动追踪
</script>

<input
  bind:value={form.title}
  placeholder="给时间胶囊取个名字"
/>
```

`bind:value` 相当于：
```svelte
<input
  value={form.title}
  on:input={(e) => form.title = e.target.value}
/>
```

但 Svelte 编译器会优化这个双向绑定，使其高效且简洁。

更新 `form.title` 时，Svelte 自动重新渲染依赖它的所有 DOM。

### 第 2 步：表单验证与提交

**文件**：`lib/components/CapsuleForm.svelte`

用户点击"封存胶囊"按钮，触发表单提交：

```svelte
<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  
  const dispatch = createEventDispatcher<{ submit: CreateCapsuleForm }>()

  function handleSubmit() {
    if (validate()) {
      dispatch('submit', form)  // 向父组件发送事件
    }
  }

  function validate(): boolean {
    // 验证逻辑...
    return isValid
  }
</script>

<form on:submit|preventDefault={handleSubmit}>
  {/* 表单字段 */}
  <button type="submit">封存胶囊</button>
</form>
```

父组件 `Create.svelte` 监听这个事件：

```svelte
<script lang="ts">
  import { submitCreateForm } from '../lib/create-state.svelte'

  function handleSubmit(form: CreateCapsuleForm) {
    submitCreateForm(form)  // 更新全局状态
  }
</script>

<CapsuleForm on:submit={(e) => handleSubmit(e.detail)} />
```

### 第 3 步：状态函数执行确认

**文件**：`Create.svelte` 里的按钮

用户点击确认按钮：

```svelte
<script lang="ts">
  import { createState, confirmCreateSubmission } from '../lib/create-state.svelte'
</script>

<button onclick={confirmCreateSubmission} disabled={createState.loading}>
  确定
</button>
```

### 第 4 步：状态文件发起 API 请求

**文件**：`lib/create-state.svelte.ts`

```typescript
export async function confirmCreateSubmission() {
  state.loading = true        // ← 改变状态1：加载中
  state.error = null

  try {
    const response = await createCapsule(state.pendingForm!)  // ← 调用 API
    state.created = response.data  // ← 改变状态2：保存胶囊数据
  } catch (e: unknown) {
    state.error = e instanceof Error ? e.message : '创建失败'  // ← 保存错误
  } finally {
    state.loading = false      // ← 改变状态3：加载完成
  }
}
```

此时发生的变化：
1. `state.loading = true` → 所有使用 `createState.loading` 的组件自动重新渲染
   - 按钮文字变成"创建中..."
   - 按钮 disabled 变为 true
2. API 请求在后台发送
3. 请求返回后，`state.created = response.data` → 所有使用 `createState.created` 的组件重新渲染
4. `state.loading = false` → 按钮恢复正常

### 第 5 步：响应式触发视图更新

当 `createState.loading` 或 `createState.created` 改变时，Svelte 会：

1. **检测依赖**：哪些地方读取了这个值？
   ```svelte
   {createState.loading ? '创建中...' : '封存胶囊'}   <!-- 依赖 loading -->
   disabled={createState.loading}                    <!-- 依赖 loading -->
   {#if createState.created}                         <!-- 依赖 created -->
     <SuccessView capsule={createState.created} />
   {/if}
   ```

2. **更新 DOM**：只重新渲染依赖这个值的部分
   - 按钮文字更新
   - 按钮 disabled 更新
   - 成功页面出现

3. **不重新渲染**：页面其他部分不动

### 第 6 步：页面跳转

创建成功后，用户可以点击按钮跳转：

```svelte
<script lang="ts">
  import { push } from 'svelte-spa-router'
  import { createState } from '../lib/create-state.svelte'

  function goToView() {
    push(`/open/${createState.created!.code}`)
  }
</script>

<button on:click={goToView}>查看胶囊</button>
```

Svelte 路由器会：
1. 更新 URL 为 `/open/Ab3xK9mZ`
2. 清空旧的组件（`Create.svelte`）
3. 加载新的组件（`Open.svelte`）
4. `Open.svelte` 从 URL 参数读取 `code`，调用 API 加载胶囊详情

```svelte
<!-- Open.svelte -->
<script lang="ts">
  import { params } from 'svelte-spa-router'
  import { openState, loadCapsule } from '../lib/open-state.svelte'

  // 当路由参数 :code 变化时，重新加载
  $: if ($params.code) {
    loadCapsule($params.code)
  }
</script>

{#if openState.loading}
  <p>加载中...</p>
{:else if openState.error}
  <p>{openState.error}</p>
{:else if openState.capsule}
  <CapsuleCard capsule={openState.capsule} />
{/if}
```

---

## 6. Svelte 的响应式语法

### 在组件里声明响应式变量

```svelte
<script>
  let count = 0  // 普通变量，可被追踪
  export let name = ''  // Props（父组件传入）

  // 响应式表达式（自动重新计算）
  $: doubled = count * 2

  // 副作用（当 count 改变时执行）
  $: {
    console.log('count changed:', count)
    document.title = `Count: ${count}`
  }
</script>

<p>{count} × 2 = {doubled}</p>
```

`$:` 前缀是 Svelte 的特殊语法，表示"响应式声明"。编译器会自动把它转换成依赖追踪代码。

### 状态管理（Svelte 5 的 `$state` rune）

```svelte
<script>
  let count = $state(0)  // 显式标记为响应式

  function increment() {
    count++  // 普通赋值，自动触发更新
  }
</script>
```

### 双向绑定（`bind:` 指令）

```svelte
<script>
  let name = ''
</script>

<input bind:value={name} />
<p>Hello, {name}</p>

<!-- bind: 对象属性 -->
<script>
  let user = { name: '', age: 0 }
</script>

<input bind:value={user.name} />
<input type="number" bind:value={user.age} />
```

### 条件渲染（`{#if}` 块）

```svelte
{#if loading}
  <p>加载中...</p>
{:else if error}
  <p>错误：{error}</p>
{:else}
  <p>内容</p>
{/if}
```

### 列表渲染（`{#each}` 块）

```svelte
<script>
  let items = [
    { id: 1, name: 'Item 1' },
  ]
</script>

<ul>
  {#each items as item (item.id)}
    <li>
      {item.name}
      <button on:click={() => removeItem(item.id)}>删除</button>
    </li>
  {/each}
</ul>
```

**关键**：`(item.id)` 是 key，用于追踪列表项的身份。

### 事件处理

```svelte
<button on:click={handleClick}>点击</button>

<!-- 事件修饰符 -->
<form on:submit|preventDefault={handleSubmit}>
  <input on:input={(e) => updateValue(e.target.value)} />
</form>
```

---

## 7. 从 React / Vue / Angular 来的开发者对比

### vs React

| 特性 | Svelte | React |
|------|--------|-------|
| 状态 | 普通变量 | `useState()` |
| 派生 | `$derived` rune | `useMemo()` |
| 副作用 | `$:` 声明 | `useEffect()` |
| 数据绑定 | `bind:value` (双向) | 受控组件（单向） |
| 编译时/运行时 | 编译时转换 | 运行时框架 |
| 代码量 | 极少 | 较多 |

### vs Vue 3

| 特性 | Svelte | Vue 3 |
|------|--------|-------|
| 状态 | 普通变量 | `ref()` |
| 派生 | `$derived` | `computed()` |
| 副作用 | `$:` | `watchEffect()` |
| 编译 | 编译时转换 | 运行时 |
| 框架大小 | 最小 | 中等 |

### vs Angular

| 特性 | Svelte | Angular |
|------|--------|---------|
| 状态 | 普通变量 | `signal()` |
| 派生 | `$derived` | `computed()` |
| 学习曲线 | 平缓（与直觉接近） | 陡（需学装饰器） |
| 框架完整度 | 轻量级 | 完整企业级 |

---

## 8. 常见场景

### 场景 1：表单验证并实时显示错误

```svelte
<script lang="ts">
  let email = ''
  let error = ''

  function updateEmail(value: string) {
    email = value

    if (!value.includes('@')) {
      error = '邮箱格式不正确'
    } else {
      error = ''
    }
  }

  $: canSubmit = email.includes('@') && !error
</script>

<input value={email} on:input={(e) => updateEmail(e.target.value)} />
{#if error}
  <p class="error">{error}</p>
{/if}
<button disabled={!canSubmit}>提交</button>
```

### 场景 2：列表渲染，可删除项

```svelte
<script lang="ts">
  interface Item {
    id: string
    name: string
  }

  let items: Item[] = [
    { id: '1', name: 'Item 1' },
  ]

  function removeItem(id: string) {
    items = items.filter(item => item.id !== id)
  }
</script>

<ul>
  {#each items as item (item.id)}
    <li>
      {item.name}
      <button on:click={() => removeItem(item.id)}>删除</button>
    </li>
  {/each}
</ul>
```

### 场景 3：异步数据加载

```svelte
<script lang="ts">
  import { onMount } from 'svelte'

  interface Post {
    id: number
    title: string
  }

  let posts: Post[] = []
  let loading = false
  let error: string | null = null

  onMount(async () => {
    loading = true
    error = null

    try {
      const res = await fetch('/api/posts')
      posts = await res.json()
    } catch (e) {
      error = e instanceof Error ? e.message : '加载失败'
    } finally {
      loading = false
    }
  })
</script>

{#if loading}
  <p>加载中...</p>
{:else if error}
  <p>错误：{error}</p>
{:else}
  <ul>
    {#each posts as post (post.id)}
      <li>{post.title}</li>
    {/each}
  </ul>
{/if}
```

---

## 9. 调试与开发技巧

### 1. Svelte DevTools 浏览器扩展

虽然生态不如 React/Vue，但 Svelte DevTools 仍能提供：
- 组件树结构
- Props 和响应式变量检查
- 事件追踪

### 2. 样式本地作用域

Svelte 中的 `<style>` 块自动 scoped，无需额外工具：

```svelte
<style>
  /* 这些样式只作用于该组件 */
  p {
    color: red;
  }
</style>

<p>This is red only in this component</p>
```

### 3. 类型检查

```bash
npm run check  # 运行 TypeScript 检查
```

---

## 10. 常见问题排查

**Q：更新对象属性后界面没变？**  
A：赋值必须触发响应式。要么重新赋值整个对象，要么使用扩展语法：
```svelte
<!-- ✗ 错误：只改属性，编译器检测不到 -->
user.name = 'new'

<!-- ✓ 正确：重新赋值对象 -->
user = { ...user, name: 'new' }

<!-- ✓ 或者用 $state() 标记 -->
let user = $state({ name: '' })
user.name = 'new'  // 现在可以了
```

**Q：列表更新后位置错乱，键值混乱？**  
A：检查 `{#each}` 的 key：
```svelte
<!-- ✗ 错误：用索引作 key -->
{#each items as item, index (index)}

<!-- ✓ 正确：用唯一 ID -->
{#each items as item (item.id)}
```

**Q：`$:` 副作用执行太频繁？**  
A：Svelte 会智能追踪依赖。确保只在需要时运行：
```svelte
<!-- 只在 count 改变时执行 -->
$: console.log('count:', count)

<!-- 更明确的依赖指定（旧语法） -->
$: if (count) {
  // 这里会在 count 改变时执行
}
```

**Q：路由参数改变时状态没更新？**  
A：使用 `$:` 响应式声明来追踪路由参数：
```svelte
$: if ($params.code) {
  loadCapsule($params.code)  // 当 code 改变时重新加载
}
```

---

## 11. 下一步学习

### 核心知识
- [ ] 完整阅读 [Svelte 官方文档](https://svelte.dev/docs)
- [ ] 理解编译时转换的优势与限制
- [ ] 学习 Svelte 5 新的 rune 系统
- [ ] 项目规模化：状态管理方式

### 实践
- [ ] 在 `lib/components/` 里创建新组件
- [ ] 在 `lib/*-state.svelte.ts` 里管理页面状态
- [ ] 用浏览器 DevTools 观察生成的 JavaScript 代码（理解编译原理）
- [ ] 优化性能：理解 Svelte 的渲染优化

---

## 总结

Svelte 的核心：
1. **编译时转换** = 普通 JavaScript 由编译器转换为响应式代码
2. **无运行时框架开销** = 最小的包体积和最快的性能
3. **直观的语法** = 赋值就是响应式，`bind:` 就是双向绑定
4. **局部样式** = `<style>` 块自动 scoped
5. **极简的学习曲线** = 最接近"vanilla JavaScript"的框架

现在打开 `frontends/svelte-ts/` 目录，对照这份导读逐个浏览文件。从 `views/Create.svelte` 开始，按照导读第 5 节的数据流追踪，你会很快理解 Svelte 的独特设计。

祝学习愉快！
