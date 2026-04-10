# 时间胶囊 (HelloTime)

> 封存此刻的心意，在未来的某个时刻开启

HelloTime 是一个多技术栈对比学习项目。通过同一个业务场景（时间胶囊），展示 6 个后端框架、4 个前端框架、3 套全栈样板以及 3 套桌面端实现。项目重点不在业务逻辑本身，而在于展示如何使用不同技术栈实现相同的 API 契约和设计系统，帮助开发者快速对比框架差异、学习最佳实践、理解架构设计。

## 特性亮点

- 前后端完全解耦，支持多技术栈自由组合
- 统一 API 规范，基于 OpenAPI 3.0
- 统一视觉系统，基于共享 CSS Design Tokens
- 支持明亮 / 深色主题切换
- 覆盖后端共享契约验证与前端流程验证
- 提供交互式本地服务管理工具

## 技术栈

### 前端框架
| 框架 | 路径 | 构建工具 | 端口 |
|------|------|----------|------|
| **Vue 3** | `frontends/vue3-ts/` | Vite 7 | 5173 |
| **React 19** | `frontends/react-ts/` | Vite 7 | 5174 |
| **Angular 18** | `frontends/angular-ts/` | Angular CLI | 5175 |
| **Svelte 5** | `frontends/svelte-ts/` | Vite 7 | 5176 |
| **Next.js 15** | `fullstacks/next-ts/` | Next.js 全栈 | 5177 |
| **Nuxt 3** | `fullstacks/nuxt-ts/` | Nuxt 全栈 | 5178 |
| **Spring Boot MVC** | `fullstacks/spring-boot-mvc/` | Spring MVC + Thymeleaf + HTMX | 4179 |

### 后端框架
| 框架 | 路径 | 语言 / 运行时 | 默认端口 |
|------|------|---------------|----------|
| **Spring Boot 3** | `backends/spring-boot/` | Java 21 | 18000 |
| **FastAPI** | `backends/fastapi/` | Python 3.12+ | 18010 |
| **Gin** | `backends/gin/` | Go 1.24+ | 18020 |
| **Elysia** | `backends/elysia/` | TypeScript + Bun | 18030 |
| **NestJS** | `backends/nest/` | TypeScript + Node.js | 18040 |
| **ASP.NET Core** | `backends/aspnet-core/` | C# 12 + .NET 8 | 18050 |

前端开发环境通常通过 `http://localhost:8080` 访问后端，可使用 `scripts/switch-backend.sh`（Unix）或 `scripts/switch-backend.ps1`（Windows）动态切换 `8080 -> 18xxx` 的映射。`fullstacks/next-ts`、`fullstacks/nuxt-ts` 和 `fullstacks/spring-boot-mvc` 为独立全栈实现，不依赖该映射。

### 桌面端与移动端
| 实现 | 路径 | 技术栈 | 说明 |
|------|------|--------|------|
| **Tauri** | `desktop/tauri/` | Tauri 2 + React 19 + Rust | 跨平台桌面壳，复用 React 前端 |
| **macOS SwiftUI** | `desktop/macos-swiftui/` | SwiftUI + Swift 6.1 | macOS 原生桌面端，赛博玻璃风格 |
| **WinUI 3** | `desktop/winui3/` | WinUI 3 + Windows App SDK + C# 12 | Windows 原生桌面端，尽量对齐 macOS SwiftUI 的赛博玻璃体验 |
| **iOS SwiftUI** | `mobile/ios-swiftui/` | SwiftUI + Swift 6.1 | iOS 原生移动端，适配手机布局 |

### 全栈实现说明

三套全栈实现并不是“前端目录里的特殊前端”，而是独立的一体化样板：

- **Next.js 全栈**：强调 App Router、Route Handlers、middleware、服务端首屏取数
- **Nuxt 全栈**：强调 `pages/` 文件路由、`useAsyncData`、Nitro Server、约定式 SSR
- **Spring Boot MVC 全栈**：强调 Spring MVC、Thymeleaf、HTMX、Session 登录态

其中：

- `fullstacks/next-ts` 与 `fullstacks/nuxt-ts` 的技术栈展示固定为 3 项：框架、语言、数据库
- `fullstacks/spring-boot-mvc` 的技术栈展示固定为 5 项：Spring Boot、Java、Thymeleaf、HTMX、SQLite
- 三者都内置自己的 `/api/v1/*`，不依赖 `localhost:8080`

相关文档：

