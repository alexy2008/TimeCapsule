# HelloTime Gin Backend

时间胶囊应用的后端服务，基于 Gin 和 Go 构建。

## 技术栈

- **框架**: Gin 1.10
- **语言**: Go 1.24+
- **数据库**: SQLite + GORM
- **安全**: golang-jwt (HS256)

## 功能特性

- RESTful API
- GORM 自动迁移
- JWT 管理员认证
- 全局异常处理和统一响应格式
- 完整单元测试

## 快速开始

### 前置要求

- Go 1.24+

### 安装依赖

```bash
go mod tidy
```

### 运行应用

```bash
# 开发模式
go run main.go

# 或构建后运行
go build -o hellotime-gin && ./hellotime-gin
```

应用将在 `http://localhost:8080` 启动。

### 环境变量配置

| 变量名 | 默认值 | 描述 |
|--------|--------|------|
| `DATABASE_URL` | `../../data/hellotime.db` | SQLite 数据库文件路径 |
| `ADMIN_PASSWORD` | `timecapsule-admin` | 管理员登录密码 |
| `JWT_SECRET` | `hellotime-jwt-secret-key-that-is-long-enough-for-hs256` | JWT 签名密钥 |
| `JWT_EXPIRATION_HOURS` | `2` | JWT 过期时间（小时） |
| `PORT` | `8080` | 服务端口 |

示例：
```bash
export ADMIN_PASSWORD=my-secure-password
export JWT_SECRET=my-jwt-secret
go run main.go
```

## API 端点

### 胶囊相关

| 方法 | 路径 | 描述 |
|------|------|------|
| POST | `/api/v1/capsules` | 创建时间胶囊 |
| GET | `/api/v1/capsules/:code` | 获取胶囊详情 |

### 管理员相关

| 方法 | 路径 | 描述 |
|------|------|------|
| POST | `/api/v1/admin/login` | 管理员登录 |
| GET | `/api/v1/admin/capsules` | 获取所有胶囊（需认证） |
| DELETE | `/api/v1/admin/capsules/:code` | 删除胶囊（需认证） |

### 健康检查

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | `/api/v1/health` | 健康检查端点（返回技术栈信息） |

## 项目结构

```
├── main.go               # 应用入口
├── config/
│   └── config.go         # 配置管理
├── database/
│   └── database.go       # 数据库连接
├── model/
│   └── capsule.go        # GORM 模型
├── dto/
│   └── dto.go            # 请求/响应 DTO
├── service/
│   ├── capsule_service.go # 胶囊业务逻辑
│   └── admin_service.go   # 管理员认证
├── handler/
│   ├── health.go         # 健康检查
│   ├── capsule.go        # 胶囊处理器
│   └── admin.go          # 管理员处理器
├── middleware/
│   ├── cors.go           # CORS 中间件
│   └── auth.go           # JWT 认证中间件
├── router/
│   └── router.go         # 路由注册
└── tests/
    ├── capsule_test.go   # 胶囊 API 测试
    └── admin_test.go     # 管理员 API 测试
```

## 测试

```bash
# 运行所有测试
go test ./tests/ -v

# 运行特定测试
go test ./tests/ -run TestCreateCapsule -v
```

## cURL 示例

```bash
# 创建胶囊
curl -X POST http://localhost:8080/api/v1/capsules \
  -H "Content-Type: application/json" \
  -d '{
    "title": "给未来的自己",
    "content": "希望你一切都好",
    "creator": "张三",
    "openAt": "2027-01-01T00:00:00Z"
  }'

# 查询胶囊
curl http://localhost:8080/api/v1/capsules/{code}

# 管理员登录
curl -X POST http://localhost:8080/api/v1/admin/login \
  -H "Content-Type: application/json" \
  -d '{"password": "timecapsule-admin"}'
```

## 响应格式

所有 API 响应遵循统一格式：

```json
{
  "success": true,
  "data": { ... },
  "message": "操作成功"
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

---

> 📊 **多端实现对比**：查看 [FastAPI vs Gin vs Spring Boot 对比报告](../../docs/backend-comparison.md) 以获取更多详细分析。
