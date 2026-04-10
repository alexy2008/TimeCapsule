# SolidJS 前端实现导读

> **适合谁**：有编程基础，了解 HTML/CSS/JS，第一次接触 SolidJS 的开发者
> **配合使用**：打开 `frontends/solid-ts/` 对照阅读
> **这篇文档讲什么**：解释 SolidJS 的细粒度响应式和函数式 UI，
> 追踪一次用户操作从触发到界面更新的完整数据流

---

## 1. SolidJS 是什么

SolidJS 是一个**细粒度响应式**框架，融合了 React 的 JSX 和 Vue 的响应式。

它解决的核心问题是：**当数据变化时，如何高效地让界面自动更新**。

SolidJS 的答案是：**用细粒度的信号和副作用，让框架只更新真正需要改变的 DOM**。不像 React 重新渲染整个组件，SolidJS 只更新改变的部分。

和其他框架相比，SolidJS 最不一样的地方：
1. **细粒度响应式** — 比 Vue 更精确，比 React 更高效
2. **组件执行一次** — React 每次状态改变都重新执行函数，SolidJS 的组件函数只执行一次
3. **JSX 不是 React** — SolidJS 用 JSX 但编译时转换为直接的 DOM 操作

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
cd frontends/solid-ts
npm install

# 开发模式（启用热更新）
npm run dev

# 生产构建
npm run build
```

打开 `http://localhost:5180`，你应该看到时间胶囊的首页。

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
├── main.tsx                    ← 应用入口，挂载根组件
├── App.tsx                     ← 路由配置与全局框架
├── components/                 ← 可复用 UI 组件
│   ├── AppHeader.tsx
│   ├── AppFooter.tsx
│   ├── CapsuleForm.tsx
│   └── ...
├── lib/
│   ├── api/                    ← 后端 API 调用
│   │   └── index.ts
│   ├── types/                  ← TypeScript 类型定义
│   │   └── index.ts
│   └── theme.ts                ← 主题管理（全局信号）
├── routes/                     ← 页面级组件（对应路由）
│   ├── HomeRoute.tsx
│   ├── CreateRoute.tsx
│   ├── OpenRoute.tsx
│   ├── AdminRoute.tsx
│   └── AboutRoute.tsx
└── (styles and assets)
```

### 组件 vs 路由

这个项目把 UI 代码分成两类：

**路由（Routes）**：对应一个完整页面，绑定路由。比如 `CreateRoute` 对应 `/create`
路径，它负责页面级别的数据和布局。

**组件（Components）**：可复用的 UI 块，不感知路由。比如 `CapsuleForm`
可以在 `CreateRoute` 或任何其他路由里使用。

> 这个划分是项目的架构约定，不是 SolidJS 的要求。
> SolidJS 本身都用函数来表示。

### API 层与类型定义

`lib/api/index.ts` 和 `lib/types/index.ts` 在**五个前端实现里完全相同**，
和框架无关。这样设计的好处是：切换框架时，API 调用逻辑不需要重写。

---

## 4. 核心概念：信号与细粒度响应式

前端框架最核心的问题是：**数据变了，界面怎么知道要更新？**

SolidJS 的答案是：**用信号（Signal）和副作用，让 DOM 精确追踪依赖并自动更新**。

### 信号是什么

信号是一个可追踪的响应式值，类似于 Vue 的 `ref()` 但更轻量：

```typescript
import { createSignal } from 'solid-js'

const [count, setCount] = createSignal(0)
// count 是一个读取函数，读作 count()
// setCount 是一个修改函数

