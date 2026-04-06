# HelloTime Tauri 桌面端

这是 HelloTime 时间胶囊应用的跨平台桌面端实现，基于 Tauri 2 + React 19 + TypeScript 构建。

## 设计理念

Tauri 版本复用了 Web 前端（React）的组件体系和 Cyber-Glass 视觉风格，通过 Tauri 壳将其封装为原生桌面应用。相比纯浏览器方案，它具备更小的二进制体积、更低的内存占用，以及对原生窗口和系统能力的访问。

| 维度 | 说明 |
| :--- | :--- |
| UI 框架 | React 19 + TypeScript |
| 构建工具 | Vite 7 |
| 桌面壳 | Tauri 2（Rust） |
| 路由 | react-router-dom 7（客户端路由） |
| 样式 | 共享 CSS Design Tokens（`spec/styles/`）+ CSS Modules |
| HTTP | 浏览器原生 fetch（通过 CSP 放行） |
| 存储 | `@tauri-apps/plugin-store`（本地持久化） |

## 技术栈

- **Tauri 2** — 桌面壳，Rust 编译的原生进程
- **React 19** — UI 渲染
- **TypeScript 5.8** — 类型安全
- **Vite 7** — 开发与构建
- **Rust** — Tauri 后端进程

## 快速开始

### 前置条件

- Node.js 18+
- Rust 工具链（`rustup`）
- 系统依赖：参见 [Tauri 官方文档](https://v2.tauri.app/start/prerequisites/)

### 运行

```bash
cd desktop/tauri
./run
```

或手动执行：

```bash
cd desktop/tauri
npm install
npm run tauri dev
```

### 构建

```bash
cd desktop/tauri
npm run tauri build
```

构建产物位于 `src-tauri/target/release/bundle/`。

## 项目结构

```
desktop/tauri/
├── src/                    # React 前端源码
│   ├── api/                # API 客户端（fetch，连接后端 8080）
│   ├── components/         # UI 组件（AppHeader、CapsuleForm 等）
│   ├── hooks/              # React Hooks（useAdmin、useTheme 等）
│   ├── views/              # 页面组件（Home、Create、Open、Admin、About）
│   ├── types/              # TypeScript 类型定义
│   └── App.tsx             # 根组件与路由
├── src-tauri/              # Tauri / Rust 后端
│   ├── src/                # Rust 源码（插件注册、命令处理）
│   ├── icons/              # 应用图标
│   └── tauri.conf.json     # Tauri 配置（窗口、安全、打包）
├── run                     # 一键启动脚本
├── package.json            # 前端依赖
└── vite.config.ts          # Vite 配置（路径别名、开发服务器）
```

## 与浏览器前端的关系

Tauri 版本与 `frontends/react-ts/` 共享相同的组件结构和视觉设计，但有以下差异：

- API 客户端直接使用浏览器 fetch，CSP 设为 null 以允许跨域请求
- 通过 `@tauri-apps/plugin-store` 替代 `localStorage` 做持久化
- 窗口尺寸固定为 1000×800，最小 800×600
- 使用 `@spec` 路径别名直接引用仓库共享设计令牌

## 后端连接

桌面端通过 `http://localhost:8080` 连接后端，与浏览器前端共用同一个后端映射：

```bash
# 在仓库根目录切换后端
./scripts/switch-backend.sh spring-boot
```
