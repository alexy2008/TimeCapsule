# Angular 前端实现导读

> **适合谁**：有编程基础，了解 HTML/CSS/JS，第一次接触 Angular 的开发者
> **配合使用**：打开 `frontends/angular-ts/` 对照阅读
> **这篇文档讲什么**：解释 Angular 的信号系统和依赖注入设计，
> 追踪一次用户操作从触发到界面更新的完整数据流

---

## 1. Angular 是什么

Angular 是一个完整的、企业级的前端框架（不是库）。它提供了从路由到 HTTP 到表单验证的一整套工具。

它解决的核心问题是：**当数据变化时，如何让界面自动更新**。

Angular 的答案是：**用信号（Signal）追踪响应式状态，用依赖注入（Dependency Injection）管理组件间的依赖**。

和其他框架相比，Angular 最不一样的地方：
1. **依赖注入** — 所有服务通过 `inject()` 获取，不像 Vue/React 的 Hook 直接导入
2. **强类型与装饰器** — 使用 TypeScript 装饰器 `@Component` / `@Injectable` 定义元数据
3. **Signal vs RxJS** — 新版本用轻量级的 Signal，旧版本用复杂的 observables

---

## 2. 先跑起来

### 环境要求

| 工具 | 版本 | 检查命令 |
|------|------|----------|
| Node.js | 20+ | `node -v` |
| npm | 10+ | `npm -v` |

### 启动

```bash
# 安装依赖
cd frontends/angular-ts
npm install

# 开发模式（启用热更新）
npm run dev

# 生产构建
npm run build
```

打开 `http://localhost:5175`，你应该看到时间胶囊的首页。

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
├── main.ts                      ← 应用入口，bootstrap 应用
├── app/
│   ├── app.config.ts            ← 配置路由、HTTP、动画等提供者
│   ├── app.component.ts         ← 根组件
│   ├── app.routes.ts            ← 路由定义
│   ├── services/                ← 业务逻辑（依赖注入）
│   │   ├── capsule.service.ts   ← 胶囊业务逻辑
│   │   ├── theme.service.ts     ← 主题管理
│   │   ├── admin.service.ts
│   │   └── ...
│   ├── components/              ← 可复用 UI 组件
│   │   ├── app-header/
│   │   ├── app-footer/
│   │   ├── capsule-form/
│   │   └── ...
│   ├── views/                   ← 页面级组件（对应路由）
│   │   ├── home/
│   │   ├── create/
│   │   ├── open/
│   │   ├── admin/
│   │   └── about/
│   ├── types/
│   │   └── index.ts             ← TypeScript 类型定义
│   └── api/
│       └── index.ts             ← 后端 API 调用
```

### 组件 vs 视图

这个项目把 UI 代码分成两类：

**视图（Views）**：对应一个完整页面，绑定路由。比如 `CreateComponent` 对应 `/create`
路径，它负责页面级别的数据获取和布局。

**组件（Components）**：可复用的 UI 块，不感知路由。比如 `CapsuleFormComponent`
可以在 `CreateComponent` 或任何其他视图里使用。

> 这个划分是项目的架构约定，不是 Angular 的要求。
> Angular 本身都用 Component 来表示。

### API 层与类型定义

`api/index.ts` 和 `types/index.ts` 在**五个前端实现里完全相同**，
和框架无关。这样设计的好处是：切换框架时，API 调用逻辑不需要重写。

---

## 4. 核心概念：Signal 与依赖注入

前端框架最核心的问题是：**数据变了，界面怎么知道要更新？**

Angular 新版本的答案是 **Signal（信号）**。

### 什么是 Signal

Signal 是一个包装器，用来追踪数据变化：

```typescript
import { signal } from '@angular/core'

const count = signal(0)      // 创建信号，初始值为 0
console.log(count())         // 读作 count()（注意是函数调用）
count.set(1)                 // 设置新值
count.update(c => c + 1)     // 函数式更新
```

当 `count` 变化时，Angular 会追踪哪些组件依赖了 `count`，并自动重新渲染这些组件。

### 依赖注入模式

Angular 用**服务** + **依赖注入**来管理业务逻辑。服务是单例，被所有组件共享：

```typescript
// services/capsule.service.ts
import { Injectable, signal } from '@angular/core'

@Injectable({ providedIn: 'root' })  // 声明为全局单例服务
export class CapsuleService {
  readonly capsule = signal<Capsule | null>(null)
  readonly loading = signal(false)
  
