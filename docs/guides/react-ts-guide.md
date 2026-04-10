# React 前端实现导读

> **适合谁**：有编程基础，了解 HTML/CSS/JS，第一次接触 React 的开发者
> **配合使用**：打开 `frontends/react-ts/` 对照阅读
> **这篇文档讲什么**：解释 React 的状态管理和组件设计，
> 追踪一次用户操作从触发到界面更新的完整数据流

---

## 1. React 是什么

React 是一个侧重于构建用户界面的 JavaScript 库（不是一个完整框架）。

它解决的核心问题是：**当数据变化时，如何让界面自动更新**。

React 的答案是：**用 JavaScript 函数描述界面，让 React 跟踪状态变化并重新执行这个函数**。

和其他框架相比，React 最不一样的地方：
1. **JSX** — 在 JavaScript 里直接写 HTML-like 语法，逻辑和 UI 紧密耦合
2. **单向数据流** — 数据从父组件通过 Props 流向子组件，子组件通过回调向上更新，不支持双向绑定

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
cd frontends/react-ts
npm install

# 开发模式（启用热更新）
npm run dev

# 生产构建
npm run build
```

打开 `http://localhost:5174`，你应该看到时间胶囊的首页。

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
├── main.tsx                   ← 应用入口，挂载 React 到 DOM
├── App.tsx                    ← 路由配置与全局框架
├── components/                ← 可复用 UI 组件
│   ├── AppHeader.tsx
│   ├── AppFooter.tsx
│   ├── CapsuleForm.tsx        ← 表单组件
│   ├── CapsuleCard.tsx
│   ├── CapsuleTable.tsx
│   ├── AdminLogin.tsx
│   └── ...
├── hooks/                     ← 业务逻辑（相当于 Vue 的 Composable）
│   ├── useCapsule.ts          ← 胶囊业务逻辑
│   ├── useTheme.ts            ← 主题切换逻辑
│   ├── useAdmin.ts            ← 管理员认证逻辑
│   ├── useCountdown.ts
│   └── useTechStack.ts
├── views/                     ← 页面级组件（对应路由）
│   ├── HomeView.tsx
│   ├── CreateView.tsx
│   ├── OpenView.tsx
│   ├── AdminView.tsx
│   └── AboutView.tsx
├── api/
│   └── index.ts               ← 后端 API 调用（统一的请求封装）
├── types/
│   └── index.ts               ← TypeScript 类型定义
└── utils/
    └── *.ts                   ← 工具函数
```

### 组件 vs 视图

这个项目把 UI 代码分成两类：

**视图（Views）**：对应一个完整页面，绑定路由。比如 `CreateView` 对应 `/create`
路径，它负责页面级别的数据获取和布局。

**组件（Components）**：可复用的 UI 块，不感知路由。比如 `CapsuleForm`
可以在 `CreateView` 或任何其他视图里使用。

> 这个划分是项目的架构约定，不是 React 的要求。
> React 本身不区分"视图"和"组件"，都是组件。

### API 层与类型定义

`api/index.ts` 和 `types/index.ts` 在**五个前端实现里完全相同**，
和框架无关。这样设计的好处是：切换框架时，API 调用逻辑不需要重写。

---

## 4. 核心概念：React 的状态与 Hook

前端框架最核心的问题是：**数据变了，界面怎么知道要更新？**

React 的答案是 **Hook（特别是 `useState`）**。

### 状态是什么

在普通 JavaScript 里，修改一个变量不会触发任何副作用：

```javascript
let count = 0;
count = 1; // 界面不知道，什么都不会发生
```

React 用 `useState()` Hook 来创建可追踪的状态：

```typescript
import { useState } from 'react'

