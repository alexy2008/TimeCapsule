# HelloTime Vapor Backend

时间胶囊应用的后端服务，基于 Vapor 和 Swift 构建。

## 技术栈

- **框架**: Vapor 4
- **语言**: Swift 6.2+
- **数据库**: SQLite + Fluent
- **安全**: JWTKit (HS256)

## 实现说明

- 使用 Vapor 的 `RouteCollection` 组织路由，而不是把所有端点平铺在入口文件。
- 使用 Fluent 模型和 Migration 管理 SQLite 结构，体现 Vapor 的类型安全持久化体验。
- 使用 `JWTAuthenticator` + `guardMiddleware()` 保护管理接口，体现 Vapor 原生认证链路。
- 使用统一错误中间件，将 Vapor/Validation/JWT 异常映射到仓库统一响应格式。

## 快速开始

### 前置要求

- Swift 6.2+

### 运行应用

```bash
cd backends/vapor
./run
```

Windows PowerShell:

```powershell
cd backends/vapor
.\run.ps1
```

应用默认将在 `http://localhost:18060` 启动。

如需保持前端仍访问 `http://localhost:8080`，可在仓库根目录执行：

```bash
./scripts/switch-backend.sh vapor
```

Windows PowerShell:

```powershell
.\scripts\switch-backend.ps1 vapor
```

## 环境变量配置

| 变量名 | 默认值 | 描述 |
|--------|--------|------|
| `HOST` | `127.0.0.1` | 服务监听地址 |
| `PORT` | `18060` | 服务端口 |
| `DATABASE_URL` | `../../../data/hellotime.db` | SQLite 数据库文件路径 |
| `ADMIN_PASSWORD` | `timecapsule-admin` | 管理员登录密码 |
| `JWT_SECRET` | `hellotime-jwt-secret-key-that-is-long-enough-for-hs256` | JWT 签名密钥 |
| `JWT_EXPIRATION_HOURS` | `2` | JWT 过期时间（小时） |

## 项目结构

```text
├── server/
│   ├── Package.swift
│   ├── Public/
│   │   └── tech-logos/      # 健康检查配套静态资源
│   ├── Sources/
│   │   ├── App/
│   │   │   ├── Controllers/ # RouteCollection 控制器
│   │   │   ├── DTOs/        # 请求 / 响应对象
│   │   │   ├── Extensions/  # 日期格式等共享工具
│   │   │   ├── Middleware/  # 统一错误映射
│   │   │   ├── Migrations/  # Fluent 迁移
│   │   │   ├── Models/      # Fluent 模型
│   │   │   ├── Services/    # 业务规则与认证
│   │   │   ├── configure.swift
│   │   │   └── routes.swift
│   │   └── Run/
│   │       └── main.swift   # 可执行入口
│   └── Tests/
│       └── AppTests/        # 集成测试
├── run
└── run.ps1
```

## 测试

```bash
cd backends/vapor/server
swift test
```

## 契约说明

- API 路径遵循 `spec/api/openapi.yaml`
- 响应统一为 `{ success, data, message, errorCode }`
- 普通访客在 `openAt` 之前拿到的 `content` 为 `null`
- 管理员分页接口始终返回完整正文