  async create(form: CreateCapsuleForm) {
    this.loading.set(true)
    try {
      const res = await apiCreate(form)
      this.capsule.set(res.data)
      return res.data
    } finally {
      this.loading.set(false)
    }
  }
}
```

组件通过 `inject()` 获取服务：

```typescript
// views/create.component.ts
import { Component, inject } from '@angular/core'

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CapsuleFormComponent],
})
export class CreateComponent {
  // 依赖注入：获取服务实例
  private readonly capsuleService = inject(CapsuleService)
  
  // 公开服务的信号，供模板使用
  readonly loading = this.capsuleService.loading
  readonly capsule = this.capsuleService.capsule
}
```

### 在模板里使用信号

Angular 模板使用特殊的**异步自动解包**语法：

```html
<!-- create.component.html -->
<button [disabled]="loading()" class="btn btn-primary">
  {{ loading() ? '创建中...' : '封存胶囊' }}
</button>
```

注意 `loading()` 是函数调用，不是 `{{ loading }}`。

### 派生数据（`computed()`）

当一个值是由另一个信号计算得来时，用 `computed()`：

```typescript
import { computed, signal } from '@angular/core'

const openAt = signal(new Date())
const now = signal(new Date())

const hoursUntilOpen = computed(() => {
  const diff = openAt().getTime() - now().getTime()
  return Math.ceil(diff / 3600000)  // 计算剩余小时数
})
```

---

## 5. 一次用户操作的完整数据流

我们追踪用户填写表单、点击「封存胶囊」到看到成功结果的完整过程。

### 第 1 步：用户输入，双向绑定

**文件**：`components/capsule-form/capsule-form.component.ts`

用户在表单里输入标题。Angular 用 `[(ngModel)]` 实现双向绑定：

```typescript
// capsule-form.component.ts
import { Component, output } from '@angular/core'
import { FormsModule } from '@angular/forms'

@Component({
  selector: 'app-capsule-form',
  standalone: true,
  imports: [FormsModule],
  template: `
    <input
      [(ngModel)]="form.title"
      placeholder="给时间胶囊取个名字"
    />
  `,
})
export class CapsuleFormComponent {
  form = {
    title: '',
    content: '',
    creator: '',
    openAt: '',
  }
}
```

`[(ngModel)]` 相当于：
```html
:value="form.title"
(input)="form.title = $event.target.value"
```

数据绑定是**双向**的：
- 用户输入 → `form.title` 同步更新
- 代码改变 `form.title` → 输入框显示最新值

### 第 2 步：表单验证与提交

**文件**：`components/capsule-form/capsule-form.component.ts`

用户点击"封存胶囊"按钮，触发表单提交：

```typescript
export class CapsuleFormComponent {
  @Output() submitted = new EventEmitter<CreateCapsuleForm>()

  handleSubmit() {
    if (this.validate()) {
      this.submitted.emit({ ...this.form })  // 向父组件发送事件
    }
  }

  validate(): boolean {
    // 验证逻辑...
    return isValid
  }
}
```

父组件 `CreateComponent` 监听这个事件：

```typescript
// views/create.component.ts
export class CreateComponent {
  @ViewChild(CapsuleFormComponent) form!: CapsuleFormComponent

