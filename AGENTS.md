# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Project Overview

HelloTime (时间胶囊) is a time capsule application where users create messages that unlock at a future date. This is a RealWorld-style demo application showcasing multi-stack technology combinations.

## Documentation Language

- 仓库内新增或重写的文档默认使用中文撰写，除非用户明确要求使用其他语言。

## Quick Commands

### Development
```bash
# Start backend + all frontends
./scripts/dev.sh

# Backend only (port 8080)
cd backends/spring-boot && ./mvnw spring-boot:run

# Gin backend (port 8080)
cd backends/gin && go run main.go

# Vue 3 frontend (port 5173)
cd frontends/vue3-ts && npm run dev

# Angular frontend (port 5175)
cd frontends/angular-ts && npm run dev

# Svelte frontend (port 5176)
cd frontends/svelte-ts && npm run dev

# React frontend (port 5174)
cd frontends/react-ts && npm run dev

# Next 全栈实现 (port 5177)
cd fullstacks/next-ts && npm run dev -- --hostname localhost --port 5177

# Nuxt 全栈实现 (port 5178)
cd fullstacks/nuxt-ts && npm run dev -- --host localhost --port 5178

# Spring MVC 全栈实现 (port 4179)
cd fullstacks/spring-boot-mvc && ./run

# Tauri 桌面端
cd desktop/tauri && ./run

# macOS SwiftUI 桌面端
cd desktop/macos-swiftui && ./run
```

### Testing
```bash
# Run all tests (backend + all frontends)
./scripts/test.sh

# Backend tests only
cd backends/spring-boot && ./mvnw test

# Gin backend tests
cd backends/gin && go test ./tests/ -v

# Vue 3 tests only
cd frontends/vue3-ts && npm run test

# Angular tests only (Karma + Jasmine)
cd frontends/angular-ts && npm run test

# Svelte tests only (Typecheck)
cd frontends/svelte-ts && npm run check

# React tests only
cd frontends/react-ts && npm run test
```

### Build
```bash
./scripts/build.sh
```

## 文档说明

- 仓库内新增或重写文档默认使用中文。
- 当前仓库除前后端分离实现外，还包含三套独立全栈实现：
  - `fullstacks/next-ts`
  - `fullstacks/nuxt-ts`
  - `fullstacks/spring-boot-mvc`
- 当前仓库还包含两套桌面端实现：
  - `desktop/tauri` — Tauri 2 + React 19 + Rust
  - `desktop/macos-swiftui` — SwiftUI + Swift 6.1
- 当任务涉及技术栈展示、启动命令、验证脚本、文档更新时，必须同时判断是否需要同步到全栈实现和桌面端。
- `.qoder/` 目录为工具自动生成，已加入 `.gitignore`，不要扫描也不要修改。

## Architecture

