# Angular 18 前端 - HelloTime

欢迎使用 Angular 18 实现的 HelloTime 时间胶囊应用。

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器 (http://localhost:5175)
npm run dev

# 生产构建
npm run build

# 运行测试
npm run test
npm run test:watch  # 监听模式
```

## 架构概览

这是一个**无 NgModule** 的纯 Standalone Component Angular 18 应用。

### 核心技术
- **Angular 18** 独立组件，无 NgModule 样板代码
- **Angular Signals** 用于响应式状态管理（业务逻辑中无 RxJS）
- **Angular Router** 带路由参数自动绑定的懒加载路由
- **TypeScript** 严格模式启用
- **Karma + Jasmine** 用于测试
- **CSS 变量** 来自共享设计系统 (`spec/styles/`)

### 项目结构

```
src/
├── app/
│   ├── app.config.ts           # 引导配置（替代 AppModule）
│   ├── app.routes.ts           # 懒加载路由
│   ├── app.component.*         # 根组件
│   ├── api/index.ts            # 基于 fetch 的 API 客户端（框架无关）
│   ├── types/index.ts          # 共享 TypeScript 接口
│   ├── services/               # 依赖注入的服务
│   │   ├── theme.service.ts    # 主题切换，localStorage 持久化
│   │   ├── capsule.service.ts  # 胶囊操作
│   │   └── admin.service.ts    # 管理员认证与管理
│   ├── components/             # 9 个可复用 UI 组件（独立）
│   └── views/                  # 5 个页面级组件
└── __tests__/                  # Karma + Jasmine 测试文件
```

## 服务层（基于 Signals）

### ThemeService
```typescript
readonly theme = signal<'light' | 'dark'>(...)
toggle(): void
```
使用 `effect()` 自动同步主题到 DOM 的 `[data-theme]` 属性和 localStorage。

### CapsuleService
```typescript
readonly capsule = signal(...)
readonly loading = signal(false)
readonly error = signal(null)
async create(form: CreateCapsuleForm): Promise<Capsule>
async get(code: string): Promise<Capsule>
```

### AdminService
```typescript
readonly token = signal(...)
readonly capsules = signal([])
readonly isLoggedIn = computed(() => !!this.token())
async login(password: string): Promise<void>
logout(): void
async fetchCapsules(page?: number): Promise<void>
async deleteCapsule(code: string): Promise<void>
```

Token 保存在 `sessionStorage`（退出时清除）。

## 路由

- `/` — 首页（着陆页）
- `/create` — 创建胶囊表单
- `/open/:code?` — 查看/开启胶囊（code 为可选）
- `/about` — 关于页面
- `/admin` — 管理员仪表板（需登录）

路由参数通过 `withComponentInputBinding()` 自动绑定到组件的 `@Input()` 属性。

## API 客户端

`api/index.ts` 中的 API 客户端在 Vue、React 和 Angular **完全相同**：
- 框架无关的 `fetch()` 包装器
- 统一的错误处理
- 返回 `Promise<ApiResponse<T>>`（不是 RxJS Observable）

这使业务逻辑与 Angular 具体实现解耦。

## 样式

应用通过 `angular.json` 的 styles 数组导入共享设计令牌：
```json
"styles": [
  "../../spec/styles/tokens.css",
  "../../spec/styles/base.css",
  "../../spec/styles/components.css",
  "../../spec/styles/layout.css",
  "src/styles.css"
]
```

深色模式通过在 `document.documentElement` 设置 `[data-theme="dark"]` 激活。

## 测试

测试使用 **Karma + Jasmine**，通过 `TestBed` 进行依赖注入：

```typescript
// 服务测试
let service: ThemeService;
beforeEach(() => {
  TestBed.configureTestingModule({});
  service = TestBed.inject(ThemeService);
});

// 组件测试
let fixture: ComponentFixture<CapsuleFormComponent>;
beforeEach(async () => {
  await TestBed.configureTestingModule({
    imports: [CapsuleFormComponent]
  }).compileComponents();
  fixture = TestBed.createComponent(CapsuleFormComponent);
});
```

运行测试：
```bash
npm run test        # 单次运行
npm run test:watch  # 监听模式
```

## 开发技巧

### 使用 Signals
```typescript
// 创建 signal
readonly count = signal(0);

// 更新 signal
this.count.set(5);
this.count.update(n => n + 1);

// 派生值
readonly doubled = computed(() => this.count() * 2);

// 响应变化
effect(() => {
  console.log('Count changed:', this.count());
});
```

### 注入服务
```typescript
// Angular 18 推荐方式
private readonly service = inject(MyService);

// 替代方式（构造函数注入）
constructor(private service: MyService) {}
```

### 组件生命周期
不同于 React/Vue 的 hooks，Angular 组件使用生命周期钩子：
```typescript
export class MyComponent implements OnInit {
  ngOnInit(): void {
    // 组件初始化后调用
    // 适合加载数据
  }

  ngOnDestroy(): void {
    // 组件销毁前调用
    // 清理订阅
  }
}
```

### 懒加载路由
路由通过 `loadComponent` 自动懒加载：
```typescript
{
  path: 'admin',
  loadComponent: () =>
    import('./views/admin/admin.component').then(m => m.AdminComponent)
}
```

## 与 Vue/React 对比

| 功能 | Vue | React | Angular |
|------|-----|-------|---------|
| 状态 | `ref()` | `useState()` | `signal()` |
| 派生值 | `computed()` | `useMemo()` | `computed()` |
| 副作用 | `watchEffect()` | `useEffect()` | `effect()` |
| 共享状态 | 模块 refs | `useSyncExternalStore()` | 根级服务 |
| 双向绑定 | `v-model` | `value + onChange` | `[(ngModel)]` |
| 事件绑定 | `@click` | `onClick={}` | `(click)=""` |
| 组件样式 | `<style scoped>` | CSS Modules | 组件 CSS 文件 |

三个前端实现共享**相同的 API 客户端、类型和设计系统**。

## 浏览器支持

Angular 18 支持现代浏览器：
- Chrome（最新）
- Firefox（最新）
- Safari（最新）
- Edge（最新）

## 故障排除

**端口已被占用：**
```bash
ng serve --port 5176  # 使用不同端口
```

**模块找不到错误：**
检查 `tsconfig.app.json` 中的路径别名配置：
```json
"paths": {
  "@app/*": ["src/app/*"],
  "@spec/*": ["../../spec/*"]
}
```

**测试失败，找不到模块：**
确保 `tsconfig.spec.json` 与 `tsconfig.app.json` 有相同的路径别名。

## 生产构建

```bash
npm run build
# 输出位置: dist/angular-ts/
```

生产构建经过优化：
- 预先编译（AOT）
- 树摇和缩小
- 按路由进行懒加载分割

## 项目命令

```bash
# 开发服务器（http://localhost:5175）
npm run dev

# 生产构建
npm run build

# 运行测试（单次）
npm run test

# 运行测试（监听模式）
npm run test:watch

# 与其他前端一起启动
cd .. && ./scripts/dev.sh
```

## 相关文档

- [主项目 README](../README.md) - 项目整体概览
- [项目指引](../CLAUDE.md) - 开发指南和最佳实践
- [API 规范](../spec/api/openapi.yaml) - REST API 文档
- [设计令牌](../spec/styles/tokens.css) - CSS 设计系统

## 许可证

MIT
