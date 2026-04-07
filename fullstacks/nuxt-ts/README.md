# HelloTime Nuxt 全栈实现

这是 HelloTime 的 Nuxt 全栈版本，基于：

- Nuxt 3
- Vue 3
- TypeScript
- SQLite

## 技术特点

- `pages/` 文件路由驱动页面
- `server/api/` + Nitro 直接提供完整 `/api/v1/*`
- `useAsyncData` / `useCookie` / `useState` 组织页面数据流
- middleware 与 plugin 负责登录态和主题初始化

## 运行

```bash
cd fullstacks/nuxt-ts
npm install
npm run dev -- --host localhost --port 5178
```

Windows PowerShell:

```powershell
cd fullstacks/nuxt-ts
.\run.ps1
```

默认地址：

- 应用入口：[http://localhost:5178](http://localhost:5178)
- API 健康检查：[http://localhost:5178/api/v1/health](http://localhost:5178/api/v1/health)

## 构建

```bash
npm run build
npm run preview -- --host localhost --port 5178
```

## 技术栈展示

本实现技术栈展示固定为 3 项：

- Nuxt
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

- 本实现不依赖 `localhost:8080` 外部后端
- 数据库默认保存在项目目录下的 `hellotime.db`
- 管理员密码默认值为 `timecapsule-admin`