- [后端实现对比](docs/backend-comparison.md)
- [前端实现对比摘要](docs/frontend-comparison.md)
- [前端实现对比详解](docs/frontend-implementations-comparison.md)
- [全栈实现对比](docs/fullstack-comparison.md)
- [平台扩展路线图](docs/platform-roadmap.md)
- [技术栈展示约定](docs/tech-stack-display.md)
- [多技术栈阅读指南](docs/multi-stack-reading-guide.md)
- [注释规范](docs/comment-guidelines.md)
- [Next 全栈说明](fullstacks/next-ts/README.md)
- [Nuxt 全栈说明](fullstacks/nuxt-ts/README.md)
- [Spring MVC 全栈说明](fullstacks/spring-boot-mvc/README.md)
- [Tauri 桌面端说明](desktop/tauri/README.md)
- [macOS SwiftUI 桌面端说明](desktop/macos-swiftui/README.md)
- [WinUI 3 桌面端说明](desktop/winui3/README.md)
- [部署指南](docs/deployment.md)
- [后端共享契约验证](verification/README.md)
- [API 规范](spec/api/openapi.yaml)

## 📁 项目结构

```
HelloTimeByClaude/
├── docs/                    # 项目文档（需求、设计、部署指南）
├── spec/                    # 共享规范
│   ├── api/                 # OpenAPI 3.0 规范
│   │   └── openapi.yaml
│   └── styles/              # CSS Design Tokens
│       └── cyber.css        # 统一 Cyber 风格设计系统
├── frontends/               # 前端实现（可独立运行）
│   ├── vue3-ts/             # Vue 3 + TypeScript + Vite
│   ├── react-ts/            # React 19 + TypeScript + Vite
│   ├── angular-ts/          # Angular 18 + TypeScript + Angular CLI
│   ├── svelte-ts/           # Svelte 5 + TypeScript + Vite
│   └── ui-prototype/        # 前端原型设计
├── fullstacks/              # 全栈实现（前后端一体）
│   ├── next-ts/             # Next.js 15 + TypeScript 全栈实现
│   ├── nuxt-ts/             # Nuxt 3 + TypeScript 全栈实现
│   └── spring-boot-mvc/     # Spring Boot MVC + Thymeleaf + HTMX 全栈实现
├── desktop/                 # 桌面端实现
│   ├── tauri/               # Tauri 2 + React 19 + Rust 跨平台桌面
│   ├── macos-swiftui/       # SwiftUI + Swift 6.1 macOS 原生桌面
│   └── winui3/              # WinUI 3 + Windows App SDK + C# Windows 原生桌面
├── mobile/                  # 移动端实现
│   └── ios-swiftui/         # SwiftUI + Swift 6.1 iOS 原生移动端
├── backends/                # 后端实现（可独立运行）
│   ├── spring-boot/         # Spring Boot 3 + Java 21
│   ├── fastapi/             # FastAPI + Python 3.12
│   ├── gin/                 # Gin + Go 1.24
│   ├── elysia/              # Elysia + Bun + TypeScript
│   ├── nest/                # NestJS + Node.js + TypeScript
│   └── aspnet-core/         # ASP.NET Core + C# + .NET 8
├── verification/            # 共享验证脚本与验证矩阵
└── scripts/                 # 开发/构建/测试脚本
    ├── dev.sh               # 启动所有开发服务
    ├── dev-manager.py       # 交互式服务管理工具
    ├── switch-backend.sh    # 切换 8080 -> 指定后端（Unix）
    ├── switch-backend.ps1   # 切换 8080 -> 指定后端（Windows）
    ├── build.sh             # 构建所有项目
    └── test.sh              # 运行所有测试
```

## 🚀 快速开始

### 推荐方式：交互式管理

```bash
./scripts/dev-manager.py
```

这个工具会显示：

- 所有前后端服务的启动状态
- 各自监听端口
- 当前 `8080` 映射到哪个后端
- 启动 / 停止 / 重启 / 查看日志 / 切换后端映射

### Web 方式：服务管理 + 前端链接落地页

```bash
./scripts/dev-manager.py --web
```

默认访问地址：

- `http://127.0.0.1:8090`

Web 页面提供：

- 服务状态总览（前端 / 后端 / 全栈）
- 单服务与批量启动、停止、重启
- `8080 -> 18xxx` 后端映射切换
- 服务日志预览
- 前端 / 全栈一键打开入口

### 手动启动单个后端

