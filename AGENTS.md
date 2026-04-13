# AGENTS.md

This file provides guidance to Qoder (qoder.com) when working with code in this repository.

## Project Overview

HelloTime (时间胶囊) is a time capsule application where users create messages that unlock at a future date. This is a RealWorld-style demo application showcasing multi-stack technology combinations. The project's purpose is not the business logic itself, but demonstrating how different tech stacks implement the same API contract and design system.

## Documentation Language

- 仓库内新增或重写的文档默认使用中文撰写，除非用户明确要求使用其他语言。
- 代码注释默认使用中文。优先解释"为什么这样写"和"与其他技术栈如何对应"，不要机械复述代码。详见 `docs/comment-guidelines.md`。

## Quick Commands

### Development

```bash
# 推荐方式：Web 服务管理面板（http://localhost:8090）
python ./scripts/dev-manager.py

# 一键启动默认组合（Spring Boot + 所有前端 + 全栈实现）
./scripts/dev.sh

# --- 后端（各自独立端口）---
cd backends/spring-boot   && ./run          # port 18000
cd backends/fastapi       && ./run          # port 18010
cd backends/gin           && ./run          # port 18020
cd backends/elysia        && ./run          # port 18030
cd backends/nest          && ./run          # port 18040
cd backends/aspnet-core   && ./run          # port 18050
cd backends/ktor          && ./run          # port 18090
cd backends/vapor         && ./run          # port 18060
cd backends/axum          && ./run          # port 18070
cd backends/drogon        && ./run          # port 18080

# --- 前端（前后端分离，通过 localhost:8080 代理访问后端）---
cd frontends/vue3-ts      && npm run dev    # port 5173
cd frontends/react-ts     && npm run dev    # port 5174
cd frontends/angular-ts   && npm run dev    # port 5175
cd frontends/svelte-ts    && npm run dev    # port 5176
cd frontends/solid-ts     && npm run dev -- --host localhost --port 5180

# --- 全栈实现（自带 API，不依赖 localhost:8080）---
cd fullstacks/next-ts           && npm run dev -- --hostname localhost --port 5177
cd fullstacks/nuxt-ts           && npm run dev -- --host localhost --port 5178
cd fullstacks/spring-boot-mvc   && ./run                            # port 4179

# --- 桌面端 ---
cd desktop/tauri          && ./run            # Tauri 2 + React 19 + Rust
cd desktop/flutter_desktop && ./run.ps1       # Flutter 3 + Dart
cd desktop/macos-swiftui  && ./run            # macOS only
cd desktop/winui3         && ./run.ps1        # Windows only

# --- 后端切换（将 localhost:8080 转发到指定后端）---
./scripts/switch-backend.sh gin               # Unix
.\scripts\switch-backend.ps1 aspnet-core      # Windows PowerShell
```

### Testing

```bash
# 全局测试
./scripts/test.sh

# --- 后端 ---
cd backends/spring-boot   && ./mvnw test
cd backends/fastapi       && pytest
cd backends/gin           && go test ./tests/ -v
cd backends/elysia        && bun test
cd backends/nest          && npm test
cd backends/aspnet-core   && ./dotnetw test tests/tests.csproj
cd backends/vapor/server  && swift test       # macOS only
cd backends/axum          && cargo test
cd backends/drogon        && cmake -S . -B build -G Ninja && cmake --build build --target hellotime-drogon-tests && ctest --test-dir build --output-on-failure

# --- 前端 ---
cd frontends/vue3-ts      && npm run test
cd frontends/react-ts     && npm run test
cd frontends/angular-ts   && npm run test     # Karma + Jasmine
cd frontends/svelte-ts    && npm run check    # Typecheck only
cd frontends/solid-ts     && npm run test

# --- 全栈 ---
cd fullstacks/next-ts           && npm run build    # 构建验证
cd fullstacks/nuxt-ts           && npm run build    # 构建验证
cd fullstacks/spring-boot-mvc   && ./mvnw test
```

### Verification (共享契约验证)

```bash
# 后端共享契约验证（验证所有后端是否遵循同一 API 契约）
bash verification/scripts/verify-backend-contract.sh

# 前端静态/本地命令验证
bash verification/scripts/verify-frontend-flows.sh [implementation...]

# 前端浏览器主流程验证
bash verification/scripts/verify-frontend-browser-flows.sh [implementation...]
```

### Build

```bash
./scripts/build.sh
```

## Architecture

### Backend Port Mapping (关键架构)

前后端分离实现中，前端统一通过 `http://localhost:8080` 访问后端。实际后端运行在 18xxx 端口：

