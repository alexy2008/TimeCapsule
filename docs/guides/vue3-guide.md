# Vue 3 前端实现导读

> **适合谁**：有编程基础，了解 HTML/CSS/JS，第一次接触 Vue 3 的开发者
> **配合使用**：打开 `frontends/vue3-ts/` 对照阅读
> **这篇文档讲什么**：解释 Vue 3 的响应式系统和组件设计，
> 追踪一次用户操作从触发到界面更新的完整数据流

---

## 1. Vue 3 是什么

Vue 3 是一个进阶的前端框架，用于构建交互式用户界面。

它解决的核心问题是：**当数据变化时，如何让界面自动更新**。

Vue 3 的答案是：**用 JavaScript Proxy 追踪响应式数据的访问和修改**。当你改变数据包装器内的值时，Vue 会检测变化，自动重新渲染依赖这个数据的视图部分。

和其他框架相比，Vue 3 最不一样的地方：
1. **Composition API**：不强制分离 data/methods/computed，而是用 `ref()` 和 `computed()` 这样的函数来组织逻辑，逻辑更紧密
2. **模板语法**：HTML 模板里用 `v-model`、`@event` 这样的指令，直观清晰，学习曲线短

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
cd frontends/vue3-ts
npm install

# 开发模式（启用热更新）
npm run dev

# 生产构建
npm run build
```

打开 `http://localhost:5173`，你应该看到时间胶囊的首页。

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
├── main.ts                    ← 应用入口，创建 Vue 实例
├── App.vue                    ← 根组件，定义全局框架（header、footer）
├── router/
│   └── index.ts               ← 路由配置（5 个页面）
├── views/                     ← 页面级组件（对应路由）
│   ├── HomeView.vue
│   ├── CreateView.vue
│   ├── OpenView.vue
│   ├── AdminView.vue
│   └── AboutView.vue
├── components/                ← 可复用 UI 组件
│   ├── AppHeader.vue
│   ├── AppFooter.vue
│   ├── CapsuleForm.vue        ← 表单组件
│   ├── CapsuleCard.vue
│   ├── CapsuleTable.vue
│   ├── AdminLogin.vue
│   └── ...
├── composables/               ← 逻辑复用（相当于自定义 Hook）
│   ├── useCapsule.ts          ← 胶囊业务逻辑
│   ├── useTheme.ts            ← 主题切换逻辑
│   ├── useAdmin.ts            ← 管理员认证逻辑
│   ├── useCountdown.ts
│   └── useTechStack.ts
├── api/
│   └── index.ts               ← 后端 API 调用（统一的请求封装）
├── types/
│   └── index.ts               ← TypeScript 类型定义
└── styles/
    └── *.css                  ← 组件层级的样式
```

### 组件 vs 视图

这个项目把 UI 代码分成两类：

**视图（Views）**：对应一个完整页面，绑定路由。比如 `CreateView` 对应 `/create`
路径，它负责页面级别的数据获取和布局。一个视图会导入多个组件。

**组件（Components）**：可复用的 UI 块，不感知路由。比如 `CapsuleForm`
可以在 `CreateView` 或任何其他视图里使用。

> 这个划分是项目的架构约定，不是 Vue 3 的要求。
> Vue 3 本身不区分"视图"和"组件"，都是 `.vue` 单文件。

### API 层与类型定义

`api/index.ts` 和 `types/index.ts` 在**五个前端实现里完全相同**，
和框架无关。这样设计的好处是：切换框架时，API 调用逻辑不需要重写。

---

## 4. 核心概念：Vue 3 的响应式系统

<!-- 
  前端模板的核心差异点：响应式模型是最需要解释清楚的基础概念。
  后端没有对应物，这是前端特有的。
-->

前端框架最核心的问题是：**数据变了，界面怎么知道要更新？**

Vue 3 的答案是 **Reactivity（反应式系统）**。

### 响应式数据是什么

在普通 JavaScript 里，修改一个变量不会触发任何副作用：

```javascript
let count = 0;
count = 1; // 界面不知道，什么都不会发生
```

Vue 3 用 `ref()` 包裹原始值或对象，让 Vue 能够追踪"谁在读这个数据"和"数据什么时候变了"：

```typescript
import { ref } from 'vue'