  handleSubmit(form: CreateCapsuleForm) {
    this.pendingForm.set(form)
    this.showConfirm.set(true)    // 显示确认对话框
  }
}
```

### 第 3 步：确认并调用服务

**文件**：`views/create.component.ts`

确认创建后，调用服务的 `create()` 方法：

```typescript
async confirmCreate(): Promise<void> {
  const form = this.pendingForm()
  if (!form) return

  try {
    const result = await this.capsuleService.create(form)
    this.created.set(result)  // 创建成功后显示成功页
  } catch {
    // 错误在服务中处理，自动反映到 this.error
  }
}
```

### 第 4 步：服务发起 API 请求

**文件**：`services/capsule.service.ts`

```typescript
async create(form: CreateCapsuleForm): Promise<Capsule> {
  this.loading.set(true)        // ← 立即改变状态1：加载中
  this.error.set(null)

  try {
    const res = await apiCreate(form)  // ← 调用 API
    this.capsule.set(res.data)         // ← 改变状态2：保存胶囊数据
    return res.data
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : '创建失败'
    this.error.set(msg)                // ← 改变状态3：保存错误
    throw e
  } finally {
    this.loading.set(false)      // ← 改变状态4：加载完成
  }
}
```

此时发生的变化：
1. `this.loading.set(true)` → 所有依赖 `loading` 的组件重新渲染
   - 按钮文字更新为"创建中..."
   - 按钮 disabled 变为 true
2. API 请求在后台发送
3. 返回后，`this.capsule.set(res.data)` → 所有依赖 `capsule` 的组件重新渲染
4. `this.loading.set(false)` → 按钮恢复正常

### 第 5 步：响应式触发视图更新

当任何信号改变时，Angular 会：

1. **检测依赖**：哪些模板依赖了这个信号？
   ```html
   {{ loading() ? '创建中...' : '封存胶囊' }}    <!-- 依赖 loading -->
   [disabled]="loading()"                       <!-- 依赖 loading -->
   <app-created @if="created()"></app-created>  <!-- 依赖 created -->
   ```

2. **更新 DOM**：使用 Angular 17+ 的控制流语法
   ```html
   @if (created()) {
     <SuccessView [capsule]="created()" />
   } @else {
     <CapsuleForm (submitted)="handleSubmit($event)" />
   }
   ```

3. **不重新渲染**：页面其他部分不动

### 第 6 步：页面跳转

创建成功后，用户可以点击按钮跳转到查看页面：

```typescript
goHome(): void {
  this.router.navigate(['/open', this.created()?.code])
}
```

Angular Router 会：
1. 更新 URL 为 `/open/Ab3xK9mZ`
2. 清空旧的组件（`CreateComponent`）
3. 加载新的组件（`OpenComponent`）
4. `OpenComponent` 从路由参数读取 `code`

```typescript
// 路由配置（app.routes.ts）
export const routes: Routes = [
  {
    path: 'open/:code',                  // :code 是路由参数
    component: () => import('...OpenComponent'),
  },
]

// 组件接收参数
@Component({...})
export class OpenComponent {
  code = input<string>('')  // Angular 17+ 用 input() 绑定路由参数

  constructor(private capsuleService: CapsuleService) {
    effect(() => {
      if (this.code()) {
        this.capsuleService.get(this.code())
      }
    })
  }
}
```

---

## 6. Angular 的关键 API

### `signal()` — 创建响应式状态

```typescript
const count = signal(0)
count()              // 读值
count.set(1)         // 设值
count.update(c => c + 1)  // 更新
```

**特性**：
- 初值可以是任何类型
- 读取时必须调用函数 `count()`
- 强制你显式更新，避免意外修改

### `computed()` — 派生的响应式值

```typescript
const doubled = computed(() => count() * 2)
//  当 count 变化时自动重新计算
```

### `effect()` — 副作用

当依赖的信号改变时，自动执行回调：

```typescript
effect(() => {
  console.log('count changed:', count())
  document.title = `Count: ${count()}`
})
```

实例：主题服务用 `effect()` 监听主题信号并应用到 DOM：

```typescript
@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly theme = signal<Theme>('light')

  constructor(private document: Document) {
    effect(() => {
      const t = this.theme()
      document.documentElement.setAttribute('data-theme', t)
      localStorage.setItem('theme', t)
    })
  }
}
```

### `inject()` — 获取依赖

```typescript
@Component({...})
export class MyComponent {
  private router = inject(Router)
  private service = inject(MyService)
}
```

`inject()` 只能在组件或服务的构造函数/初始化阶段调用。

### `@Injectable()` — 声明服务

```typescript
@Injectable({ providedIn: 'root' })  // 全局单例
export class MyService {
  // 服务代码
}
```

`providedIn: 'root'` 意味着整个应用共享一个实例。

### `@Component()` — 声明组件

```typescript
@Component({
  selector: 'app-my-component',
  standalone: true,                    // 独立组件（Angular 14+）
  imports: [CommonModule, FormsModule], // 导入依赖的模块
  template: `...`,                     // 或 templateUrl
  styles: [`...`],                     // 或 styleUrls
})
export class MyComponent {
  // 组件代码
}
```

**关键参数**：
- `selector` — HTML 标签名
- `standalone` — 是否为独立组件（推荐 true）
- `imports` — 导入的模块和组件
- `template` 或 `templateUrl` — 模板内容
- `styles` 或 `styleUrls` — 组件样式（scoped）

---

## 7. Angular 模板语法

Angular 用特殊的模板语法来绑定数据和事件。每个项目都有 `*.component.html` 和 `*.component.css`。

### 插值与表达式

```html
<!-- 简单插值 -->
<p>{{ message }}</p>

