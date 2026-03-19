# 时间胶囊 (HelloTime)

> 🕰️ 封存此刻的心意，在未来的某个时刻开启

灵感来自 RealWorld 的技术展示项目，通过统一的 API 规范和可复用的设计系统，展示多种前后端技术栈的自由组合能力。

## ✨ 特性亮点

- 🎯 **前后端完全解耦** - 任意前端 + 任意后端自由组合
- 📐 **统一规范** - OpenAPI 3.0 + CSS Design Tokens
- 🎨 **响应式设计** - 完美支持 PC 和移动端
- 🌓 **主题切换** - 明亮/深色主题一键切换
- 🧪 **完整测试** - 前后端单元测试 + 集成测试
- 📚 **详尽文档** - API 文档、架构设计、部署指南

## 🛠️ 技术栈

### 前端框架
| 框架 | 路径 | 构建工具 | 端口 |
|------|------|----------|------|
| **Vue 3** | `frontends/vue3-ts/` | Vite 7 | 5173 |
| **React 19** | `frontends/react-ts/` | Vite 7 | 5174 |
| **Angular 18** | `frontends/angular-ts/` | Angular CLI | 5175 |
| **Svelte 5** | `frontends/svelte-ts/` | Vite 7 | 5176 |

### 后端框架
| 框架 | 路径 | 语言 | 数据库 |
|------|------|------|--------|
| **Spring Boot 3** | `backends/spring-boot/` | Java 21 | SQLite |
| **FastAPI** | `backends/fastapi/` | Python 3.12+ | SQLite |
| **Gin** | `backends/gin/` | Go 1.24+ | SQLite |

> 📊 **后端对比分析**：查看 [FastAPI vs Gin vs Spring Boot 对比报告](docs/backend-comparison.md) 了解更多细节。

> 💡 所有实现遵循统一的 [API 规范](spec/api/openapi.yaml) 和 [设计系统](spec/styles/)，确保功能完全一致。

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
│   ├── spring-boot/         # Spring Boot 3 + Java 17
│   ├── fastapi/             # FastAPI + Python 3.10
│   └── gin/                 # Gin + Go 1.24
└── scripts/                 # 开发/构建/测试脚本
    ├── dev.sh               # 启动所有开发服务
    ├── build.sh             # 构建所有项目
    └── test.sh              # 运行所有测试
```

## 🚀 快速开始

### 方式一：Spring Boot + Vue 3

**启动后端**
```bash
cd backends/spring-boot
./mvnw spring-boot:run
```
> 🌐 服务地址：http://localhost:8080

**启动前端**
```bash
cd frontends/vue3-ts
npm install
npm run dev
```
> 🌐 开发服务器：http://localhost:5173

---

### 方式二：FastAPI + React

**启动后端**
```bash
cd backends/fastapi
pip install -r requirements.txt
uvicorn app.main:app --port 8080
```
> 🌐 服务地址：http://localhost:8080

**启动前端**
```bash
cd frontends/react-ts
npm install
npm run dev
```
> 🌐 开发服务器：http://localhost:5174

---

### 方式三：Spring Boot + Angular

**启动后端**
```bash
cd backends/spring-boot
./mvnw spring-boot:run
```

**启动前端**
```bash
cd frontends/angular-ts
npm install
npm run dev
```
> 🌐 开发服务器：http://localhost:5175

---

### 方式四：Gin + Vue 3

**启动后端**
```bash
cd backends/gin
go run main.go
```
> 🌐 服务地址：http://localhost:8080

**启动前端**
```bash
cd frontends/vue3-ts
npm install
npm run dev
```
> 🌐 开发服务器：http://localhost:5173

---

### 方式五：一键启动所有服务

```bash
# 同时启动后端 + 全部前端（Vue 5173, React 5174, Angular 5175, Svelte 5176）
./scripts/dev.sh
```

> 💡 **提示**：任意前端都可以与任意后端组合使用，只需确保后端 API 地址配置正确即可。

## 🧪 测试

### 运行所有测试

```bash
# 一键运行前后端所有测试
./scripts/test.sh
```

### 单独运行测试

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
```

> ✅ 所有测试均包含单元测试和集成测试，覆盖核心业务逻辑。

## 🎯 核心功能

- 📦 **创建胶囊** - 设置标题、内容、开启时间和创建者昵称
- 🔍 **查询胶囊** - 通过 8 位唯一码查询，未到开启时间自动隐藏内容
- 🔐 **管理员认证** - JWT Token 认证（2 小时有效期）
- 📋 **胶囊管理** - 分页查看所有胶囊、删除胶囊
- 📱 **响应式设计** - 自适应 PC、平板、移动端
- 🌓 **主题切换** - 明亮/深色主题无缝切换
- 🎨 **现代 UI** - 简洁美观的界面设计

## 💾 数据库设计

所有实现使用 SQLite，单表结构：

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | INTEGER | 主键（自增） |
| `code` | VARCHAR(8) | 8 位唯一码（Base62: A-Za-z0-9） |
| `title` | VARCHAR(100) | 胶囊标题 |
| `content` | TEXT | 胶囊内容 |
| `creator` | VARCHAR(30) | 创建者昵称 |
| `open_at` | DATETIME | 开启时间（UTC） |
| `created_at` | DATETIME | 创建时间（UTC） |

## 🔌 API 接口

所有实现提供统一的 REST API：

| 方法 | 端点 | 说明 | 认证 |
|------|------|------|------|
| `GET` | `/api/v1/health` | 健康检查 | ❌ |
| `POST` | `/api/v1/capsules` | 创建胶囊 | ❌ |
| `GET` | `/api/v1/capsules/{code}` | 查询胶囊 | ❌ |
| `POST` | `/api/v1/admin/login` | 管理员登录 | ❌ |
| `GET` | `/api/v1/admin/capsules` | 分页列表 | ✅ |
| `DELETE` | `/api/v1/admin/capsules/{code}` | 删除胶囊 | ✅ |

> 📖 完整 API 规范：[`spec/api/openapi.yaml`](spec/api/openapi.yaml)

## 🔐 认证机制

采用 **JWT Bearer Token** 认证：

**请求头格式**
```
Authorization: Bearer <token>
```

**Token 特性**
- 有效期：2 小时
- 签名算法：HS256
- 生成方式：管理员登录端点获取

**错误响应格式**
```json
{
  "success": false,
  "message": "错误描述",
  "errorCode": "ERROR_CODE"
}
```

**常见错误码**
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
| `DATABASE_URL` | `sqlite:///hellotime.db` | 数据库连接 |
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