const count = ref(0)           // 创建响应式数据，初始值为 0
console.log(count.value)       // 读作 count.value(注意需要 .value)
count.value = 1                // 修改时，Vue 追踪到变化
```

当 `count.value` 变化时，Vue 会自动重新渲染**依赖这个值的**所有地方。

#### 为什么有 `.value`？

`ref()` 返回一个对象 `{ value: 0 }`，Vue 用 Proxy 拦截你对 `.value` 的读写操作。如果 Vue 直接返回数字 `0`，无法追踪原始值的变化。

在模板里你可以省略 `.value`，Vue 会自动解包：

```vue
<script setup lang="ts">
import { ref } from 'vue'
const count = ref(0)
</script>

<template>
  <!-- 模板里直接用 count，Vue 自动访问 count.value -->
  <p>计数：{{ count }}</p>
  <!-- 当 count.value 改变时，这一行自动更新 -->
</template>
```

### 这个项目里在哪里用到

主要在 `composables/` 里，以 `useCapsule.ts` 为例：

```typescript
/**
 * composables/useCapsule.ts
 * 胶囊业务逻辑的响应式封装
 */
export function useCapsule() {
  // 创建响应式对象来存储胶囊数据、加载状态、错误信息
  const capsule = ref<Capsule | null>(null)  // 当前胶囊
  const loading = ref(false)                 // 是否正在加载？
  const error = ref<string | null>(null)     // 有没有错误？

  // 创建异步函数，修改上面的响应式数据
  async function create(form: CreateCapsuleForm) {
    loading.value = true      // ← 改变 loading，视图自动更新为"创建中..."
    error.value = null

    try {
      const res = await apiCreate(form)
      capsule.value = res.data // ← 改变 capsule，视图显示新数据
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : '创建失败'  // ← 错误时显示错误信息
    } finally {
      loading.value = false    // ← 改变为 false，按钮重新启用
    }
  }

  // 导出给组件使用
  return { capsule, loading, error, create }
}
```

任何组件都可以导入并使用：

```typescript
import { useCapsule } from '@/composables/useCapsule'

const { capsule, loading, error, create } = useCapsule()
// 现在拥有了这四个响应式对象
```

### 派生数据（`computed()`）

当一个数据是由另一个数据计算得来时，用 `computed()`：

```typescript
import { ref, computed } from 'vue'

const openAt = ref(new Date())
const hoursUntilOpen = computed(() => {
  const now = new Date()
  const diff = openAt.value.getTime() - now.getTime()
  return Math.ceil(diff / (1000 * 60 * 60))  // 计算剩余小时数
})

// 当 openAt 变化时，hoursUntilOpen 自动重新计算
// Vue 只会在需要的时候计算（懒计算）
```

实例：`composables/useCountdown.ts` 就用 `computed()` 计算倒计时：

```typescript
export function useCountdown(openAt: Ref<string>) {
  const now = ref(new Date())

  // ... 更新 now ...

  const hours = computed(() => {
    const then = new Date(openAt.value)
    const diff = then.getTime() - now.value.getTime()
    return Math.floor(diff / 3600000)
  })

  const minutes = computed(() => {
    const then = new Date(openAt.value)
    const diff = then.getTime() - now.value.getTime()
    return Math.floor((diff % 3600000) / 60000)
  })

  return { hours, minutes, seconds } // 派生的响应式值
}
```

**为什么用 `computed()` 而不是普通函数？**
- Vue 会缓存计算结果，同一秒内不重新计算
- 依赖的数据不变，就不重新渲染
- 让性能更好，代码更清晰

---

## 5. 一次用户操作的完整数据流

<!-- 
  前端追踪「创建胶囊」的完整操作流程
  不是追踪「请求」，而是追踪「用户行为」→「数据变化」→「界面更新」
-->

我们追踪用户填写表单、点击「封存胶囊」到看到成功结果的完整过程。

### 第 1 步：用户输入，数据绑定

**文件：** `views/CreateView.vue` → `components/CapsuleForm.vue`

用户在表单里输入标题，Vue 通过 `v-model` 指令把输入同步到响应式状态：

```vue
<!-- components/CapsuleForm.vue -->
<template>
  <input
    id="capsule-title"
    v-model="form.title"          <!-- ← v-model 建立双向绑定 -->
    class="cyber-input"
    placeholder="给时间胶囊取个名字"
  />
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const form = reactive({
  title: '',
  content: '',
  creator: '',
  openAt: '',
})
// v-model 修改 form.title，Vue 追踪到变化
</script>
```

`v-model="form.title"` 相当于：
```vue
:value="form.title"
@input="form.title = $event.target.value"
```

Vue 3 用 `reactive()` 包裹对象（而不是用 `ref()`），这样访问时无需 `.value`。

**重要区别：** Vue 的 `v-model` 是真正的**双向绑定**：
- 用户输入 → `form.title` 同步更新
- 代码修改 `form.title` → 输入框显示最新值

这和 React 的受控组件不同（React 需要手写 onChange handler）。

### 第 2 步：用户提交，调用 Composable

**文件：** `components/CapsuleForm.vue` 的 `handleSubmit` → `views/CreateView.vue`

用户点击"封存胶囊"按钮，触发表单提交：

```vue
<!-- components/CapsuleForm.vue -->
<template>
  <form @submit.prevent="handleSubmit">  <!-- @submit.prevent 阻止默认刷新 -->
    <!-- ... 表单字段 ... -->
    <button type="submit" :disabled="loading">
      {{ loading ? '创建中...' : '封存胶囊' }}
    </button>
  </form>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  submit: [form: CreateCapsuleForm]  // 定义向父组件发送的事件
}>()