```bash
# Spring Boot
cd backends/spring-boot
.\run.ps1

# FastAPI
cd backends/fastapi
.\run.ps1

# Gin
cd backends/gin
.\run.ps1

# Elysia
cd backends/elysia
.\run.ps1

# NestJS
cd backends/nest
.\run.ps1

# ASP.NET Core
cd backends/aspnet-core
.\run.ps1
```

### 切换前端当前连接的后端

```bash
./scripts/switch-backend.sh spring-boot
./scripts/switch-backend.sh fastapi
./scripts/switch-backend.sh gin
./scripts/switch-backend.sh elysia
./scripts/switch-backend.sh nest
./scripts/switch-backend.sh aspnet-core
```

Windows PowerShell:

```powershell
.\scripts\switch-backend.ps1 spring-boot
.\scripts\switch-backend.ps1 fastapi
.\scripts\switch-backend.ps1 gin
.\scripts\switch-backend.ps1 elysia
.\scripts\switch-backend.ps1 nest
.\scripts\switch-backend.ps1 aspnet-core
```

### 启动前端

```bash
# Vue 3
cd frontends/vue3-ts
npm run dev

# React
cd frontends/react-ts
npm run dev

# Angular
cd frontends/angular-ts
npm run dev

# Svelte
cd frontends/svelte-ts
npm run dev

# Next.js 全栈
cd fullstacks/next-ts
npm run dev

# Nuxt 全栈
cd fullstacks/nuxt-ts
npm run dev

# Spring MVC 全栈
cd fullstacks/spring-boot-mvc
./run
```

#### 桌面端与移动端
桌面应用程序的启动独立于 `dev.sh`，可根据需要单独运行：

```bash
# Tauri 桌面端（macOS/Linux 用 `./run`，Windows 可用 `.\run.ps1`）
cd desktop/tauri
./run

# macOS SwiftUI 桌面端（仅 macOS）
cd desktop/macos-swiftui
./run

# WinUI 3 桌面端（Windows）
cd desktop/winui3
.\run.ps1

# iOS SwiftUI 移动端
cd mobile/ios-swiftui
./run
```

### 启动全栈实现

```bash
# Next.js 全栈
cd fullstacks/next-ts
.\run.ps1

# Nuxt 全栈
cd fullstacks/nuxt-ts
.\run.ps1

# Spring MVC 全栈
cd fullstacks/spring-boot-mvc
.\run.ps1
```

### 一键启动默认开发组合

```bash
./scripts/dev.sh
```

该脚本会：

- 启动 Spring Boot（18000）
- 启动 Vue 3 / Angular / Svelte 前端
- 启动 Next / Nuxt / Spring MVC 全栈实现
- 自动将 `localhost:8080` 转发到 Spring Boot

> 任意前端都可以与任意后端组合使用；开发时建议始终通过 `8080` 这一固定后端入口来切换。

## 🧪 测试与验证

### 运行实现自身测试

```bash
./scripts/test.sh
```

**后端测试**
```bash
# Spring Boot 测试
cd backends/spring-boot
./mvnw test

# FastAPI 测试
cd backends/fastapi
pytest

# Gin 测试
cd backends/gin
go test ./tests/ -v

# Elysia 测试
cd backends/elysia
bun test

# NestJS 测试
cd backends/nest
npm test

# ASP.NET Core 测试
cd backends/aspnet-core
./dotnetw test tests/tests.csproj
```

**前端测试**
```bash
# Vue 3 测试
cd frontends/vue3-ts
npm run test

# Angular 测试
cd frontends/angular-ts
npm run test

# React 测试
cd frontends/react-ts
npm run test

# Svelte 检查
cd frontends/svelte-ts
npm run check

# Next.js 构建验证
cd fullstacks/next-ts
npm run build

# Nuxt 构建验证
cd fullstacks/nuxt-ts
npm run build

# Spring MVC 测试
cd fullstacks/spring-boot-mvc
./mvnw test
```

### 运行共享验证

```bash
# 后端共享契约验证
bash verification/scripts/verify-backend-contract.sh

# 前端静态 / 本地命令验证
bash verification/scripts/verify-frontend-flows.sh

# 前端浏览器主流程验证
bash verification/scripts/verify-frontend-browser-flows.sh
```

## 核心功能

- 创建胶囊：设置标题、内容、开启时间和创建者昵称
- 查询胶囊：通过 8 位唯一码查询，未到开启时间自动隐藏内容
- 管理员认证：JWT Bearer Token（默认 2 小时）
- 胶囊管理：分页查看所有胶囊、删除胶囊
- 主题切换：明亮 / 深色主题
- 响应式布局：适配桌面端与移动端

