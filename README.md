# 时间胶囊 (HelloTime)

> 封存此刻的心意，在未来的某个时刻开启

HelloTime 是一个 RealWorld 风格的多实现技术展示项目。仓库中的前后端实现彼此独立，但遵循同一套 API 契约、设计系统和验证标准，从而支持任意前端与任意后端自由组合。

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

### 后端框架
| 框架 | 路径 | 语言 / 运行时 | 默认端口 |
|------|------|---------------|----------|
| **Spring Boot 3** | `backends/spring-boot/` | Java 21 | 18000 |
| **FastAPI** | `backends/fastapi/` | Python 3.12+ | 18010 |
| **Gin** | `backends/gin/` | Go 1.24+ | 18020 |
| **Elysia** | `backends/elysia/` | TypeScript + Bun | 18030 |
| **NestJS** | `backends/nest/` | TypeScript + Node.js | 18040 |

前端开发环境始终通过 `http://localhost:8080` 访问后端，可使用 [scripts/switch-backend.sh](/Users/alex/AiWork/HelloTimeByClaude/scripts/switch-backend.sh) 动态切换 `8080 -> 18xxx` 的映射。

相关文档：

- [后端对比分析](docs/backend-comparison.md)
- [技术栈展示约定](docs/tech-stack-display.md)
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
│       ├── tokens.css       # 设计令牌（颜色、间距、字体）
│       ├── base.css         # 基础样式
│       ├── layout.css       # 布局样式
│       └── components.css   # 组件样式
├── frontends/               # 前端实现（可独立运行）
│   ├── vue3-ts/             # Vue 3 + TypeScript + Vite
│   ├── react-ts/            # React 19 + TypeScript + Vite
│   ├── angular-ts/          # Angular 18 + TypeScript + Angular CLI
│   └── svelte-ts/           # Svelte 5 + TypeScript + Vite
├── backends/                # 后端实现（可独立运行）
│   ├── spring-boot/         # Spring Boot 3 + Java 21
│   ├── fastapi/             # FastAPI + Python 3.12
│   ├── gin/                 # Gin + Go 1.24
│   ├── elysia/              # Elysia + Bun + TypeScript
│   └── nest/                # NestJS + Node.js + TypeScript
├── verification/            # 共享验证脚本与验证矩阵
└── scripts/                 # 开发/构建/测试脚本
    ├── dev.sh               # 启动所有开发服务
    ├── dev-manager.py       # 交互式服务管理工具
    ├── switch-backend.sh    # 切换 8080 -> 指定后端
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

### 手动启动单个后端

```bash
# Spring Boot
cd backends/spring-boot
./run

# FastAPI
cd backends/fastapi
./run

# Gin
cd backends/gin
./run

# Elysia
cd backends/elysia
./run

# NestJS
cd backends/nest
./run
```

### 切换前端当前连接的后端

```bash
./scripts/switch-backend.sh spring-boot
./scripts/switch-backend.sh fastapi
./scripts/switch-backend.sh gin
./scripts/switch-backend.sh elysia
./scripts/switch-backend.sh nest
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
```

### 一键启动默认开发组合

```bash
./scripts/dev.sh
```

该脚本会：

- 启动 Spring Boot（18000）
- 启动 Vue 3 / Angular / Svelte 前端
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