async function handleSubmit() {
  if (!validate()) return          // 表单验证
  emit('submit', form)             // 发送事件给父组件
}
</script>
```

父组件 `CreateView.vue` 监听这个事件，调用 Composable：

```typescript
// views/CreateView.vue
<template>
  <CapsuleForm @submit="onSubmit" :loading="loading" />
</template>

<script setup lang="ts">
import { useCapsule } from '@/composables/useCapsule'

const { capsule, loading, create } = useCapsule()

async function onSubmit(form: CreateCapsuleForm) {
  try {
    await create(form)  // ← 调用 Composable 的 create 方法
    // 创建成功后...
    router.push('/open/' + capsule.value?.code)  // 跳转到查看页面
  } catch (e) {
    // 错误处理
  }
}
</script>
```

### 第 3 步：Composable 发起 API 请求

**文件：** `composables/useCapsule.ts` 中的 `create()` 函数

```typescript
async function create(form: CreateCapsuleForm) {
  loading.value = true        // ← 立即改变状态1：加载中
  error.value = null

  try {
    const res = await apiCreate(form)  // ← 调用 API
    capsule.value = res.data           // ← 改变状态2：保存胶囊数据
    return res.data
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : '创建失败'  // ← 改变状态3：保存错误
    throw e
  } finally {
    loading.value = false      // ← 改变状态4：加载完成
  }
}
```

此时发生的变化：
1. `loading.value = true`：组件里的 `{{ loading ? '创建中...' : '封存胶囊' }}` 立刻更新为"创建中..."，按钮禁用
2. API 请求在后台发送到 `/api/v1/capsules`
3. 请求返回后，`capsule.value = res.data`：胶囊对象被保存，用于后续显示

### 第 4 步：响应式触发视图更新

当 `capsule.value` 或 `loading.value` 改变时，Vue 会：

1. **检测依赖**：哪些模板依赖了这些数据？
   ```vue
   {{ loading ? '创建中...' : '封存胶囊' }}   <!-- 依赖 loading -->
   :disabled="loading"                      <!-- 依赖 loading -->
   ```

2. **更新 DOM**：只重新渲染依赖这些数据的部分
   - 按钮文字更新
   - 按钮 disabled 属性更新

3. **不重新渲染**：页面其他部分不动
   - 标题、内容输入框保持原样
   - 其他 UI 元素不变

这就是 Vue 的**响应式系统**的强大之处：你只需改变数据，界面自动跟新。

### 第 5 步：页面跳转与新页面加载

创建成功后，代码跳转到查看页面：

```typescript
router.push('/open/' + capsule.value?.code)
```

Vue Router 会：
1. 更新 URL 为 `/open/Ab3xK9mZ`（新的胶囊码）
2. 清空旧的视图组件（`CreateView`）
3. 加载新的视图组件（`OpenView`）
4. `OpenView` 从路由参数读取 `code`，调用 `useCapsule().get(code)` 加载胶囊详情

```typescript
// views/OpenView.vue
<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useCapsule } from '@/composables/useCapsule'

const route = useRoute()
const { capsule, get } = useCapsule()