console.log(count())    // 读值：0
setCount(1)             // 写值：1
setCount(c => c + 1)    // 函数式更新：2
```

**关键特性**：
- `createSignal()` 返回 `[getter, setter]` 元组
- 读值时必须调用 getter 函数：`count()`
- 改值时调用 setter 函数：`setCount(newValue)`
- SolidJS 自动追踪在副作用里调用过的信号

### 在项目里的用法

在路由组件里会看到多个信号的组合：

```typescript
// routes/CreateRoute.tsx
export default function CreateRoute() {
  const [created, setCreated] = createSignal<Capsule | null>(null)
  const [pendingForm, setPendingForm] = createSignal<CreateCapsuleForm | null>(null)
  const [showConfirm, setShowConfirm] = createSignal(false)
  const [loading, setLoading] = createSignal(false)
  const [error, setError] = createSignal<string | null>(null)

  async function confirmCreate() {
    const form = pendingForm()  // ← 读值：调用 getter
    setLoading(true)            // ← 写值：调用 setter
    setError(null)

    try {
      const response = await createCapsule(form!)
      setCreated(response.data)  // ← 更新状态
    } catch (err) {
      setError(err instanceof Error ? err.message : '创建失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    // JSX 里使用信号
    <>
      <Show when={!created()} fallback={<SuccessView />}>
        <CapsuleForm on:submit={handleSubmit} loading={loading()} />
      </Show>
    </>
  )
}
```

### 派生值（`createMemo()`）

当一个值是由另一个信号计算得来时，用 `createMemo()`：

```typescript
import { createSignal, createMemo } from 'solid-js'

const [count, setCount] = createSignal(0)

// 派生值：当 count 改变时自动重新计算
const doubled = createMemo(() => count() * 2)

// 使用派生值
console.log(doubled())  // 0
setCount(5)
console.log(doubled())  // 10
```

**为什么用 `createMemo()` 而不是普通函数？**
- 缓存计算结果，同一秒内不重新计算
- 避免在组件多次渲染时重复浪费计算
- 精确追踪依赖，只有依赖改变时才重新计算

---

## 5. 一次用户操作的完整数据流

我们追踪用户填写表单、点击「封存胶囊」到看到成功结果的完整过程。

### 第 1 步：用户输入，双向绑定

**文件**：`components/CapsuleForm.tsx`

用户在表单里输入标题。SolidJS 用 `value` + `onInput` 的组合或自定义 hook 来实现双向绑定：

```typescript
// components/CapsuleForm.tsx
import { createSignal } from 'solid-js'
import type { CreateCapsuleForm } from '@/types'

interface Props {
  loading?: boolean
  onSubmit: (form: CreateCapsuleForm) => void
}

export default function CapsuleForm(props: Props) {
  const [form, setForm] = createSignal<CreateCapsuleForm>({
    title: '',
    content: '',
    creator: '',
    openAt: '',
  })

  function updateField(field: keyof CreateCapsuleForm, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      props.onSubmit(form())
    }}>
      <input
        value={form().title}
        onInput={(e) => updateField('title', e.target.value)}
        placeholder="给时间胶囊取个名字"
      />
    </form>
  )
}
```

**注意**：SolidJS 不像 Vue 有 `bind:` 指令或 React 的单一值绑定，而是手动管理：
- `value={form().title}` 读值
- `onInput={(e) => updateField(...)}` 写值

但由于 SolidJS 的响应式运作，这个更新过程非常高效。

### 第 2 步：表单验证与提交

**文件**：`components/CapsuleForm.tsx` 的 `handleSubmit`

用户点击"封存胶囊"按钮，触发表单提交。表单验证后向父组件发送信号：

```typescript
export default function CapsuleForm(props: Props) {
  const [errors, setErrors] = createSignal({
    title: '',
    content: '',
    creator: '',
    openAt: '',
  })

  function validate(): boolean {
    let valid = true
    const newErrors = { title: '', content: '', creator: '', openAt: '' }

    if (!form().title.trim()) {
      newErrors.title = '请输入标题'
      valid = false
    }
    // ... 其他验证 ...

    setErrors(newErrors)
    return valid
  }

  function handleSubmit(e: Event) {
    e.preventDefault()
    if (validate()) {
      props.onSubmit(form())  // 向父组件发送事件
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* ... 表单字段和错误提示 ... */}
    </form>
  )
}
```

父组件 `CreateRoute` 监听这个事件：

```typescript
function handleSubmit(form: CreateCapsuleForm) {
  setPendingForm(form)        // 保存待确认的表单
  setShowConfirm(true)        // 显示确认对话框
}
```

### 第 3 步：确认并调用 API 函数

**文件**：`routes/CreateRoute.tsx`

用户点击确认按钮，执行异步函数进行创建：

```typescript
async function confirmCreate() {
  const form = pendingForm()   // ← 读取待确认的表单
  setShowConfirm(false)

  if (!form) return

  setLoading(true)             // ← 改变状态1：加载中
  setError(null)

  try {
    const response = await createCapsule(form)  // ← 调用 API
    setCreated(response.data)                   // ← 改变状态2：保存胶囊数据
  } catch (err) {
    setError(err instanceof Error ? err.message : '创建失败')  // ← 改变状态3
  } finally {
    setLoading(false)          // ← 改变状态4：加载完成
  }
}
```

### 第 4 步：响应式触发视图更新

当任何信号改变时，SolidJS 会：

1. **检测依赖**：哪个 DOM/组件依赖了这个信号？
   ```tsx
   <button disabled={loading()}>              // 依赖 loading()
     {loading() ? '创建中...' : '确定'}      // 依赖 loading()
   </button>

   <Show when={created()}>                    // 依赖 created()
     <SuccessView capsule={created()} />
   </Show>
   ```

2. **精确更新 DOM**：SolidJS 编译器知道恰好哪个值改变了
   - 按钮文字真正的 DOM 文本节点更新
   - 按钮 disabled 属性更新
   - 条件块 `<Show>` 的显示/隐藏切换

3. **无组件重新渲染** — **这是 SolidJS 最关键的优势**
   - React 重新运行整个函数（CreateView 函数体重新执行）
   - SolidJS 的组件函数只执行一次，只有依赖的 DOM/副作用更新

### 第 5 步：页面跳转

创建成功后，用户点击按钮跳转：

```typescript
const navigate = useNavigate()

