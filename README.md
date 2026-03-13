# 时间胶囊 (HelloTime)

一个类似 RealWorld 的技术展示应用。通过统一的 API 规范和可复用的前端样式，展示不同前后端技术栈的组合能力。

## 可用技术栈

### 前端
- **Vue 3 + TypeScript** (`frontends/vue3-ts/`) - Vite 构建 (端口 5173)
- **React + TypeScript** (`frontends/react-ts/`) - Vite 构建 (端口 5174)
- **Angular 18 + TypeScript** (`frontends/angular-ts/`) - Angular CLI 构建 (端口 5175)

### 后端
- **Spring Boot 3** (`backends/spring-boot/`) - Java 17+，SQLite，Maven
- **FastAPI** (`backends/fastapi/`) - Python 3.10+，SQLite，pip

所有实现遵循统一的 API 规范 (`spec/api/openapi.yaml`) 和样式定义 (`spec/styles/`)，确保功能完全相同。

## 项目结构

```
HelloTimeByClaude/
├── docs/           # 项目文档
├── spec/           # 共享规范
│   ├── api/        # OpenAPI 规范 (openapi.yaml)
│   └── styles/     # 共享样式和设计令牌 (CSS)
├── frontends/      # 前端实现（可独立或与任意后端组合）
│   ├── vue3-ts/    # Vue 3 + TypeScript (Vite)
│   ├── react-ts/   # React + TypeScript (Vite)
│   └── angular-ts/ # Angular 18 + TypeScript (Angular CLI)
├── backends/       # 后端实现（可独立或与任意前端组合）
│   ├── spring-boot/
│   └── fastapi/
└── scripts/        # 开发/构建脚本
```

## 快速开始

### 方案 1：Spring Boot + Vue 3

**后端启动**

```bash
cd backends/spring-boot
./mvnw spring-boot:run
```

服务启动在 http://localhost:8080

**前端启动**

```bash
cd frontends/vue3-ts
npm install
npm run dev
```

开发服务器启动在 http://localhost:5173

### 方案 2：FastAPI + React

**后端启动**

```bash
cd backends/fastapi
pip install -r requirements.txt
uvicorn app.main:app --port 8080
```

服务启动在 http://localhost:8080

**前端启动**

```bash
cd frontends/react-ts
npm install
npm run dev
```

开发服务器启动在 http://localhost:5173

### 方案 3：Spring Boot + React（或其他组合）

任何前端实现都可与任何后端实现组合使用，只要都遵循共享的 API 规范即可。

### 方案 4：Spring Boot + Angular

**后端启动**

```bash
cd backends/spring-boot
./mvnw spring-boot:run
```

服务启动在 http://localhost:8080

**前端启动**

```bash
cd frontends/angular-ts
npm install
npm run dev
```

开发服务器启动在 http://localhost:5175

### 统一启动所有服务

```bash
# 同时启动后端 + 全部前端 (Vue 5173, Angular 5175, React 5174)
./scripts/dev.sh
```

## 测试

### 运行所有测试

```bash
# 一键运行所有后端和前端的全部测试
./scripts/test.sh
```

### 单独运行测试

```bash
# 后端测试（Spring Boot）
cd backends/spring-boot
./mvnw test

# 后端测试（FastAPI）
cd backends/fastapi
pytest

# 前端测试（Vue 3）
cd frontends/vue3-ts
npm run test

# 前端测试（Angular）
cd frontends/angular-ts
npm run test

# 前端测试（React）
cd frontends/react-ts
npm run test
```

## 功能

时间胶囊应用包含以下核心功能：

- **创建胶囊** - 用户可创建带有标题、内容、创建者信息的时间胶囊，指定未来开启时间
- **查询胶囊** - 使用 8 位字母数字码查询胶囊，未开启时隐藏内容
- **管理员登录** - 简单的密码认证，颁发 JWT Token（2 小时有效期）
- **胶囊管理** - 认证用户可分页列表所有胶囊、删除胶囊
- **响应式设计** - 支持 PC 和移动端
- **深色主题** - 主题切换功能