<!-- 函数调用（信号） -->
<p>{{ count() }}</p>

<!-- 条件表达式 -->
<p>{{ isLoading ? '加载中' : '完成' }}</p>
```

### 属性绑定

```html
<!-- 绑定 DOM 属性 -->
<button [disabled]="isLoading()">提交</button>
<img [src]="imagePath()" />

<!-- 绑定 class -->
<div [class.active]="isActive()">内容</div>
<div [ngClass]="{ active: isActive(), error: hasError() }">内容</div>

<!-- 绑定 style -->
<div [style.color]="textColor()">内容</div>
```

### 事件绑定

```html
<!-- 事件处理 -->
<button (click)="handleClick()">点击</button>
<input (input)="updateValue($event)" />
<form (ngSubmit)="handleSubmit()">...</form>
```

### 双向绑定

```html
<!-- ngModel（需要导入 FormsModule） -->
<input [(ngModel)]="name" />

<!-- 等价于 -->
<input
  [value]="name"
  (input)="name = $event.target.value"
/>
```

### 控制流（Angular 17+ 语法）

```html
<!-- 条件渲染 -->
@if (isLoaded()) {
  <p>内容已加载</p>
} @else if (isLoading()) {
  <p>加载中...</p>
} @else {
  <p>未开始</p>
}

<!-- 列表渲染 -->
@for (item of items(); track item.id) {
  <div>{{ item.name }}</div>
}

<!-- 显示/隐藏（保留 DOM，只用 CSS 隐藏） -->
@switch (status()) {
  @case ('success') {
    <p>成功</p>
  }
  @case ('error') {
    <p>错误</p>
  }
  @default {
    <p>未知</p>
  }
}
```

### 组件通信

**父 → 子**（通过 `@Input()`）：

```typescript
// child.component.ts
@Component({selector: 'app-child', ...})
export class ChildComponent {
  @Input() name: string = ''
  @Input() count = 0
}

// parent.component.html
<app-child [name]="parentName" [count]="parentCount()" />
```

**子 → 父**（通过 `@Output()` 和 `EventEmitter`）：

```typescript
// child.component.ts
@Component({selector: 'app-child', ...})
export class ChildComponent {
  @Output() submitted = new EventEmitter<string>()
  
  handleSubmit() {
    this.submitted.emit('data')
  }
}

// parent.component.html
<app-child (submitted)="handleData($event)" />
```

---

## 8. 从 React / Vue 来的开发者对比

### vs React

| 特性 | Angular | React |
|------|---------|-------|
| 状态 | `signal()` | `useState()` |
| 派生 | `computed()` | `useMemo()` |
| 副作用 | `effect()` | `useEffect()` |
| 数据绑定 | `[(ngModel)]` (双向) | 受控组件 (单向) |
| 依赖注入 | 内置（`@Injectable`） | 无（自己管理） |
| 完整性 | 框架（包含路由、HTTP） | 库（需要自己选择工具） |

### vs Vue 3

| 特性 | Angular | Vue 3 |
|------|---------|-------|
| 状态 | `signal()` | `ref()` |
| 派生 | `computed()` | `computed()` |
| 模板 | HTML + 特殊指令 | HTML + 指令 |
| 依赖注入 | 内置 `@Injectable` | 无（Composable 即可） |
| 学习曲线 | 陡（需学装饰器和 IoC） | 平缓 |
| 框架完整度 | 完整 | 轻量级 |

---

## 9. 常见场景

### 场景 1：表单验证并实时显示错误

```typescript
export class LoginComponent {
  email = signal('')
  error = signal<string | null>(null)

  updateEmail(value: string) {
    this.email.set(value)
    
    if (!value.includes('@')) {
      this.error.set('邮箱格式不正确')
    } else {
      this.error.set(null)
    }
  }

  isValid = computed(() => {
    return this.email().includes('@') && !this.error()
  })
}
```

模板：
```html
<input (input)="updateEmail($event.target.value)" />
@if (error()) {
  <p class="error">{{ error() }}</p>
}
<button [disabled]="!isValid()">提交</button>
```

### 场景 2：列表渲染，可删除项

```typescript
export class ItemListComponent {
  items = signal<Item[]>([
    { id: '1', name: 'Item 1' },
  ])