### Monorepo Structure
- **backends/** - Backend implementations
  - `spring-boot/` - Spring Boot 3 + Java 21 + SQLite
  - `fastapi/` - FastAPI + Python 3.12 + SQLite
  - `gin/` - Gin 1.10 + Go 1.24 + SQLite
  - `elysia/` - Elysia + Bun + TypeScript + SQLite
  - `nest/` - NestJS + Node.js + TypeScript + SQLite
  - `aspnet-core/` - ASP.NET Core 8 + C# 12 + SQLite
- **frontends/** - Frontend implementations
  - `vue3-ts/` - Vue 3 + TypeScript + Vite (port 5173)
  - `react-ts/` - React 19 + TypeScript + Vite (port 5174)
  - `angular-ts/` - Angular 18 + TypeScript + Angular CLI (port 5175)
  - `svelte-ts/` - Svelte 5 + TypeScript + Vite (port 5176)
- **fullstacks/** - Full-stack implementations
  - `next-ts/` - Next.js 15 + TypeScript 全栈实现 (port 5177)
  - `nuxt-ts/` - Nuxt 3 + TypeScript 全栈实现 (port 5178)
  - `spring-boot-mvc/` - Spring Boot MVC + Thymeleaf + HTMX 全栈实现 (port 4179)
- **desktop/** - Desktop implementations
  - `tauri/` - Tauri 2 + React 19 + Rust 跨平台桌面
  - `macos-swiftui/` - SwiftUI + Swift 6.1 macOS 原生桌面
- **spec/** - Shared specifications (OpenAPI, design tokens, styles)
- **docs/** - Documentation (API spec, database schema, deployment, design tokens)

### Backend (Spring Boot)
- **Controllers** (`controller/`) - REST endpoints following OpenAPI spec
- **Services** (`service/`) - Business logic (CapsuleService, AdminService)
- **Repositories** (`repository/`) - Spring Data JPA repositories
- **DTOs** (`dto/`) - Request/response objects
- **Entities** (`entity/`) - JPA entities (Capsule)
- **Security** - JWT-based admin authentication via AdminAuthInterceptor

Key configuration in `application.yml`:
- SQLite database (`hellotime.db`)
- Admin password via `ADMIN_PASSWORD` env var (default: `timecapsule-admin`)
- JWT secret via `JWT_SECRET` env var

### Backend (FastAPI)
- **Routers** (`routers/`) - REST endpoints (capsule, admin, health)
- **Services** (`services/`) - Business logic (capsule_service, admin_service)
- **Models** (`models.py`) - SQLAlchemy ORM models
- **Schemas** (`schemas.py`) - Pydantic request/response models
- **Dependencies** (`dependencies.py`) - Dependency injection (DB session, JWT auth)

Key configuration in `config.py`:
- SQLite database (`hellotime.db`)
- Admin password via `ADMIN_PASSWORD` env var (default: `timecapsule-admin`)
- JWT secret via `JWT_SECRET` env var

### Backend (Gin)
- **Handlers** (`handler/`) - REST endpoints (health, capsule, admin)
- **Services** (`service/`) - Business logic (capsule_service, admin_service)
- **Models** (`model/`) - GORM model (Capsule)
- **DTOs** (`dto/`) - Request/response objects with camelCase JSON tags
- **Middleware** (`middleware/`) - CORS + JWT auth
- **Router** (`router/`) - Route registration with middleware

Key configuration in `config/config.go`:
- SQLite database (`hellotime.db`)
- Admin password via `ADMIN_PASSWORD` env var (default: `timecapsule-admin`)
- JWT secret via `JWT_SECRET` env var

### Frontend (Vue 3 + TypeScript)
- **Composables** (`composables/`) - Reusable logic (useCapsule, useAdmin, useTheme)
- **Components** (`components/`) - UI components (CapsuleForm, CapsuleCard, etc.)
- **Views** (`views/`) - Page-level components (HomeView, CreateView, OpenView, AdminView)
- **API** (`api/index.ts`) - Fetch-based API client with unified error handling
- **Types** (`types/index.ts`) - Shared TypeScript types

### Frontend (React + TypeScript)
- **Hooks** (`hooks/`) - Custom hooks (useCapsule, useAdmin, useTheme)
- **Components** (`components/`) - UI components with CSS Modules
- **Views** (`views/`) - Page-level components
- **API** (`api/index.ts`) - Fetch-based API client with unified error handling
- **Types** (`types/index.ts`) - Shared TypeScript types

### Frontend (Angular 18 + TypeScript)
- **Services** (`services/`) - Dependency-injected business logic
  - `ThemeService` - Theme toggle with localStorage + DOM `data-theme` attribute via Angular `effect()`
  - `CapsuleService` - Capsule create/get operations with Signals
  - `AdminService` - Admin authentication & capsule management with sessionStorage JWT
- **Components** (`components/`) - 9 reusable UI components (standalone, no NgModule)
  - AppHeader, AppFooter, ThemeToggle
  - CapsuleForm, CapsuleCard, CapsuleCodeInput
  - CapsuleTable, AdminLogin, ConfirmDialog
- **Views** (`views/`) - 5 page-level components (lazy-loaded routes)
  - HomeView, CreateView, OpenView, AdminView, AboutView
- **API** (`api/index.ts`) - Identical fetch-based API client as Vue/React
- **Types** (`types/index.ts`) - Identical shared TypeScript interfaces
- **Routes** (`app.routes.ts`) - 6 lazy-loaded routes with `withComponentInputBinding()` for param binding
- **Config** (`app.config.ts`) - Standalone bootstrap config with providers for routing, HTTP, animations

### Frontend (Svelte 5 + TypeScript)
- **Stores** (`lib/`) - Application state uses Svelte runes and straightforward module exports
- **Components** (`components/`) - Native Svelte components with reactive data binding
- **Views** (`views/`) - Application pages linked via `svelte-routing`
- **API** (`api/index.ts`) - Identical fetch-based API client as Vue/React/Angular
- **Types** (`types/index.ts`) - Identical shared TypeScript interfaces

### Fullstack (Next.js 15 + TypeScript)
- **Pages** (`src/app/`) - App Router pages and route-local client islands
- **Server** (`src/lib/server/`) - SQLite, auth, validation, metadata helpers
- **API** (`src/app/api/v1/`) - Route Handlers implementing the full API surface
- **Auth** - `httpOnly cookie` + `middleware.ts`
- **Tech Stack Display** - Fixed 3 items: framework, language, database

### Fullstack (Nuxt 3 + TypeScript)
- **Pages** (`pages/`) - File-based routing with SSR data flow
- **Server API** (`server/api/v1/`) - Nitro endpoints
- **Server Utils** (`server/utils/`) - SQLite, auth, validation, app info
- **Composables** (`composables/`) - Shared page logic and state
- **Auth** - Cookie + Nuxt middleware
- **Tech Stack Display** - Fixed 3 items: framework, language, database

### Fullstack (Spring Boot MVC)
- **Web Controller** (`controller/WebController`) - MVC page routes and HTMX fragment endpoints
- **Templates** (`src/main/resources/templates/`) - Thymeleaf pages and fragments
- **Static** (`src/main/resources/static/`) - CSS, JS, logos
- **Auth** - `HttpSession`
- **Interaction Model** - SSR pages + HTMX partial updates
- **Tech Stack Display** - Fixed 5 items: Spring Boot, Java, Thymeleaf, HTMX, SQLite

### API Contract
All implementations must follow `spec/api/openapi.yaml`. Key endpoints:
- `GET /api/v1/health` - Health check with tech stack info
- `POST /api/v1/capsules` - Create capsule
- `GET /api/v1/capsules/{code}` - Get capsule (content hidden until openAt)
- `POST /api/v1/admin/login` - Admin login
- `GET/DELETE /api/v1/admin/capsules` - Admin capsule management (JWT protected)

### Shared Styles
Design system defined in `spec/styles/cyber.css` with CSS custom properties and shared component styles:
- Colors (primary, background, text, status)
- Typography, spacing, radius
- Dark mode via `[data-theme="dark"]` selector

## Database

SQLite with JPA auto-DDL. Single table `capsules`:
- `code` - 8-char unique identifier (uppercase letters and digits)
- `title`, `content`, `creator` - capsule data
- `open_at` - unlock timestamp (UTC)
- `created_at` - creation timestamp (UTC)

## Key Patterns

1. **Unified API Response**: All responses follow `{ success, data, message, errorCode }` format
2. **Content Hiding**: API returns `content: null` when `open_at` is in the future
3. **Admin Auth**: Simple JWT token with 2-hour expiration
4. **Capsule Codes**: 8-character strings using uppercase letters and digits only (36^8 collision space)
5. **Health Endpoint**: `/api/v1/health` returns tech stack info for dynamic frontend display

## 技术栈展示规则

- 前后端分离实现：
  - 首页、关于页、页脚展示 5 项
  - 前端图标来自各自本地静态资源
  - 后端图标来自后端固定路径 `/tech-logos/*`
  - 名称来自 `/api/v1/health`
- 全栈实现：
  - 不依赖外部 `8080`
  - 展示项数量由实现自身固定
  - `next-ts` / `nuxt-ts` 为 3 项
  - `spring-boot-mvc` 为 5 项
  - 全部使用本实现自己的本地静态资源

## Frontend Patterns

### Shared Across All Frontends
- **Identical API Layer**: All frontends import the same `api/index.ts` (fetch-based, framework-agnostic)
- **Identical Types**: All frontends share `types/index.ts` TypeScript interfaces
- **Identical Routes**: All frontends implement `/`, `/create`, `/open/:code`, `/about`, `/admin`
- **Unified Design System**: All frontends import shared CSS tokens from `spec/styles/`
- **Theme Persistence**: All frontends sync theme to localStorage and apply `[data-theme="dark"]` attribute

### Svelte 5 Patterns
- **Reactivity**: Svelte 5 runes (`$state`, `$derived`, `$effect`) for fine-grained reactivity.
- **Components**: Scoped CSS directly in `.svelte` files.
- **Routing**: `svelte-routing` used for dynamic client side routing.

### Vue 3 Patterns
- **Composables**: `ref()` for reactive state, `computed()` for derived values, `watchEffect()` for side effects
- **Template Syntax**: `v-model` for two-way binding, `@event` for event handling
- **Styling**: Scoped CSS within `.vue` files

### React Patterns
- **Hooks**: `useState()` for state, `useCallback()` for memoized handlers, `useSyncExternalStore()` for cross-component state
- **CSS Modules**: Component-scoped styling via `.module.css` files
- **JSX**: Route components plus local hooks/components; current implementation may use route-level lazy loading when needed

### Angular Patterns
- **Signals**: `signal()` for reactive state (replaces hooks), `computed()` for derived values, `effect()` for side effects
- **Standalone Components**: All components are standalone (no NgModule), using `@Component({ standalone: true })`
- **Services**: Injectable services with `providedIn: 'root'` or component-level providers for scoped instances
- **Route Parameter Binding**: `withComponentInputBinding()` enables direct `@Input()` binding from route params
- **Template Syntax**: `@if`, `@for` (Angular 17+ control flow), `[(ngModel)]` for two-way binding
- **Styling**: Component CSS files, shared tokens from `spec/styles/` via `angular.json` styles array
- **Testing**: Karma + Jasmine (Angular CLI default), no RxJS in business logic