// 页面加载时获取胶囊
await get(route.params.code as string)

// 若尚未开启，计算倒计时
const countdown = useCountdown(capsule.value.openAt)
</script>
```

---

## 6. 关键的响应式 API 快速参考

### `ref()` — 简单值的响应式

```typescript
import { ref } from 'vue'
const count = ref(0)
count.value = 1     // 在 <script setup> 中需要 .value
```

模板中自动解包，无需 `.value`：
```vue
<p>{{ count }}</p>   <!-- 显示 1，不需要写 count.value -->
```

### `reactive()` — 对象的响应式

```typescript
import { reactive } from 'vue'
const state = reactive({ x: 1, y: 2 })
state.x = 10        // 直接修改，无需 .value
```

但在 TypeScript 中类型推导不如 `ref()` 好，所以项目多用 `ref()`。

### `computed()` — 派生的响应式数据

```typescript
const hours = computed(() => {
  return Math.floor(milliseconds / 3600000)
})
// 当依赖数据变化时自动重新计算
```

### `watchEffect()` — 监听所有依赖变化

Vue 跟踪 `watchEffect()` 回调里使用的所有响应式数据，当任意一个变化时，回调重新执行：

```typescript
import { watchEffect } from 'vue'

watchEffect(() => {
  console.log('theme changed:', theme.value)  // 当 theme 改变时执行
  document.documentElement.setAttribute('data-theme', theme.value)
})
```

实例：`composables/useTheme.ts` 用它监听主题变化并应用到 DOM。

### `watch()` — 精确监听某个数据

```typescript
import { watch } from 'vue'

watch(
  () => capsule.value?.openAt,  // 监听这个值
  (newTime) => {                 // 当它变化时执行
    // 重新计算倒计时
  }
)
```

---

## 7. 单文件组件（SFC）的结构

Vue 3 用 `.vue` 单文件来定义组件：

```vue
<!-- components/CapsuleCard.vue -->
<template>
  <!-- HTML 模板，使用 {{ }} 插值和 v-* 指令 -->
  <div class="capsule-card cyber-glass">
    <h3>{{ capsule.title }}</h3>
    <p>由 {{ capsule.creator }} 创建</p>
    <p v-if="isOpened">内容：{{ capsule.content }}</p>
    <p v-else>还需等待 {{ hoursLeft }} 小时才能打开</p>
  </div>
</template>

<script setup lang="ts">
// <script setup> 语法是 Vue 3 推荐做法
// 顶级变量和函数会自动暴露给模板

import { computed } from 'vue'
import type { Capsule } from '@/types'

// Props 定义
defineProps<{
  capsule: Capsule
}>()

// 派生数据
const isOpened = computed(() => {
  return new Date() >= new Date(capsule.openAt)
})

const hoursLeft = computed(() => {
  const diff = new Date(capsule.openAt).getTime() - Date.now()
  return Math.ceil(diff / 3600000)
})
</script>

<style scoped>
/* scoped 确保样式只作用于这个组件 */
.capsule-card {
  padding: 1rem;
  border-radius: 8px;
}
</style>
```

**关键语法：**
- `{{ }}` — 插值表达式，显示 JavaScript 值
- `v-if / v-show` — 条件渲染
- `v-for` — 列表渲染
- `@click / @submit` — 事件绑定
- `:class / :style` — 绑定 class 和样式
- `<script setup>` — 现代写法，顶级变量自动暴露

---

## 8. 从 React / Angular 来的开发者对比

### vs React

| 特性 | Vue 3 | React |
|------|-------|-------|
| 状态 | `ref()` | `useState()` |
| 派生 | `computed()` | `useMemo()` |
| 副作用 | `watchEffect()` | `useEffect()` |
| 数据绑定 | `v-model` (双向) | 受控组件 (手写控制) |
| 代码结构 | 响应式优先 (逻辑复用简洁) | Hook 优先 (灵活性高) |

### vs Angular

| 特性 | Vue 3 | Angular |
|------|-------|---------|
| 状态 | `ref()` | `signal()` |
| 派生 | `computed()` | `computed()` |
| 绑定语法 | `v-model` | `[(ngModel)]` |
| 依赖注入 | 无 (Composable 即可) | `@Injectable()` |
| 学习曲线 | 低 | 高 (需学 IoC 容器) |

---

## 9. 常见场景

### 场景 1：表单填充且验证

```typescript
// 目标：实时验证，只在有效时启用提交
const form = reactive({
  email: '',
  password: '',
})