| 后端 | 端口 | 语言/运行时 |
|------|------|-------------|
| Spring Boot 3 | 18000 | Java 21 |
| FastAPI | 18010 | Python 3.12+ |
| Gin 1.10 | 18020 | Go 1.24+ |
| Elysia | 18030 | TypeScript + Bun |
| NestJS | 18040 | TypeScript + Node.js |
| ASP.NET Core 8 | 18050 | C# 12 + .NET 8 |
| Ktor 2.3 | 18090 | Kotlin/JVM |
| Vapor 4 | 18060 | Swift 6.2+ |
| Axum 0.8 | 18070 | Rust 1.94+ |
| Drogon 1.9 | 18080 | C++20 |

`scripts/switch-backend.sh`（Unix）/ `scripts/switch-backend.ps1`（Windows）通过端口转发将 `8080` 映射到指定后端的 18xxx 端口。全栈实现（Next/Nuxt/Spring MVC）自带 API，不走此映射。

前端开发服务器必须代理 `/api` 和 `/tech-logos` 两个前缀到 `localhost:8080`。

### Monorepo Structure

- **backends/** — 10 个后端实现，各跑独立端口，共享 SQLite 表结构和 API 契约
- **frontends/** — 5 个前端框架实现，共享 `api/index.ts`、`types/index.ts`、`spec/styles/cyber.css`
- **fullstacks/** — 3 个独立全栈实现（自带前后端），不依赖 `localhost:8080`
- **desktop/** — 4 个桌面端实现（Tauri、Flutter、macOS SwiftUI、WinUI 3）
- **spec/** — 共享规范：`api/openapi.yaml`（API 契约）+ `styles/cyber.css`（设计系统）
- **verification/** — 共享契约验证脚本与验证矩阵
- **scripts/** — 开发/构建/测试/后端切换脚本 + `dev-manager.py` 服务管理面板
- `.qoder/` 目录为工具自动生成，已加入 `.gitignore`，不要扫描也不要修改

### Backend (Spring Boot)
- **Controllers** (`controller/`) — REST endpoints following OpenAPI spec
- **Services** (`service/`) — Business logic (CapsuleService, AdminService)
- **Repositories** (`repository/`) — Spring Data JPA repositories
- **DTOs** (`dto/`) — Request/response objects
- **Entities** (`entity/`) — JPA entities (Capsule)
- **Security** — JWT-based admin authentication via AdminAuthInterceptor

### Backend (FastAPI)
- **Routers** (`routers/`) — REST endpoints (capsule, admin, health)
- **Services** (`services/`) — Business logic (capsule_service, admin_service)
- **Models** (`models.py`) — SQLAlchemy ORM models
- **Schemas** (`schemas.py`) — Pydantic request/response models
- **Dependencies** (`dependencies.py`) — Dependency injection (DB session, JWT auth)

### Backend (Gin)
- **Handlers** (`handler/`) — REST endpoints (health, capsule, admin)
- **Services** (`service/`) — Business logic (capsule_service, admin_service)
- **Models** (`model/`) — GORM model (Capsule)
- **DTOs** (`dto/`) — Request/response objects with camelCase JSON tags
- **Middleware** (`middleware/`) — CORS + JWT auth
- **Router** (`router/`) — Route registration with middleware

### Backend (Elysia)
- **Routes** (`src/routes/`) — REST endpoints
- **Services** (`src/services/`) — Business logic
- **Schemas** (`src/schemas/`) — Request/response validation
- **Config** (`src/config.ts`) — Environment configuration
- **Database** (`src/database.ts`) — SQLite connection

### Backend (NestJS)
- **Modules** (`src/app.module.ts`) — Root module with imports
- **Controllers** (`src/capsules/`, `src/admin/`, `src/health/`) — REST endpoints
- **Services** — Business logic co-located with controllers
- **Common** (`src/common/`) — Shared guards, interceptors, decorators
- **Database** (`src/database/`) — SQLite connection
- **Static** (`static/tech-logos/`) — Tech stack display logos

### Backend (ASP.NET Core)
- **Controllers** (`Controllers/`) — REST endpoints (Health, Capsules, Admin)
- **Services** (`Services/`) — Business logic (CapsuleService, AdminAuthService)
- **Models** (`Models/`) — Entity models
- **DTOs** (`Dtos/`) — Request/response objects
- **Middleware** (`Middleware/`) — JWT auth middleware
- **Configuration** (`Configuration/`) — App configuration

### Backend (Ktor)
- **Application** (`src/main/kotlin/com/hellotime/Application.kt`) — Ktor plugin 安装、路由与静态资源
- **Config** (`src/main/kotlin/com/hellotime/config/`) — 环境变量与运行配置
- **Services** (`src/main/kotlin/com/hellotime/service/`) — 胶囊业务、JWT、SQLite JDBC 持久化
- **Models** (`src/main/kotlin/com/hellotime/model/`) — `kotlinx.serialization` 请求/响应模型与异常
- **Static** (`src/main/resources/static/tech-logos/`) — 技术栈展示图标

### Backend (Vapor)
- **Controllers** (`server/Sources/App/Controllers/`) — REST endpoints
- **Services** (`server/Sources/App/Services/`) — Business logic
- **Models** (`server/Sources/App/Models/`) — Fluent ORM models
- **DTOs** (`server/Sources/App/DTOs/`) — Request/response objects
- **Middleware** (`server/Sources/App/Middleware/`) — JWT auth
- **Migrations** (`server/Sources/App/Migrations/`) — Database schema

### Backend (Axum)
- **Router / Handlers** (`src/lib.rs`) — Axum Router、extractor 与路由处理
- **State** (`AppState`) — 共享 SQLite 连接池与运行配置
- **Auth Extractor** (`AdminAuth`) — Bearer Token 鉴权
- **Persistence** — SQLx + SQLite，启动时自动建表
- **Static** (`static/tech-logos/`) — 技术栈展示图标

### Backend (Drogon)
- **Routes / Handlers** (`src/server.cc`) — Drogon 原生路由注册与请求处理
- **State** (`AppState`) — 共享 SQLite 连接与互斥锁
- **Auth** — 手写 Bearer Token 解析与 HMAC SHA-256 JWT 校验
- **Persistence** — SQLite3 C API，启动时自动建表
- **Static** (`static/tech-logos/`) — 技术栈展示图标

### Frontend (Vue 3 + TypeScript)
- **Composables** (`composables/`) — `ref()`, `computed()`, `watchEffect()`
- **Components** (`components/`) — Scoped CSS within `.vue` files
- **Views** (`views/`) — Page-level components
- **API** (`api/index.ts`) / **Types** (`types/index.ts`) — Shared across all frontends

### Frontend (React + TypeScript)
- **Hooks** (`hooks/`) — `useState()`, `useCallback()`, `useSyncExternalStore()`
- **Components** (`components/`) — CSS Modules (`.module.css`)
- **Views** (`views/`) — Page-level components
- **API** (`api/index.ts`) / **Types** (`types/index.ts`) — Shared across all frontends

### Frontend (Angular 18 + TypeScript)
- **Services** (`services/`) — Injectable, Signals-based (`signal()`, `computed()`, `effect()`)
- **Components** (`components/`) — Standalone (no NgModule), `@if`/`@for` control flow
- **Views** (`views/`) — Lazy-loaded routes with `withComponentInputBinding()`
- **Testing** — Karma + Jasmine (Angular CLI default), no RxJS in business logic

### Frontend (Svelte 5 + TypeScript)
- **Stores** (`lib/`) — Svelte 5 runes (`$state`, `$derived`, `$effect`)
- **Components** (`components/`) — Scoped CSS in `.svelte` files
- **Views** (`views/`) — `svelte-routing` for client-side routing

### Frontend (SolidJS + TypeScript)
- **Lib** (`lib/`) — Signals (`createSignal`, `createMemo`), API/theme/admin state modules
- **Components** (`components/`) — Fine-grained reactivity with Solid JSX
- **Routes** (`routes/`) — File-based route components
- **API** (`lib/api.ts`) / **Types** (`types/`) — Same contract as other frontends

### Fullstack (Next.js 15 + TypeScript)
- **Pages** (`src/app/`) — App Router pages and route-local client islands
- **Server** (`src/lib/server/`) — SQLite, auth, validation, metadata helpers
- **API** (`src/app/api/v1/`) — Route Handlers implementing full API surface
- **Auth** — `httpOnly cookie` + `middleware.ts`
- **Tech Stack Display** — Fixed 3 items: framework, language, database (all local assets)

### Fullstack (Nuxt 3 + TypeScript)
- **Pages** (`pages/`) — File-based routing with SSR data flow
- **Server API** (`server/api/v1/`) — Nitro endpoints
- **Server Utils** (`server/utils/`) — SQLite, auth, validation, app info
- **Composables** (`composables/`) — Shared page logic and state
- **Auth** — Cookie + Nuxt middleware
- **Tech Stack Display** — Fixed 3 items: framework, language, database (all local assets)

### Fullstack (Spring Boot MVC)
- **Web Controller** (`controller/WebController`) — MVC page routes + HTMX fragment endpoints
- **Templates** (`src/main/resources/templates/`) — Thymeleaf pages and fragments
- **Static** (`src/main/resources/static/`) — CSS, JS, logos
- **Auth** — `HttpSession`
- **Interaction Model** — SSR pages + HTMX partial updates
- **Tech Stack Display** — Fixed 5 items: Spring Boot, Java, Thymeleaf, HTMX, SQLite

### Desktop (Tauri 2)
- 复用 React 19 前端代码，Tauri 2 Rust 壳
- 通过 `/api/v1/health` 读取后端技术栈名称，前端两项由自身固定声明

### Desktop (Flutter)
- Flutter 3 + Dart 跨平台桌面
- `lib/` 下含 api、components、models、providers、views 目录

### Desktop (macOS SwiftUI / WinUI 3)
- 原生实现，赛博玻璃风格，复刻 Web 端视觉体验
- WinUI 3 需在 `App.xaml` 中覆盖系统默认的 Hover/Pressed 灰色背景

### API Contract

All implementations must follow `spec/api/openapi.yaml`. Key endpoints:

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/v1/health` | No | Health check with tech stack info |
| POST | `/api/v1/capsules` | No | Create capsule (returns 201) |
| GET | `/api/v1/capsules/{code}` | No | Get capsule (content hidden until openAt) |
| POST | `/api/v1/admin/login` | No | Admin login |
| GET | `/api/v1/admin/capsules` | JWT | Paginated capsule list (admin sees all content) |
| DELETE | `/api/v1/admin/capsules/{code}` | JWT | Delete capsule |

### Shared Styles

Design system defined in `spec/styles/cyber.css`:
- CSS custom properties for colors, typography, spacing, radius
- Dark mode via `[data-theme="dark"]` selector on `<html>`
- All frontends sync theme to `localStorage` and apply the attribute

## Database

SQLite. Single table `capsules`:

| Column | Type | Description |
|--------|------|-------------|
| `id` | INTEGER | PK (auto-increment) |
| `code` | VARCHAR(8) | 8-char unique ID (uppercase A-Z + digits 0-9) |
| `title` | VARCHAR(100) | Capsule title |
| `content` | TEXT | Capsule content |
| `creator` | VARCHAR(30) | Creator nickname |
| `open_at` | TEXT | Unlock timestamp (UTC ISO 8601) |
| `created_at` | TEXT | Creation timestamp (UTC ISO 8601) |

## Key Patterns

1. **Unified API Response**: All responses follow `{ success, data, message, errorCode }` format
2. **Content Hiding**: API returns `content: null` when `open_at` is in the future; admin endpoints always expose content
3. **Admin Auth**: JWT (HS256, 2-hour expiration). Frontend separation uses `sessionStorage`; fullstack uses `httpOnly cookie` or `HttpSession`
4. **Capsule Codes**: 8-character strings using uppercase letters and digits only (36^8 collision space)
5. **Health Endpoint**: `/api/v1/health` returns tech stack info (`framework`, `language`, `database`) for dynamic frontend display
6. **Verification Layer**: `verification/` validates behavioral parity across implementations without shared runtime code — contract violations should be caught here, not by treating any single implementation as canonical

## 技术栈展示规则

- **前后端分离实现**：首页、关于页、页脚展示 5 项（前端框架 · 前端语言 · 后端框架 · 后端语言 · 数据库）
  - 前端图标来自各自本地静态资源 (`frontend.svg`, `frontend-language.svg`)
  - 后端图标来自后端固定路径 `/tech-logos/{backend,language,database}.svg`
  - 后端名称来自 `/api/v1/health` 的 `techStack` 字段
  - 首页/页脚的名称简化只能做通用去版本号，不能写技术栈特判
- **全栈实现**：不依赖 `localhost:8080`，展示项数量和资源由实现自身固定
  - `next-ts` / `nuxt-ts`：3 项（框架、语言、数据库）
  - `spring-boot-mvc`：5 项（Spring Boot、Java、Thymeleaf、HTMX、SQLite）
- **桌面端**：5 项，前两项由实现自身固定声明，后三项从 `/api/v1/health` 读取
- 详见 `docs/tech-stack-display.md`

## 跨实现同步规则

当任务涉及技术栈展示、启动命令、验证脚本、文档更新时，必须同时判断是否需要同步到：
- 所有 5 个前端实现
- 所有 10 个后端实现
- 3 个全栈实现
- 4 个桌面端实现
- 共享验证脚本

## Common Environment Variables

All backends share these env vars (names may differ slightly by stack):

| Variable | Default | Purpose |
|----------|---------|---------|
| `ADMIN_PASSWORD` | `timecapsule-admin` | Admin login password |
| `JWT_SECRET` | `hellotime-jwt-secret-key-that-is-long-enough-for-hs256` | JWT signing key |
| `DATABASE_URL` | `../../data/hellotime.db` | SQLite database path (Axum/Drogon) |
| `JWT_EXPIRATION_HOURS` | `2` | Token validity period |
