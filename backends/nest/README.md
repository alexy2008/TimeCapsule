# HelloTime Nest Backend

时间胶囊应用的 NestJS 后端实现。

## 技术栈

- **框架**: NestJS 11
- **语言**: TypeScript 5
- **运行时**: Node.js 25+
- **数据库**: SQLite（`node:sqlite`）
- **安全**: `@nestjs/jwt` / JWT

## 设计特点

- 使用 Nest 的 `Module / Controller / Service / Guard / Filter / DTO` 分层
- 使用 `ValidationPipe` + `class-validator` 做请求校验
- 使用自定义异常过滤器统一输出 `{ success, data, message, errorCode }`
- 使用 `Guard` 处理管理员 JWT 鉴权
- 使用 Node 内置 SQLite 保持部署轻量

## 快速开始

### 安装依赖

```bash
npm install
```

### 运行

```bash
./run
```

默认启动地址：`http://localhost:18040`

如需把前端固定入口切到 Nest：

```bash
./scripts/switch-backend.sh nest
```

## 环境变量

| 变量名 | 默认值 | 描述 |
|--------|--------|------|
| `PORT` | `18040` | 服务端口 |
| `DATABASE_URL` | `../../data/hellotime.db` | SQLite 数据库路径 |
| `ADMIN_PASSWORD` | `timecapsule-admin` | 管理员密码 |
| `JWT_SECRET` | `hellotime-jwt-secret-key-that-is-long-enough-for-hs256` | JWT 密钥 |
| `JWT_EXPIRATION_HOURS` | `2` | JWT 过期时间（小时） |

## 常用脚本

```bash
npm run dev
npm run build
npm test
```

## 项目结构

```text
src/
├── main.ts
├── app.module.ts
├── config/
├── common/
│   ├── dto/
│   ├── exceptions/
│   └── filters/
├── database/
├── health/
├── capsules/
├── admin/
└── tech-logos/
```
