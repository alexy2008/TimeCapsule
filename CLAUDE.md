# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

HelloTime (时间胶囊) is a time capsule application where users create messages that unlock at a future date. This is a RealWorld-style demo application showcasing multi-stack technology combinations.

## Quick Commands

### Development
```bash
# Start backend + all frontends (Vue, Angular)
./scripts/dev.sh

# Backend only (port 8080)
cd backends/spring-boot && ./mvnw spring-boot:run

# Vue 3 frontend (port 5173)
cd frontends/vue3-ts && npm run dev

# Angular frontend (port 5175)
cd frontends/angular-ts && npm run dev

# React frontend (port 5174)
cd frontends/react-ts && npm run dev
```

### Testing
```bash
# Run all tests (backend + all frontends)
./scripts/test.sh

# Backend tests only
cd backends/spring-boot && ./mvnw test

# Vue 3 tests only
cd frontends/vue3-ts && npm run test

# Angular tests only (Karma + Jasmine)
cd frontends/angular-ts && npm run test

# React tests only
cd frontends/react-ts && npm run test
```

### Build
```bash
./scripts/build.sh
```

## Architecture

### Monorepo Structure
- **backends/** - Backend implementations
  - `spring-boot/` - Spring Boot 3 + Java 17 + SQLite
  - `fastapi/` - FastAPI + Python 3.12 + SQLite
- **frontends/** - Frontend implementations
  - `vue3-ts/` - Vue 3 + TypeScript + Vite (port 5173)
  - `react-ts/` - React 19 + TypeScript + Vite (port 5174)
  - `angular-ts/` - Angular 18 + TypeScript + Angular CLI (port 5175)
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

### API Contract
All implementations must follow `spec/api/openapi.yaml`. Key endpoints:
- `GET /api/v1/health` - Health check with tech stack info
- `POST /api/v1/capsules` - Create capsule
- `GET /api/v1/capsules/{code}` - Get capsule (content hidden until openAt)
- `POST /api/v1/admin/login` - Admin login
- `GET/DELETE /api/v1/admin/capsules` - Admin capsule management (JWT protected)

### Shared Styles
Design tokens defined in `spec/styles/tokens.css` with CSS custom properties:
- Colors (primary, background, text, status)
- Typography, spacing, radius
- Dark mode via `[data-theme="dark"]` selector

## Database

SQLite with JPA auto-DDL. Single table `capsules`:
- `code` - 8-char unique identifier (base62)
- `title`, `content`, `creator` - capsule data
- `open_at` - unlock timestamp (UTC)
- `created_at` - creation timestamp (UTC)

## Key Patterns

1. **Unified API Response**: All responses follow `{ success, data, message, errorCode }` format
2. **Content Hiding**: API returns `content: null` when `open_at` is in the future
3. **Admin Auth**: Simple JWT token with 2-hour expiration
4. **Capsule Codes**: 8-character base62 strings (62^8 collision space)
5. **Health Endpoint**: `/api/v1/health` returns tech stack info for dynamic frontend display

## Frontend Patterns

### Shared Across All Frontends
- **Identical API Layer**: All frontends import the same `api/index.ts` (fetch-based, framework-agnostic)
- **Identical Types**: All frontends share `types/index.ts` TypeScript interfaces
- **Identical Routes**: All frontends implement `/`, `/create`, `/open/:code`, `/about`, `/admin`
- **Unified Design System**: All frontends import shared CSS tokens from `spec/styles/`
- **Theme Persistence**: All frontends sync theme to localStorage and apply `[data-theme="dark"]` attribute

### Vue 3 Patterns
- **Composables**: `ref()` for reactive state, `computed()` for derived values, `watchEffect()` for side effects
- **Template Syntax**: `v-model` for two-way binding, `@event` for event handling
- **Styling**: Scoped CSS within `.vue` files

### React Patterns
- **Hooks**: `useState()` for state, `useCallback()` for memoized handlers, `useSyncExternalStore()` for cross-component state
- **CSS Modules**: Component-scoped styling via `.module.css` files
- **JSX**: React.lazy() + Suspense for code splitting

### Angular Patterns
- **Signals**: `signal()` for reactive state (replaces hooks), `computed()` for derived values, `effect()` for side effects
- **Standalone Components**: All components are standalone (no NgModule), using `@Component({ standalone: true })`
- **Services**: Injectable services with `providedIn: 'root'` or component-level providers for scoped instances
- **Route Parameter Binding**: `withComponentInputBinding()` enables direct `@Input()` binding from route params
- **Template Syntax**: `@if`, `@for` (Angular 17+ control flow), `[(ngModel)]` for two-way binding
- **Styling**: Component CSS files, shared tokens from `spec/styles/` via `angular.json` styles array
- **Testing**: Karma + Jasmine (Angular CLI default), no RxJS in business logic