  removeItem(id: string) {
    this.items.update(list => list.filter(item => item.id !== id))
  }
}
```

模板：
```html
@for (item of items(); track item.id) {
  <li>
    {{ item.name }}
    <button (click)="removeItem(item.id)">删除</button>
  </li>
}
```

### 场景 3：异步数据加载

```typescript
export class PostListComponent implements OnInit {
  posts = signal<Post[]>([])
  loading = signal(false)
  error = signal<string | null>(null)

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadPosts()
  }

  loadPosts() {
    this.loading.set(true)
    this.error.set(null)

    this.http.get<Post[]>('/api/posts').subscribe({
      next: (data) => {
        this.posts.set(data)
        this.loading.set(false)
      },
      error: (err) => {
        this.error.set(err.message)
        this.loading.set(false)
      }
    })
  }
}
```

---

## 10. 调试与开发技巧

### 1. Angular DevTools 浏览器扩展

安装 [Angular DevTools](https://angular.io/guide/devtools)，可以：
- 实时看组件树结构
- 检查每个组件的信号值
- 看依赖关系
- 追踪变更检测

### 2. 性能优化：OnPush 变更检测

对于大型应用，用 `ChangeDetectionStrategy.OnPush` 优化性能：

```typescript
@Component({
  selector: 'app-card',
  changeDetection: ChangeDetectionStrategy.OnPush,  // 只在 Input 改变时检测
  template: `...`,
})
export class CardComponent {
  @Input() item!: Item
}
```

### 3. 类型检查

```bash
npm run typecheck  # 检查类型错误
```

### 4. Vite 的极速热更新

保存文件会立刻更新，无需刷新浏览器。

---

## 11. 常见问题排查

**Q：模板里显示 `[object Object]` 或 `<function>`？**  
A：检查是否忘记调用信号。信号需要加 `()`：
```html
<!-- ✗ 错误 -->
{{ count }}

<!-- ✓ 正确 -->
{{ count() }}
```

**Q：`inject()` 报错"没在组件/服务里调用"？**  
A：`inject()` 只能在组件或服务的初始化阶段（构造/定义时）调用，不能在事件处理里。解决方案：
```typescript
// ✓ 正确：在顶级调用
export class MyComponent {
  private service = inject(MyService)  // OK
}

// ✗ 错误：嵌套函数里调用
function handleClick() {
  const service = inject(MyService)    // 不行
}
```

**Q：信号没有更新界面？**  
A：检查是否真的调用了 setter：
```typescript
// ✗ 错误：直接改变对象属性
capsule.data.title = 'new'

// ✓ 正确：调用 set()
capsule.set({ ...capsule(), title: 'new' })
```

**Q：性能问题，重新渲染太频繁？**  
A：检查 `effect()` 和 `computed()` 的依赖。避免在 `effect()` 里修改其他信号（可能导致循环）。

---

## 12. 下一步学习

### 核心知识
- [ ] 完整阅读 [Angular 官方文档](https://angular.io/docs)
- [ ] 理解变更检测机制（`ChangeDetectionStrategy`）
- [ ] 学习 RxJS（旧版本的 observables，某些场景仍需要）
- [ ] 学习构建自定义指令（`@Directive`）

### 实践
- [ ] 在 `components/` 里创建新组件并在多个视图使用
- [ ] 在 `services/` 里创建新服务并用 `inject()` 获取
- [ ] 用 Angular DevTools 追踪信号变化
- [ ] 优化性能：用 `ChangeDetectionStrategy.OnPush`

---

## 总结

Angular 的核心：
1. **信号** = 追踪响应式状态，用 `signal()` 创建
2. **自动更新** = 当信号改变时，所有依赖自动重新渲染
3. **依赖注入** = 用服务 + `@Injectable` 来共享逻辑
4. **企业级** = 内置路由、HTTP、表单、动画等完整工具
5. **强类型** = TypeScript + 装饰器，代码更安全

现在打开 `frontends/angular-ts/` 目录，对照这份导读逐个浏览文件。从 `app.component.ts` 开始，按照导读第 5 节的数据流追踪，你会很快理解整个 Angular 的设计。

祝学习愉快！
