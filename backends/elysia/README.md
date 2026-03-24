# HelloTime Elysia Backend

时间胶囊应用的后端服务，基于 Elysia 和 Bun 构建。

## 技术栈

- **框架**: Elysia 1.x
- **语言**: TypeScript 5.6+
- **运行时**: Bun 1.1+
- **数据库**: SQLite（bun:sqlite）
- **安全**: jose / JWT

## 功能特性

- RESTful API
- 统一 API 响应格式
- JWT 管理员认证
- SQLite 轻量持久化
- 基于 TypeBox 的运行时校验
- 内置 Swagger 文档

## 快速开始

### 前置要求

- Bun 1.1+

### 安装依赖

```bash
bun install
```

### 运行应用

```bash
# 开发/本地运行
./run

# 或直接使用 bun
bun run src/index.ts
```

应用默认将在 `http://localhost:18030` 启动。

如需保持前端仍访问 `http://localhost:8080`，可在仓库根目录执行：

```bash
./scripts/switch-backend.sh elysia
```

### 访问 API 文档

- Swagger UI: `http://localhost:18030/api/docs`
- 健康检查: `http://localhost:18030/api/v1/health`

### 环境变量配置

| 变量名 | 默认值 | 描述 |
|--------|--------|------|
| `PORT` | `18030` | 服务端口 |
| `DATABASE_URL` | `../../data/hellotime.db` | SQLite 数据库路径 |
| `ADMIN_PASSWORD` | `timecapsule-admin` | 管理员登录密码 |
| `JWT_SECRET` | `hellotime-jwt-secret-key-that-is-long-enough-for-hs256` | JWT 签名密钥 |
| `JWT_EXPIRATION_HOURS` | `2` | JWT 过期时间（小时） |

示例：

```bash
export PORT=18030
export ADMIN_PASSWORD=my-secure-password
export JWT_SECRET=my-jwt-secret
./run
```

## API 端点

### 胶囊相关

| 方法 | 路径 | 描述 |
|------|------|------|
| POST | `/api/v1/capsules` | 创建时间胶囊 |
| GET | `/api/v1/capsules/{code}` | 获取胶囊详情 |

### 管理员相关

| 方法 | 路径 | 描述 |
|------|------|------|
| POST | `/api/v1/admin/login` | 管理员登录 |
| GET | `/api/v1/admin/capsules` | 获取所有胶囊（需认证） |
| DELETE | `/api/v1/admin/capsules/{code}` | 删除胶囊（需认证） |

### 健康检查

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | `/api/v1/health` | 健康检查端点（返回技术栈信息） |

## 项目结构

```text
src/
├── config.ts        # 配置管理
├── database.ts      # SQLite 连接与数据访问
├── index.ts         # 应用入口
├── routes/          # 路由定义
│   ├── health.ts
│   ├── capsule.ts
│   └── admin.ts
├── schemas/         # TypeBox schema
└── services/        # 业务逻辑
    ├── capsule.ts
    └── admin.ts
```

## 测试

```bash
bun test
```

## 构建

```bash
bun run build
```

## cURL 示例

```bash
# 创建胶囊
curl -X POST http://localhost:18030/api/v1/capsules \
  -H "Content-Type: application/json" \
  -d '{
    "title": "给未来的自己",
    "content": "希望你一切都好",
    "creator": "张三",
    "openAt": "2027-01-01T00:00:00Z"
  }'

# 查询胶囊
curl http://localhost:18030/api/v1/capsules/{code}

# 管理员登录
curl -X POST http://localhost:18030/api/v1/admin/login \
  -H "Content-Type: application/json" \
  -d '{"password": "timecapsule-admin"}'
```

## 响应格式

所有 API 响应遵循统一格式：

```json
{
  "success": true,
  "data": { "...": "..." },
  "message": "操作成功",
  "errorCode": null
}
```

错误响应示例：

```json
{
  "success": false,
  "data": null,
  "message": "胶囊不存在",
  "errorCode": "CAPSULE_NOT_FOUND"
}
```
