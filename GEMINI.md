# HelloTime (时间胶囊) - Gemini CLI 指南

HelloTime 是一个展示多技术栈对比学习的开源项目。通过实现同一个“时间胶囊”业务场景，演示了多种后端框架、前端框架、全栈方案以及桌面/移动端实现如何遵循统一的 API 契约和设计系统。

## 核心架构与规范

- **统一 API 契约**: 所有的实现（后端/全栈）都必须遵循 `spec/api/openapi.yaml` 定义的 REST API 规范。
- **统一设计系统**: 所有的前端实现都使用 `spec/styles/cyber.css` 中定义的 CSS Design Tokens（Cyberpunk 风格）。
- **完全解耦**: 前后端通过 `http://localhost:8080` 进行通信。可以使用 `scripts/switch-backend` 脚本动态切换前端连接的后端实现。
- **共享数据库**: 所有实现默认使用 SQLite 数据库，表结构一致（见 `docs/database-schema.md`）。

## 项目结构

- `backends/`: 包含 Spring Boot, FastAPI, Gin, NestJS, ASP.NET Core, Axum 等 9 个后端实现。
- `frontends/`: 包含 Vue 3, React 19, Angular 18, Svelte 5, SolidJS 等前端实现。
- `fullstacks/`: 包含 Next.js, Nuxt 3, Spring Boot MVC 等全栈一体化样板。
- `desktop/`: 包含 Tauri, WinUI 3, macOS SwiftUI 等桌面端实现。
- `spec/`: 存放共享的 API 规范 (`openapi.yaml`) 和样式系统 (`cyber.css`)。
- `scripts/`: 提供服务管理、后端切换、构建与测试的辅助脚本。

## 关键命令

### 开发与运行

- **推荐方式 (Web 管理面板)**: 
  ```bash
  python ./scripts/dev-manager.py
  ```
  启动后访问 `http://localhost:8090` 管理所有服务的启停和后端切换。

- **一键启动默认组合**: 
  ```bash
  ./scripts/dev.sh
  ```
  启动默认的后端（Spring Boot）及所有主流前端。

- **切换后端端口映射**:
  ```bash
  # 将 8080 端口映射到特定的后端（如 FastAPI）
  .\scripts\switch-backend.ps1 fastapi
  ```

- **手动运行特定实现**:
  每个实现目录下通常都有 `run.ps1` (Windows) 或 `run` (Unix) 脚本。
  ```bash
  cd backends/gin && .\run.ps1
  cd frontends/react-ts && npm run dev
  ```

### 构建与测试

- **执行全局测试**: `./scripts/test.sh`
- **执行全局构建**: `./scripts/build.sh`
- **运行共享契约验证**: 
  ```bash
  bash verification/scripts/verify-backend-contract.sh
  ```

## 开发约定

1. **API 响应格式**: 统一采用 `{ "success": boolean, "data": T, "message": string, "errorCode": string }`。
2. **主题支持**: 必须支持明亮/深色主题切换，通过在 `<html>` 标签设置 `data-theme="dark"` 并同步到 `localStorage` 实现。
3. **等宽字体**: 在展示胶囊码、技术栈标签等场景，优先使用 `Consolas` 或 `JetBrains Mono`。
4. **WinUI 3 特色**: 桌面端应尽量复刻 Web 端的“赛博玻璃”质感，并在 `App.xaml` 中覆盖系统默认的 Hover/Pressed 灰色背景。
5. **注释规范**: 核心业务逻辑应包含清晰的注释，对比不同技术栈的实现差异。

## 常用环境变量

- `ADMIN_PASSWORD`: 管理员后台密码（默认：`timecapsule-admin`）。
- `JWT_SECRET`: JWT 签名密钥。
- `DATABASE_URL`: SQLite 数据库连接字符串。