const [count, setCount] = useState(0)
// count = 0（状态值）
// setCount(1) → React 检测到状态改变，重新渲染组件
```

**关键特性**：
- 调用 `setCount(1)` 时，React 不会立刻改变 `count`
- 而是将这个更新入队，然后重新执行父函数（重新渲染）
- 在新一轮渲染中，`count` 的值是 `1`
- 依赖这个 `count` 的所有 JSX 都会用新值重新计算

### 这个项目里在哪里用到

主要在 `hooks/`目录，以 `useCapsule.ts` 为例：

```typescript
/**
 * hooks/useCapsule.ts
 * 胶囊业务逻辑的状态管理
 */
export function useCapsule() {
  // 创建多个状态来存储胶囊数据、加载状态、错误信息
  const [capsule, setCapsule] = useState<Capsule | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 创建异步函数，修改上面的状态
  const create = useCallback(async (form: CreateCapsuleForm) => {
    setLoading(true)        // ← 同步改变状态，组件立刻重新渲染
    setError(null)

    try {
      const res = await apiCreate(form)
      setCapsule(res.data)  // ← 异步改变状态，当 API 返回时重新渲染
      return res.data
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : '创建失败'
      setError(msg)        // ← 错误时显示错误信息
    } finally {
      setLoading(false)    // ← 改为 false，按钮重新启用
    }
  }, [])

  // 导出给组件使用
  return { capsule, loading, error, create, get, clear }
}
```

任何组件都可以调用这个 Hook 来获得状态：

```typescript
const { capsule, loading, create } = useCapsule()
// 现在拥有了这三个状态和 create 方法
```

### 派生数据（`useMemo()`）

当一个值是由其他状态计算得来时，用 `useMemo()`：

```typescript
const minDateTime = useMemo(() => {
  const now = new Date()
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
  return now.toISOString().slice(0, 16)  // 格式化为输入框可用的格式
}, [])  // 依赖列表为空，说明这个值永远不会变
```

实例：`hooks/useCountdown.ts` 就用 `useMemo()` 计算倒计时：

```typescript
export function useCountdown(openAt: string) {
  const [now, setNow] = useState(new Date())

  // ... 如果 openAt 或 now 改变，重新计算小时数 ...

  const hours = useMemo(() => {
    const then = new Date(openAt)
    const diff = then.getTime() - now.getTime()
    return Math.floor(diff / 3600000)
  }, [openAt, now])  // 这两个值变化时重新计算

  return { hours, minutes, seconds } // 派生的值
}
```

**为什么用 `useMemo()` 而不是每次都计算？**
- 避免重复计算（特别是在复杂的计算逻辑中）
- 在传给子组件时，可以通过 `React.memo()` 来避免不必要的重新渲染
- 代码意图更清晰

---

## 5. 一次用户操作的完整数据流

我们追踪用户填写表单、点击「封存胶囊」到看到成功结果的完整过程。

### 第 1 步：用户输入，受控组件

**文件**：`views/CreateView.tsx` → `components/CapsuleForm.tsx`

用户在表单里输入标题。React 通过**受控组件**把输入同步到状态：

```tsx
// components/CapsuleForm.tsx
export default function CapsuleForm({ loading, onSubmit }: Props) {
  const [form, setForm] = useState<CreateCapsuleForm>({
    title: '',
    content: '',
    creator: '',
    openAt: '',
  })

  // 当用户输入时调用这个函数
  function updateField(field: keyof CreateCapsuleForm, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  return (
    <input
      value={form.title}
      onChange={e => updateField('title', e.target.value)}
      placeholder="给时间胶囊取个名字"
    />
  )
}
```

**受控组件的流程**：
1. 用户键入 → 触发 `onChange`
2. `updateField('title', '新标题')` 调用 `setForm()`
3. React 更新状态，重新渲染这个组件
4. `value={form.title}` 用新值更新输入框内容

**重要区别**：React 是**单向绑定**，不像 Vue 的双向绑定：
- 必须手动在 `onChange` 里更新状态
- 状态才会反映回输入框
- 但这种显式的控制流在大型应用中更容易追踪

### 第 2 步：表单验证与提交

**文件**：`components/CapsuleForm.tsx` 的 `handleSubmit`

用户点击"封存胶囊"按钮，触发表单提交：

```tsx
function validate(): boolean {
  let valid = true
  const newErrors = { title: '', content: '', creator: '', openAt: '' }

  if (!form.title.trim()) {
    newErrors.title = '请输入标题'
    valid = false
  }
  // ... 其他验证 ...
  
  setErrors(newErrors)        // 更新错误状态，界面显示错误提示
  return valid
}

function handleSubmit(e: FormEvent) {
  e.preventDefault()           // 防止浏览器默认刷新
  if (validate()) {
    onSubmit({ ...form })     // 向父组件发送事件
  }
}

return (
  <form onSubmit={handleSubmit}>
    {/* 错误提示依赖于 errors 状态 */}
    {errors.title && <p className="form-error">{errors.title}</p>}
    {/* ... */}
  </form>
)
```

父组件 `CreateView.tsx` 监听这个事件，调用 Hook 来创建胶囊：

```typescript
// views/CreateView.tsx
export default function CreateView() {
  const { loading, create } = useCapsule()
  const [created, setCreated] = useState<Capsule | null>(null)
  const [pendingForm, setPendingForm] = useState<CreateCapsuleForm | null>(null)

  async function confirmCreate() {
    if (!pendingForm) return
    try {
      const result = await create(pendingForm)  // ← 调用 Hook 的 create 方法
      setCreated(result)                        // ← 创建成功后显示成功页面
    } catch {
      // 错误在 Hook 中处理
    }
  }

  // 如果已创建，显示成功页面而不是表单
  if (created) {
    return <SuccessView capsule={created} />
  }

  // 否则显示表单
  return <CapsuleForm onSubmit={handleSubmit} loading={loading} />
}
```

### 第 3 步：Hook 发起 API 请求

**文件**：`hooks/useCapsule.ts` 中的 `create()` 函数

```typescript
const create = useCallback(async (form: CreateCapsuleForm) => {
  setLoading(true)        // ← 立刻改变状态1：加载中
  setError(null)

  try {
    const res = await apiCreate(form)  // ← 调用 API（异步）
    setCapsule(res.data)               // ← 改变状态2：保存胶囊数据
    return res.data
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : '创建失败'
    setError(msg)                      // ← 改变状态3：保存错误
    throw e
  } finally {
    setLoading(false)      // ← 改变状态4：加载完成
  }
}, [])
```

此时发生的变化：
1. `setLoading(true)` → 组件使用这个 loading 状态，重新渲染
   - 按钮文字从"封存胶囊"变成"创建中..."
   - 按钮 disabled 属性变为 true
2. API 请求发送到后端
3. 请求返回后，`setCapsule(res.data)` 保存新胶囊数据
4. 组件订阅了这个 capsule 状态，重新渲染展示成功信息

### 第 4 步：界面自动更新

当 `loading` 或 `created` 变化时，React 会：

1. **检测依赖**：哪些 JSX 依赖了这些状态？
   ```tsx
   {loading ? '创建中...' : '封存胶囊'}   // 依赖 loading
   <button disabled={loading}>            // 依赖 loading
   {created && <SuccessView />}           // 依赖 created
   ```

2. **更新 DOM**：只重新渲染依赖这些状态的部分
   - 按钮文字更新
   - 按钮 disabled 更新
   - 成功页面出现

3. **高効**：React 的 Virtual DOM 会计算出最小的 DOM 改变

### 第 5 步：页面跳转

创建成功后，用户点击跳转按钮：

```typescript
const navigate = useNavigate()

function goToView() {
  navigate('/open/' + created.code)
}
```

React Router 会：
1. 更新 URL 为 `/open/Ab3xK9mZ`
2. 匹配到 `<Route path="/open/:code?" element={<OpenView />} />`
3. 清空旧的组件（`CreateView`）
4. 加载新的组件（`OpenView`）
5. `OpenView` 从 URL 参数读取 `code`，调用 Hook 加载胶囊详情

```typescript
// views/OpenView.tsx
import { useParams } from 'react-router-dom'

export default function OpenView() {
  const { code } = useParams<{ code?: string }>()
  const { capsule, get, loading } = useCapsule()

  // 当组件挂载且 code 存在时，获取胶囊
  useEffect(() => {
    if (code) {
      get(code)
    }
  }, [code, get])

  // 若尚未开启，计算倒计时
  const countdown = useCountdown(capsule?.openAt || '')

  return (
    <div>
      {loading && <p>加载中...</p>}
      {capsule && (
        <div>
          <h2>{capsule.title}</h2>
          {isOpened ? (
            <p>{capsule.content}</p>
          ) : (
            <p>还需等待 {countdown.hours} 小时</p>
          )}
        </div>
      )}
    </div>
  )
}
```

---

## 6. 关键的 Hook API 快速参考

### `useState()` — 创建状态

```typescript
const [count, setCount] = useState(0)
setCount(1)     // 同步更新，同步触发重新渲染
setCount(c => c + 1)  // 函数式更新（推荐，确保用最新值）
```

### `useEffect()` — 副作用

```typescript
useEffect(() => {
  // 组件挂载或依赖项变化时执行
  document.title = `Count: ${count}`

  // 可选：清理函数（组件卸载时执行）
  return () => {
    document.title = 'Default'
  }
}, [count])  // 依赖项列表
```

常见用法：
- 获取数据：`useEffect(() => { fetchData() }, [id])`
- 监听事件：`useEffect(() => { window.addEventListener(...) }, [])`
- 计时器：`useEffect(() => { const timer = setInterval(...) }, [])`

### `useCallback()` — 记忆化函数

```typescript
const handleClick = useCallback(() => {
  console.log(count)
}, [count])  // 当 count 变化时，重新创建函数
```

用途：
- 传给子组件时避免不必要的重新渲染（配合 `React.memo()`）
- 在 `useEffect` 依赖列表里使用

### `useMemo()` — 记忆化值

```typescript
const expensiveValue = useMemo(() => {
  return fibonacci(count)  // 复杂计算
}, [count])  // 只在 count 变化时重新计算
```

### `useRef()` — 持久化变量（不触发重新渲染）

```typescript
const inputRef = useRef<HTMLInputElement>(null)

function focusInput() {
  inputRef.current?.focus()
}

return <input ref={inputRef} />
```

### `useContext()` — 全局状态

```typescript
const theme = useContext(ThemeContext)
```

用来避免 Props 深层传递。

### `useSyncExternalStore()` — 订阅外部状态

项目用它来管理全局主题：

```typescript
// hooks/useTheme.ts
export function useTheme() {
  const theme = useSyncExternalStore(
    subscribe,      // 订阅函数
    getSnapshot,    // 读取当前状态
  )

  return { theme, setTheme }
}
```

---

## 7. 函数式组件与 JSX

React 组件是一个返回 JSX 的函数：

```tsx
// components/CapsuleCard.tsx
import type { Capsule } from '@/types'

interface Props {
  capsule: Capsule
}

export default function CapsuleCard({ capsule }: Props) {
  const isOpened = new Date() >= new Date(capsule.openAt)

  return (
    <div className="capsule-card cyber-glass">
      <h3>{capsule.title}</h3>
      <p>由 {capsule.creator} 创建</p>
      {isOpened ? (
        <p>内容：{capsule.content}</p>
      ) : (
        <p>还不能打开...</p>
      )}
    </div>
  )
}
```

**关键特性**：
- Props 是函数参数（一个对象）
- JSX（花括号 `{}` 嵌入 JavaScript）代替模板语言
- 条件渲染用 `? :` 或 `&&` 运算符
- 列表渲染用 `array.map()`

### Hooks 的使用规则

1. **只在顶级调用**：不能在条件、循环、嵌套函数里调用 Hook
   ```tsx
   // ✓ 正确
   const [count, setCount] = useState(0)
   
   // ✗ 错误
   if (shouldRender) {
     const [count, setCount] = useState(0)  // 危险！
   }
   ```

2. **只在 React 函数组件里调用**：不能在普通 JavaScript 函数里调用
   ```tsx
   // ✓ 正确 - 在组件内
   function MyComponent() {
     const [count, setCount] = useState(0)
   }
   
   // ✗ 错误 - 在普通函数里
   function regularFunction() {
     const [count, setCount] = useState(0)  // 不行
   }
   ```

3. **自定义 Hook 也遵循规则**
   ```tsx
   // ✓ 自定义 Hook（可以调用 Hook）
   function useCapsule() {
     const [capsule, setCapsule] = useState(null)
     return { capsule }
   }
   ```

---

## 8. 从 Vue 3 / Angular 来的开发者对比

### vs Vue 3

| 特性 | React | Vue 3 |
|------|-------|-------|
| 状态 | `useState()` | `ref()` |
| 派生 | `useMemo()` | `computed()` |
| 副作用 | `useEffect()` | `watchEffect()` |
| 数据绑定 | 受控组件（单向） | `v-model`（双向） |
| 模板 | JSX (JavaScript) | 模板语言 + 指令 |
| 学习曲线 | 陡（需要理解受控组件） | 平缓 |

### vs Angular

| 特性 | React | Angular |
|------|-------|---------|
| 状态 | `useState()` | `signal()` |
| 派生 | `useMemo()` | `computed()` |
| 框架完整度 | 库（自由但需自己选择工具） | 完整框架 |
| 依赖注入 | 无 (Hook 即可) | `@Injectable()` |
| 学习曲线 | 中等 | 陡（需学 IoC 容器、装饰器） |

---

## 9. 常见场景

### 场景 1：表单验证并实时显示错误

```typescript
export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({ email: '', password: '' })

  // 派生：是否可以提交
  const canSubmit = useMemo(() => {
    return email.includes('@') && password.length >= 8
  }, [email, password])

  function updateEmail(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    setEmail(value)
    
    // 实时验证
    if (!value.includes('@')) {
      setErrors(prev => ({ ...prev, email: '邮箱格式不正确' }))
    } else {
      setErrors(prev => ({ ...prev, email: '' }))
    }
  }

  return (
    <form>
      <input value={email} onChange={updateEmail} />
      {errors.email && <p className="error">{errors.email}</p>}
      
      <button disabled={!canSubmit}>提交</button>
    </form>
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
  const [items, setItems] = useState<Item[]>([
    { id: '1', name: 'Item 1' },
  ])

  function removeItem(id: string) {
    setItems(prev => prev.filter(item => item.id !== id))
  }

  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          {item.name}
          <button onClick={() => removeItem(item.id)}>删除</button>
        </li>
      ))}
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
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
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

    loadPosts()
  }, [])  // 空依赖：只在挂载时执行一次

  if (loading) return <p>加载中...</p>
  if (error) return <p>错误：{error}</p>

  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