function goToView() {
  navigate('/open/' + created()?.code)
}

return <button onClick={goToView}>查看胶囊</button>
```

SolidJS Router 会：
1. 更新 URL 为 `/open/Ab3xK9mZ`
2. 清空旧的路由组件（`CreateRoute`）
3. 加载新的路由组件（`OpenRoute`）
4. `OpenRoute` 从 URL 参数读取 `code`，调用 API 加载胶囊详情

```typescript
// routes/OpenRoute.tsx
export default function OpenRoute() {
  const params = useParams<{ code?: string }>()
  const [capsule, setCapsule] = createSignal<Capsule | null>(null)
  const [loading, setLoading] = createSignal(false)

  // 当路由参数 code 改变时，重新加载
  createEffect(() => {
    if (params.code) {
      loadCapsule(params.code)
    }
  })

  async function loadCapsule(code: string) {
    setLoading(true)
    try {
      const res = await getCapsule(code)
      setCapsule(res.data)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Show when={capsule()} fallback={<p>加载中...</p>}>
      <CapsuleCard capsule={capsule()!} />
    </Show>
  )
}
```

---

## 6. SolidJS 的关键 API

### `createSignal()` — 创建响应式状态

```typescript
const [count, setCount] = createSignal(0)
count()              // 读值（必须调用）
setCount(1)          // 设值
setCount(c => c + 1) // 函数式更新
```

**特性**：
- 返回 `[getter, setter]` 元组
- getter 是函数，必须调用才能读值
- setter 可以接收新值或函数

### `createMemo()` — 派生的响应式值

```typescript
const doubled = createMemo(() => count() * 2)
// 当 count 改变时自动重新计算（有缓存）
```

### `createEffect()` — 副作用

当依赖的信号改变时，自动执行回调：

```typescript
createEffect(() => {
  console.log('count changed:', count())
  document.title = `Count: ${count()}`
})
```

实例：主题切换会用 `createEffect()` 监听主题信号并应用到 DOM：

```typescript
export function useTheme() {
  const [theme, setTheme] = createSignal<Theme>('light')

  createEffect(() => {
    document.documentElement.setAttribute('data-theme', theme())
    localStorage.setItem('theme', theme())
  })

  return { theme, toggleTheme: () => setTheme(t => t === 'light' ? 'dark' : 'light') }
}
```

### `Show` 组件 — 条件渲染

```typescript
<Show when={isLoading()} fallback={<Content />}>
  <LoadingSpinner />
</Show>
```

当 `when` 为真时显示主要内容，否则显示 `fallback`。

### `For` 组件 — 列表渲染

```typescript
<For each={items()} fallback={<p>No items</p>}>
  {(item) => (
    <div>
      {item.name}
      <button onClick={() => removeItem(item.id)}>删除</button>
    </div>
  )}
</For>
```

必须提供 `each` prop（信号列表）和子函数。

### `Switch/Match` — 条件分支

```typescript
<Switch fallback={<p>Unknown</p>}>
  <Match when={status() === 'loading'}>
    <LoadingSpinner />
  </Match>
  <Match when={status() === 'error'}>
    <ErrorMessage />
  </Match>
  <Match when={status() === 'success'}>
    <SuccessView />
  </Match>
</Switch>
```

---

## 7. SolidJS JSX（不是 React）

SolidJS 用 JSX 但编译时进行了特殊处理。理解这个差异很重要：

### JSX 不会创建组件实例

```typescript
// React：render() 时返回 React.createElement() 调用
const element = <Component prop={value} />  // 对象

// SolidJS：注册 DOM 更新，JSX 直接生成 DOM 元素
const element = <Component prop={value} />  // 直接的 DOM
```

### Props 是响应式的

```typescript
interface Props {
  loading?: boolean
  items: () => Item[]  // Props 通常是函数（信号）
}

export default function MyComponent(props: Props) {
  // props.loading 本身不是信号，但值是响应式的
  return <div>{props.loading() && <Spinner />}</div>
}
```

### Props 通过对象传递

```typescript
// 在 SolidJS 中，Props 是模式匹配的对象
export default function Card(props: { title: string; count: () => number }) {
  return <div>{props.title}: {props.count()}</div>
}

// 使用
<Card title="Items" count={items().length} />
```

---

## 8. 从 React / Vue / Angular 来的开发者对比

### vs React

| 特性 | SolidJS | React |
|------|---------|-------|
| 状态 | `createSignal()` | `useState()` |
| 派生 | `createMemo()` | `useMemo()` |
| 副作用 | `createEffect()` | `useEffect()` |
| 组件执行 | 一次 | 每次状态改变都重新执行 |
| 性能 | 细粒度更新，更优 | 整个组件树重新渲染 |
| 学习曲线 | 中等（需理解信号的读写分离） | 陡（Hook 规则复杂） |

### vs Vue 3

| 特性 | SolidJS | Vue 3 |
|------|---------|-------|
| 状态 | Signal (getter/setter 分离) | `ref()` (统一接口) |
| 派生 | `createMemo()` | `computed()` |
| 副作用 | `createEffect()` | `watchEffect()` |
| 性能 | 更精细的粒度 | 比 React 好，不如 SolidJS |

### vs Angular

| 特性 | SolidJS | Angular |
|------|---------|---------|
| 状态 | Signal | `signal()` |
| 派生 | `createMemo()` | `computed()` |
| 框架完整度 | 轻量级（需自己选择路由） | 完整企业级 |
| 学习曲线 | 相对平缓 | 陡（需学装饰器和 DI） |

---

## 9. 常见场景

### 场景 1：表单验证并实时显示错误

```typescript
export default function LoginForm() {
  const [email, setEmail] = createSignal('')
  const [errors, setErrors] = createSignal<string | null>(null)

  const canSubmit = createMemo(() => {
    return email().includes('@') && !errors()
  })

  function updateEmail(value: string) {
    setEmail(value)

    if (!value.includes('@')) {
      setErrors('邮箱格式不正确')
    } else {
      setErrors(null)
    }
  }

  return (
    <>
      <input
        value={email()}
        onInput={(e) => updateEmail(e.target.value)}
      />
      <Show when={errors()}>
        <p class="error">{errors()}</p>
      </Show>
      <button disabled={!canSubmit()}>提交</button>
    </>
  )
}
```

### 场景 2：列表渲染，可删除项

```typescript
interface Item {
  id: string
  name: string
}

export default function ItemList() {
  const [items, setItems] = createSignal<Item[]>([
    { id: '1', name: 'Item 1' },
  ])

  function removeItem(id: string) {
    setItems(prev => prev.filter(item => item.id !== id))
  }

  return (
    <ul>
      <For each={items()}>
        {(item) => (
          <li>
            {item.name}
            <button onClick={() => removeItem(item.id)}>删除</button>
          </li>
        )}
      </For>
    </ul>
  )
}
```

### 场景 3：异步数据加载

```typescript
interface Post {
  id: number
  title: string
}

export default function PostList() {
  const [posts, setPosts] = createSignal<Post[]>([])
  const [loading, setLoading] = createSignal(false)
  const [error, setError] = createSignal<string | null>(null)

  createEffect(() => {
    loadPosts()
  })

  async function loadPosts() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/posts')
      const data = await res.json()
      setPosts(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : '加载失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Show when={!loading()} fallback={<p>加载中...</p>}>
      <Show when={error()} fallback={<PostListView posts={posts()} />}>
        <p>错误：{error()}</p>
      </Show>
    </Show>
  )
}
```

---

## 10. 调试与开发技巧

### 1. 浏览器开发者工具

SolidJS 会生成可读的 JavaScript 代码，可以直接在浏览器里调试。

### 2. 理解信号的读写分离

```typescript
// getter 和 setter 是分开的
const [count, setCount] = createSignal(0)

// 只读值
console.log(count())

// 只写
setCount(1)

// 这种分离让 SolidJS 能更精确地追踪依赖
```

### 3. 避免在渲染中直接调用异步函数

```typescript
// ✗ 不要这样
export default function Component() {
  const data = fetchData()  // 没有等待，不会工作
}

// ✓ 应该这样
export default function Component() {
  const [data, setData] = createSignal(null)

  createEffect(async () => {
    const result = await fetchData()
    setData(result)
  })
}
```

---

## 11. 常见问题排查

**Q：信号没有更新界面？**  
A：检查是否真的调用了 setter：
```typescript
// ✗ 错误：直接改变对象属性
capsule.title = 'new'

// ✓ 正确：调用 setter
setCapsule(prev => ({ ...prev, title: 'new' }))
```

**Q：派生值计算太频繁，性能差？**  
A：检查是否用了 `createMemo()`。没有缓存的派生值会每次都计算：
```typescript
// ✗ 低效：直接在 JSX 里计算
<p>{count() * 2}</p>

// ✓ 高效：用 createMemo() 缓存
const doubled = createMemo(() => count() * 2)
<p>{doubled()}</p>
```

**Q：`createEffect()` 无限循环？**  
A：检查依赖链。如果 effect 里修改了它依赖的信号，会导致循环：
```typescript
// ✗ 危险：effect 依赖 count，但修改了 count
createEffect(() => {
  console.log(count())
  setCount(count() + 1)  // 会无限循环！
})

// ✓ 安全：分离依赖和修改
createEffect(() => {
  console.log(count())  // 只读依赖
})
```

**Q：组件属性没有反应性？**  
A：SolidJS 中 Props 是普通对象，但值可以是信号。如果想要响应式属性，传递信号：
```typescript
// ✓ 正确：Props 值是信号函数
<MyComponent items={items()} />  // items 是信号

// 组件内
export default function MyComponent(props: { items: () => Item[] }) {
  return <For each={props.items()}>...</For>
}
```

---

## 12. 下一步学习

### 核心知识
- [ ] 完整阅读 [SolidJS 官方文档](https://docs.solidjs.com/)
- [ ] 理解信号的读写分离与依赖追踪
- [ ] 学习 Suspense 和异步数据加载
- [ ] 学习性能优化：Lazy, Dynamic 等

### 实践
- [ ] 在 `components/` 里创建新组件
- [ ] 用 `createSignal()` 管理局部状态
- [ ] 用 `createEffect()` 处理副作用
- [ ] 理解组件函数为什么只执行一次（阅读编译后的代码）

---

## 总结

SolidJS 的核心：
1. **信号** = `const [value, setValue] = createSignal(0)`，getter/setter 分离
2. **细粒度更新** = SolidJS 只更新改变的 DOM，不重新执行组件函数
3. **JSX 编译时转换** = JSX 不创建组件实例，而是直接生成 DOM
4. **极高的性能** = 比 React/Vue 都更快，因为更新粒度最细
5. **函数式设计** = 组件就是函数，Props 是参数，返回 JSX

现在打开 `frontends/solid-ts/` 目录，对照这份导读逐个浏览文件。从 `routes/CreateRoute.tsx` 开始，按照导读第 5 节的数据流追踪，你会很快理解 SolidJS 的细粒度响应式设计。

祝学习愉快！