## 数据库设计

所有实现使用 SQLite，单表结构：

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | INTEGER | 主键（自增） |
| `code` | VARCHAR(8) | 8 位唯一码（大写字母和数字：A-Z0-9） |
| `title` | VARCHAR(100) | 胶囊标题 |
| `content` | TEXT | 胶囊内容 |
| `creator` | VARCHAR(30) | 创建者昵称 |
| `open_at` | TEXT | 开启时间（UTC ISO 8601，示例 `2026-03-24T08:43:47Z`） |
| `created_at` | TEXT | 创建时间（UTC ISO 8601，示例 `2026-03-24T08:42:17Z`） |

## API 接口

所有实现提供统一的 REST API：

| 方法 | 端点 | 说明 | 认证 |
|------|------|------|------|
| `GET` | `/api/v1/health` | 健康检查 | ❌ |
| `POST` | `/api/v1/capsules` | 创建胶囊 | ❌ |
| `GET` | `/api/v1/capsules/{code}` | 查询胶囊 | ❌ |
| `POST` | `/api/v1/admin/login` | 管理员登录 | ❌ |
| `GET` | `/api/v1/admin/capsules` | 分页列表 | ✅ |
| `DELETE` | `/api/v1/admin/capsules/{code}` | 删除胶囊 | ✅ |

完整 API 规范见 [spec/api/openapi.yaml](spec/api/openapi.yaml)。

## 认证机制

采用 JWT Bearer Token：

请求头格式：
```
Authorization: Bearer <token>
```

Token 特性：
- 有效期：2 小时
- 签名算法：HS256
- 生成方式：管理员登录端点获取

错误响应格式：
```json
{
  "success": false,
  "message": "错误描述",
  "errorCode": "ERROR_CODE"
}
```

常见错误码：
| 错误码 | HTTP 状态码 | 说明 |
|--------|------------|------|
| `VALIDATION_ERROR` | 400 | 参数验证失败 |
| `CAPSULE_NOT_FOUND` | 404 | 胶囊不存在 |
| `UNAUTHORIZED` | 401 | 认证失败 |
| `BAD_REQUEST` | 400 | 业务逻辑错误 |

## ⚙️ 环境变量配置

### Spring Boot

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `ADMIN_PASSWORD` | `timecapsule-admin` | 管理员密码 |
| `JWT_SECRET` | `hellotime-jwt-secret-key-that-is-long-enough-for-hs256` | JWT 签名密钥 |

### FastAPI

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `DATABASE_URL` | `sqlite:///../../data/hellotime.db` | 数据库连接 |
| `ADMIN_PASSWORD` | `timecapsule-admin` | 管理员密码 |
| `JWT_SECRET` | `hellotime-jwt-secret-key-that-is-long-enough-for-hs256` | JWT 签名密钥 |
| `JWT_EXPIRATION_HOURS` | `2` | Token 有效期（小时） |

## 📖 开发指南

### ➕ 添加新的前端实现

1. 在 `frontends/` 目录下创建新项目
2. 遵循 [`spec/api/openapi.yaml`](spec/api/openapi.yaml) 实现 API 调用
3. 使用 [`spec/styles/`](spec/styles/) 中的设计令牌和样式
4. 实现标准路由：`/`, `/create`, `/open/:code`, `/about`, `/admin`

**参考实现**
- **Vue 3** - Vite + Vue Router + Composables (`ref`, `computed`, `watchEffect`)
- **React** - Vite + React Router + Hooks (`useState`, `useCallback`, `useSyncExternalStore`)
- **Angular** - Angular CLI + Standalone Components + Signals (`signal`, `computed`, `effect`)

### ➕ 添加新的后端实现

1. 在 `backends/` 目录下创建新项目
2. 实现 [`spec/api/openapi.yaml`](spec/api/openapi.yaml) 定义的所有端点
3. 使用相同的 SQLite 数据库结构
4. 遵循统一的 API 响应格式和错误处理

### 💡 开发提示

- ✅ 前后端完全解耦，可独立开发和测试
- ✅ CORS 已配置允许 `localhost:*` 跨域请求
- ✅ 数据库文件默认在项目根目录生成
- ✅ 所有时间戳使用 UTC 时区
- ✅ 每个前端实现包含相同功能，适合对比学习不同框架

## 📄 许可证

MIT License

---

<div align="center">

**🎉 享受编码，探索技术的无限可能！**

</div>
