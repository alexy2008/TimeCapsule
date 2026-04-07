# Svelte TypeScript Frontend

这是 [HelloTime](../../README.md) 时间胶囊项目的 Svelte 前端实现。基于 Svelte 5、Vite 和 TypeScript 构建。

## 特性

- ⚡️ **极速启动** - 基于 Vite 构建
- 🧩 **Svelte 5** - 采用最新的 Svelte 5 特性
- 🎨 **共享设计系统** - 使用根目录 `spec/styles/` 中的标准设计令牌和样式
- 🔒 **全类型支持** - 完整的 TypeScript 类型定义
- 🚦 **纯前端路由** - Svelte Routing 实现单页应用导航

## 快速开始

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器 (将运行在 5176 端口)
npm run dev

# 3. 构建生产版本
npm run build
```

Windows PowerShell 一键启动：

```powershell
cd frontends/svelte-ts
.\run.ps1
```

## 项目结构

```
src/
├── assets/          # 静态资源
├── lib/             # 共享代码库
│   ├── api/         # 统一封装的 API 客户端
│   ├── components/  # 可复用的 Svelte 视图组件
│   ├── types/       # 全局 TypeScript 接口定义
│   └── theme.ts     # 主题状态管理
├── views/           # 页面级组件 (Home, Create, Open 等)
├── App.svelte       # 根组件 (在此配置路由)
├── app.css          # 全局样式导入
└── main.ts          # 挂载入口点
```