---

## 10. 调试与开发技巧

### 1. React DevTools 浏览器扩展

安装 [React DevTools](https://react-devtools-tutorial.vercel.app/)，可以：
- 实时看组件树结构
- 检查每个组件的 Props 和 State
- 看 Hook 调用顺序和依赖项
- 修改 State 和 Props 测试

### 2. 规则检查：ESLint 的 `exhaustive-deps`

```typescript
useEffect(() => {
  console.log(count)
}, [])  // ESLint 会警告：count 在依赖里缺失
```

应该是：
```typescript
useEffect(() => {
  console.log(count)
}, [count])  // 正确
```

### 3. 性能优化：`React.memo()` 和 `useCallback()`

当父组件重新渲染时，子组件不需要重新渲染：

```typescript
const CapsuleCard = React.memo(({ capsule }: Props) => {
  return <div>{capsule.title}</div>
})

// 父组件
function ParentView() {
  const handleDelete = useCallback((id: string) => {
    // ...
  }, [])  // 函数不会频繁重新创建

  return <CapsuleCard key={capsule.id} onDelete={handleDelete} />
}
```

### 4. Vite 的极速热更新

保存文件会立刻更新，无需刷新浏览器。这是 Vite 的特性。

---

## 11. 常见问题排查

**Q：状态没有更新？**  
A：检查是否真的调用了 setter 函数。常见错误：
```typescript
// ✗ 错误：直接改变状态（React 察觉不到）
capsule.title = 'new'

// ✓ 正确：调用 setter
setCapsule({ ...capsule, title: 'new' })
```

**Q：组件状态莫名其妙重置了？**  
A：检查 key。在列表里 key 很重要：
```typescript
// ✗ 错误：用索引作 key，列表重新排序时状态混乱
{items.map((item, index) => <Item key={index} item={item} />)}

// ✓ 正确：用唯一 ID
{items.map(item => <Item key={item.id} item={item} />)}
```

**Q：无限循环/性能问题？**  
A：检查 `useEffect` 的依赖项：
```typescript
// ✗ 错误：没有依赖项，每次渲染都执行
useEffect(() => {
  fetchData()
})

// ✓ 正确：指定依赖项
useEffect(() => {
  fetchData()
}, [id])  // 只在 id 变化时执行
```

**Q：TypeScript 说类型不匹配？**  
A：检查 Props 类型定义：
```typescript
interface Props {
  capsule: Capsule
  onSubmit: (code: string) => void
}

export default function MyComponent({ capsule, onSubmit }: Props) {
  // TypeScript 检查 Props 类型
}
```

---

## 12. 下一步学习

### 核心知识
- [ ] 完整阅读 [React 官方文档](https://react.dev/)
- [ ] 深入理解虚拟 DOM 和 Fiber 架构
- [ ] 学习更多 Hook：`useReducer()`, `useContext()`, 自定义 Hook

### 状态管理
- [ ] 小型应用：直接用 `useState()` + 自定义 Hook
- [ ] 中型应用：Redux, Zustand（轻量级）
- [ ] 测试很重要：学会用 `@testing-library/react`

### 进阶
- [ ] 性能优化：Suspense, Code Splitting, Lazy Loading
- [ ] 服务器端渲染：Next.js

### 实践
- [ ] 在 `components/` 里创建新组件并在多个视图使用
- [ ] 在 `hooks/` 里抽离重复的业务逻辑成自定义 Hook
- [ ] 用 React DevTools 追踪数据流和性能问题

---

## 总结

React 的核心：
1. **组件是函数** = 输入 Props，输出 JSX
2. **状态改变触发重新渲染** = `useState()` 更新状态，组件自动重新执行
3. **单向数据流** = 父 → 子通过 Props，子 → 父通过回调
4. **Hook 是逻辑复用** = 自定义 Hook 来封装可复用的逻辑
5. **受控组件** = 手动控制表单状态，虽然麻烦但清晰可控

现在打开 `frontends/react-ts/` 目录，对照这份导读逐个浏览文件。从 `views/CreateView.tsx` 开始，按照导读第 5 节的数据流追踪，你会很快理解整个 React 的设计。

祝学习愉快！

这个文件在所有前端实现中完全一致，只是标准的 `fetch` 封装。

### 第 4 步：响应回来，状态更新

**文件**：`src/hooks/useCapsule.ts`
```tsx
const res = await apiCreate(form)
setCapsule(res.data) // 更新数据
setLoading(false)   // 关闭加载态
```

状态更新后，React 会重新渲染调用了这个 Hook 的组件。

### 第 5 步：界面反映结果

**文件**：`src/views/CreateView.tsx`
```tsx
if (created) {
  // 渲染成功页面
  return <div className="success-container">...</div>
}

// 否则渲染表单页面
return <CapsuleForm loading={loading} onSubmit={handleSubmit} />
```

`created` 有值后，React 会销毁旧的 DOM 树（表单），并创建新的 DOM 树（成功结果）。

---

## 6. 组件通信：数据如何在组件间流动

React 的组件通信遵循 **单向数据流** 原则。

### 父组件向子组件传数据：Props

**场景**：`CreateView` 把加载状态传给 `CapsuleForm`
```tsx
// CreateView.tsx
<CapsuleForm loading={loading} onSubmit={handleSubmit} />

// CapsuleForm.tsx
export default function CapsuleForm({ loading, onSubmit }: Props) {
  // ...
}
```

### 子组件向父组件报告事件：Callbacks

**场景**：`CapsuleForm` 提交成功后调用父级传入的 `onSubmit` 函数
```tsx
function handleSubmit(e: FormEvent) {
  e.preventDefault()
  if (validate()) {
    onSubmit({ ...form })
  }
}
```

### 跨组件共享状态

**场景**：主题切换（深色/浅色）需要全局共享。

**文件**：`src/hooks/useTheme.ts`
```tsx
export function useTheme() {
  // 使用 useSyncExternalStore 订阅外部的全局 state，无需 Context
  const currentTheme = useSyncExternalStore(subscribe, getSnapshot)
  
  const toggle = useCallback(() => {
    setTheme(currentTheme === 'light' ? 'dark' : 'light')
  }, [currentTheme])

  return { theme: currentTheme, toggle }
}
```

React 这里用 `useSyncExternalStore` 演示了如何不借助 Context 或状态管理库，实现跨组件的状态同步。

---

## 7. 这个框架的独特写法

### Hooks (自定义 Hook)

React 推荐将有状态逻辑从 UI 中分离。在 HelloTime 中，业务逻辑都被封装成了以 `use` 开头的函数。
```tsx
const { capsule, loading, create } = useCapsule()
```
这种写法让组件变得非常薄，易于维护。

### JSX 与条件渲染

React 没有类似指令（如 `v-if` 或 `*ngIf`）的概念，而是直接使用 JavaScript 逻辑。
```tsx
{error && <div className="error">{error}</div>}
```

### 组件级懒加载 (Lazy Loading)

为了优化首屏加载，我们在 `App.tsx` 中将页面分成了不同的代码块。
```tsx
const HomeView = lazy(() => import('@/views/HomeView'))
```

---

## 8. 主题切换：一个完整的跨组件功能

主题切换涉及：全局状态 → 组件读取 → DOM 属性变化 → CSS 响应。

**文件**：`src/hooks/useTheme.ts` 负责状态管理。
**文件**：`src/components/ThemeToggle.tsx` 负责触发。

流程是：
1. 点击切换按钮 -> 调用 `toggle()`。
2. `setTheme` 修改模块内部的 `theme` 变量。
3. `applyTheme` 将 `theme` 写入 `localStorage` 并修改 `document.documentElement.setAttribute('data-theme', t)`。
4. `listeners.forEach` 触发，所有订阅了 `useTheme` 的组件都会重新渲染。
5. `spec/styles/cyber.css` 中的 `[data-theme="dark"]` 选择器生效，全局配色自动切换。

---

## 9. 与其他前端实现的关键差异

**响应式模型**：React 用 `useState` 和显式的更新函数（手动触发重绘），而 Vue/Svelte/Angular 更多是依赖于对象拦截或编译时转换，支持直接修改变量。

**模板写法**：React 使用 JSX，是完全的 JavaScript 语法；Vue/Svelte 使用传统的模板扩展。

**CSS 实操**：React 这里使用了 **CSS Modules**（文件名以 `.module.css` 结尾），这会给类名增加哈希后缀，防止全局样式冲突。

**路由集成**：React 使用 `react-router-dom`，路由参数通过 `useParams` Hook（或在 `App.tsx` 中配置）传入。

---

## 10. 延伸阅读

| 资源 | 说明 |
|------|------|
| [React 官方文档](https://react.dev/) | 建议先看 "Thinking in React" |
| `spec/styles/cyber.css` | 项目共享设计系统，CSS 变量定义在这里 |
| `docs/frontend-comparison.md` | 五个前端实现横向对比 |
