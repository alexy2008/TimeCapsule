# HelloTime — Laravel 全栈实现

Laravel 12 + Blade + Alpine.js + SQLite 全栈实现。

## 技术栈

| 层 | 技术 |
|---|---|
| 框架 | Laravel 12 |
| 语言 | PHP 8.4 |
| 模板 | Blade (服务端渲染) |
| 交互 | Alpine.js (CDN) |
| 数据库 | SQLite (共享) |
| 认证 | Session (Web) + JWT (API) |

## 快速启动

```bash
./run
# 访问 http://localhost:5179
```

## 架构说明

混合架构，类似 Spring Boot MVC：

- **Web 路由** (`routes/web.php`) — Blade SSR 页面，管理员用 Session 认证
- **API 路由** (`routes/api.php`, prefix `/api/v1`) — JSON REST API，管理员用 JWT
- **Service 层** — `CapsuleService`、`AdminService` 共享业务逻辑

## 环境变量

| 变量 | 默认值 | 说明 |
|---|---|---|
| `ADMIN_PASSWORD` | `timecapsule-admin` | 管理员密码 |
| `JWT_SECRET` | (内置) | JWT 签名密钥 |
| `PORT` | `5179` | 服务端口 |

## API 端点

符合 `spec/api/openapi.yaml` 规范：

```
GET    /api/v1/health
POST   /api/v1/capsules
GET    /api/v1/capsules/{code}
POST   /api/v1/admin/login
GET    /api/v1/admin/capsules        # JWT
DELETE /api/v1/admin/capsules/{code} # JWT
```
