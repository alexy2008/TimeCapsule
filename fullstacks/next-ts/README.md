# HelloTime Next 全栈实现

这是 HelloTime 的 Next.js 全栈版本，基于：

- Next.js 15
- React 19
- TypeScript 5
- SQLite

## 技术特点

- App Router 页面结构
- Route Handlers 提供完整 `/api/v1/*`
- `httpOnly cookie` + `middleware` 管理管理员登录态
- 服务端首屏取数，客户端交互岛负责创建、开启、管理流程

## 运行

```bash
cd fullstacks/next-ts
npm install
npm run dev -- --hostname localhost --port 5177
```

Windows PowerShell:

```powershell
cd fullstacks/next-ts
.\run.ps1
```

默认地址：

- 应用入口：[http://localhost:5177](http://localhost:5177)
- API 健康检查：[http://localhost:5177/api/v1/health](http://localhost:5177/api/v1/health)

## 构建

```bash
npm run build
npm run start -- --hostname localhost --port 5177
```

## 技术栈展示

本实现技术栈展示固定为 3 项：

- Next.js
- TypeScript
- SQLite

对应静态资源：

- `public/frontend.svg`
- `public/frontend-language.svg`
- `public/sqlite-logo.svg`

不依赖外部后端的 `/tech-logos/*` 或 `localhost:8080`。

## 路由

- `/`
- `/create`
- `/open`
- `/open/[code]`
- `/about`
- `/admin`
- `/api/v1/*`

## 说明

- 本实现已内置完整 API，不依赖外部 `8080`
- SQLite 数据库默认保存在项目根目录下的 `hellotime.db`
- 管理员密码默认值为 `timecapsule-admin`，可通过 `ADMIN_PASSWORD` 覆盖