## 技术细节

### 数据库

所有实现使用 SQLite，单表 `capsules` 结构：

- `id` - 主键 (自增)
- `code` - 8 字符唯一标识符 (base62)
- `title` - 胶囊标题 (≤100 字符)
- `content` - 胶囊内容
- `creator` - 创建者 (≤30 字符)
- `open_at` - 开启时间 (UTC 时间戳)
- `created_at` - 创建时间 (UTC 时间戳)

### API 端点

所有实现提供统一的 REST API：

| 方法 | 端点 | 说明 |
|------|------|------|
| GET | `/api/v1/health` | 健康检查 |
| POST | `/api/v1/capsules` | 创建胶囊 |
| GET | `/api/v1/capsules/{code}` | 查询胶囊 |
| POST | `/api/v1/admin/login` | 管理员登录 |
| GET | `/api/v1/admin/capsules` | 列表胶囊（需认证） |
| DELETE | `/api/v1/admin/capsules/{code}` | 删除胶囊（需认证） |

详细 API 规范见 `spec/api/openapi.yaml`

### 认证

JWT Bearer Token 认证，请求头格式：

```
Authorization: Bearer <token>
```

Token 由管理员登录端点生成，有效期 2 小时，使用 HS256 算法签名。

### 错误响应

所有错误响应遵循统一格式：

```json
{
  "success": false,
  "message": "错误描述",
  "errorCode": "ERROR_CODE"
}
```

常见错误码：
- `VALIDATION_ERROR` - 请求参数验证失败（400）
- `CAPSULE_NOT_FOUND` - 胶囊不存在（404）
- `UNAUTHORIZED` - 认证失败（401）
- `BAD_REQUEST` - 业务逻辑错误（400）

## 环境变量

### Spring Boot
- `ADMIN_PASSWORD` - 管理员密码（默认：`timecapsule-admin`）
- `JWT_SECRET` - JWT 签名密钥（默认：`hellotime-jwt-secret-key-that-is-long-enough-for-hs256`）

### FastAPI
- `DATABASE_URL` - 数据库连接字符串（默认：`sqlite:///hellotime.db`）
- `ADMIN_PASSWORD` - 管理员密码（默认：`timecapsule-admin`）
- `JWT_SECRET` - JWT 签名密钥（默认：`hellotime-jwt-secret-key-that-is-long-enough-for-hs256`）
- `JWT_EXPIRATION_HOURS` - Token 有效期小时数（默认：`2`）

## 开发指南

### 添加新的前端实现

1. 在 `frontends/` 目录下创建新项目
2. 遵循 `spec/api/openapi.yaml` 实现 API 调用
3. 使用 `spec/styles/` 中的样式和设计令牌
4. 在主样式文件中导入共享样式文件
5. 实现相同的路由：`/`, `/create`, `/open/:code`, `/about`, `/admin`

参考实现：
- **Vue 3** - Vite + Vue Router + Composables (`ref`, `computed`, `watchEffect`)
- **React** - Vite + React Router + Hooks (`useState`, `useCallback`, `useSyncExternalStore`)
- **Angular** - Angular CLI + Standalone Components + Signals (`signal`, `computed`, `effect`)

### 添加新的后端实现

1. 在 `backends/` 目录下创建新项目
2. 遵循 `spec/api/openapi.yaml` 实现所有端点
3. 使用相同的 SQLite 数据库结构
4. 遵循统一的 API 响应格式

### 提示

- 前后端完全解耦，可独立开发和测试
- CORS 已配置允许 localhost:* 跨域请求
- 数据库文件默认在项目根目录下生成
- 所有时间戳使用 UTC 时区
- 每个前端实现包含相同的功能，可用于学习不同框架的最佳实践

## 许可证

MIT
