# HelloTime React Frontend

时间胶囊应用的前端界面，基于 React 19 和 TypeScript 构建。

## 技术栈

- **框架**: React 19
- **语言**: TypeScript 5.9
- **构建工具**: Vite 7
- **路由**: React Router 7
- **测试**: Vitest + React Testing Library

## 功能特性

- 响应式单页应用（SPA）
- TypeScript 类型安全
- 胶囊创建、查看、管理功能
- 管理员认证界面
- 主题切换（亮色/暗色）
- 统一的 API 错误处理

## 快速开始

### 前置要求

- Node.js 18+
- npm 或 pnpm

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

Windows PowerShell:

```powershell
cd frontends/react-ts
.\run.ps1
```

应用将在 `http://localhost:5173` 启动。

### 环境变量

创建 `.env` 文件配置后端 API 地址：

```env
VITE_API_BASE_URL=http://localhost:8080
```

## 项目结构

```
src/
├── api/              # API 客户端封装
│   └── index.ts      # Fetch 封装，统一错误处理
├── components/       # 可复用组件
│   ├── AppHeader.tsx
│   ├── AppFooter.tsx
│   ├── CapsuleForm.tsx
│   ├── CapsuleCard.tsx
│   ├── CapsuleTable.tsx
│   ├── CapsuleCodeInput.tsx
│   ├── AdminLogin.tsx
│   ├── ThemeToggle.tsx
│   └── ConfirmDialog.tsx
├── hooks/            # 自定义 Hooks
│   ├── useCapsule.ts     # 胶囊相关逻辑
│   ├── useAdmin.ts       # 管理员认证逻辑
│   └── useTheme.ts       # 主题切换逻辑
├── types/            # TypeScript 类型定义
│   └── index.ts
├── views/            # 页面级组件
│   ├── HomeView.tsx      # 首页
│   ├── CreateView.tsx    # 创建胶囊页
│   ├── OpenView.tsx      # 查看胶囊页
│   ├── AdminView.tsx     # 管理后台页
│   └── AboutView.tsx     # 关于页面
├── App.tsx         # 根组件
└── main.tsx        # 应用入口
```

## 路由

| 路径 | 组件 | 描述 |
|------|------|------|
| `/` | HomeView | 首页，胶囊列表 |
| `/create` | CreateView | 创建时间胶囊 |
| `/open/:code` | OpenView | 查看胶囊详情 |
| `/admin` | AdminView | 管理员后台 |
| `/about` | AboutView | 关于页面 |

## 命令

```bash
# 开发模式
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview

# 运行测试
npm run test

# 监听测试
npm run test:watch

# 类型检查
npx tsc --noEmit
```

## 共享样式

本项目统一使用 `spec/styles/cyber.css` 这一份共享样式文件，里面同时包含：

- 设计令牌
- 基础重置
- 共享组件样式
- 少量兼容性工具类

组件样式使用 CSS Modules（`.module.css` 文件）。

## 组件示例

### CapsuleForm

胶囊创建表单组件：

```tsx
import { CapsuleForm } from '@/components/CapsuleForm'

function CreateView() {
  const handleSubmit = async (data) => {
    // 处理提交
  }

  return <CapsuleForm onSubmit={handleSubmit} />
}
```

### CapsuleCard

胶囊卡片展示组件：

```tsx
import { CapsuleCard } from '@/components/CapsuleCard'

function CapsuleList({ capsule }) {
  const handleOpen = () => {
    navigate(`/open/${capsule.code}`)
  }

  return <CapsuleCard capsule={capsule} onOpen={handleOpen} />
}
```

## Hooks

### useCapsule

胶囊相关的状态管理：

```typescript
import { useCapsule } from '@/hooks/useCapsule'

const { capsules, loading, error, fetchCapsules, createCapsule } = useCapsule()
```

### useAdmin

管理员认证：

```typescript
import { useAdmin } from '@/hooks/useAdmin'

const { token, isAuthenticated, login, logout } = useAdmin()
```

### useTheme

主题切换：

```typescript
import { useTheme } from '@/hooks/useTheme'

const { theme, toggleTheme } = useTheme()
```

## API 客户端

统一的 API 客户端封装，自动处理错误：

```typescript
import { createCapsule, getCapsule } from '@/api'

// 创建胶囊
const response = await createCapsule({
  title: '给未来的自己',
  content: '希望你一切都好',
  creator: '张三',
  openAt: '2027-01-01T00:00:00Z'
})

// 查询胶囊
const capsule = await getCapsule('Ab3xK9mZ')
```