const isValid = computed(() => {
  return form.email.includes('@') && form.password.length >= 8
})
```

模板：
```vue
<button type="submit" :disabled="!isValid">提交</button>
```

### 场景 2：列表渲染，可删除项

```typescript
const items = ref<Item[]>([])

function removeItem(id: string) {
  items.value = items.value.filter(item => item.id !== id)
  // 或用 splice：
  // items.value.splice(items.value.findIndex(i => i.id === id), 1)
}
```

模板：
```vue
<ul>
  <li v-for="item in items" :key="item.id">
    {{ item.name }}
    <button @click="removeItem(item.id)">删除</button>
  </li>
</ul>
```

### 场景 3：等待异步操作（如文件上传）

```typescript
const uploading = ref(false)
const uploadProgress = ref(0)

async function uploadFile(file: File) {
  uploading.value = true
  uploadProgress.value = 0

  try {
    // 模拟上传进度
    for (let i = 1; i <= 10; i++) {
      await new Promise(r => setTimeout(r, 100))
      uploadProgress.value = i * 10
    }
  } finally {
    uploading.value = false
  }
}
```

模板：
```vue
<div v-if="uploading">
  <progress :value="uploadProgress" max="100"></progress>
  <p>{{ uploadProgress }}%</p>
</div>
```

---

## 10. 调试与开发技巧

### 1. Vue DevTools 浏览器扩展

安装 [Vue DevTools](https://devtools.vuejs.org/)，可以：
- 实时看组件树结构
- 检查每个组件的响应式数据
- 追踪事件和生命周期
- 修改响应式数据测试

### 2. 使用 Vite 的快速刷新

开发时，保存文件会立刻更新，不需要刷新浏览器。

### 3. 组件命名约定

项目遵循：
- 大组件（多于一个根元素）：`AppHeader.vue` (PascalCase)
- 在模板里自动转换为 `<AppHeader />`

### 4. TypeScript 类型检查

```bash
npm run typecheck  # 检查类型错误
```

---

## 11. 下一步学习

### 核心知识
- [ ] 完整阅读 [Vue 3 官方文档](https://vuejs.org/) 的《指南》章节
- [ ] 理解生命周期钩子：`onMounted()` / `onUnmounted()`
- [ ] 学习 Teleport 和 Transition（动画过渡）

### 进阶
- [ ] 状态管理：Pinia（官方推荐的轻量级方案）
- [ ] 中大型项目架构

### 实践
- [ ] 在 `components/` 里创建新组件并在多个视图使用
- [ ] 在 `composables/` 里抽离重复的业务逻辑
- [ ] 用 Vue DevTools 追踪数据流

---

## 12. 常见问题排查

**Q：界面没有更新？**  
A：检查是否真的改变了响应式数据。常见错误：
```typescript
// ✗ 错误：外层赋值，Vue 察觉不到
capsule = { ...capsule, title: 'new' }

// ✓ 正确：改 .value 或直接修改对象属性
capsule.value = { ...capsule.value, title: 'new' }
capsule.title = 'new'  // 如果用 reactive()
```

**Q：TypeScript 说类型不匹配？**  
A：检查 `ref()` 的泛型：
```typescript
const data = ref<Capsule | null>(null)  // 指定类型
data.value = capsule                    // TypeScript 检查兼容性
```

**Q：Composable 性能问题？**  
A：每次调用 `useCapsule()` 都会创建新的响应式对象。如果需要跨组件共享状态，改用 Pinia：
```typescript
// 简单方式：导出单例 Composable
export const globalState = useCapsule()
```

---

## 总结

Vue 3 的核心：
1. **响应式** = 用 `ref()` / `reactive()` 包裹数据
2. **自动更新** = Vue 自动检测改变并重新渲染
3. **Composable 复用** = 用函数返回响应式对象，多个组件共享逻辑
4. **模板简洁** = `v-model` / `@event` 指令，无需手工控制

现在打开 `frontends/vue3-ts/` 目录，对照这份导读逐个浏览文件。从 `views/HomeView.vue` 开始，按照导读第 5 节的数据流追踪，你会很快理解整个 Vue 3 的设计。

祝学习愉快！
