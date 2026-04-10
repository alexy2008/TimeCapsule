# HelloTime Axum Backend

时间胶囊应用的 Rust 后端实现，基于 Axum + Tokio + SQLx 构建。

## 技术栈

- **框架**: Axum 0.8
- **语言**: Rust 1.94+
- **数据库**: SQLite + SQLx
- **安全**: jsonwebtoken (HS256)

## 实现说明

- 使用 `Router` + extractor 组织接口，保持 Axum 的显式路由风格。
- 使用 `State` 共享 SQLite 连接池与配置，而不是引入额外的容器抽象。
- 使用自定义 `FromRequestParts` 提取器完成 Bearer Token 鉴权，体现 Axum 对中间件 / extractor 的组合能力。
- 使用 `tower-http` 的 CORS 与静态文件服务，统一暴露 `/tech-logos/*` 静态资源。
- 使用 SQLx 直接执行 SQL，避免隐藏过多行为，方便与其他后端做横向对照。

## 快速开始

### 前置要求

- Rust 1.94+
- Cargo

### 运行应用

```bash
cd backends/axum
./run
```

Windows PowerShell:

```powershell
cd backends/axum
.\run.ps1
```

应用默认监听 `http://localhost:18070`。

如果前端仍通过固定入口 `http://localhost:8080` 访问后端，可在仓库根目录执行：

```bash
./scripts/switch-backend.sh axum
```

Windows PowerShell:

```powershell
.\scripts\switch-backend.ps1 axum
```

## 环境变量配置

| 变量名 | 默认值 | 描述 |
|--------|--------|------|
| `HOST` | `127.0.0.1` | 服务监听地址 |
| `PORT` | `18070` | 服务端口 |
| `DATABASE_URL` | `../../data/hellotime.db` | SQLite 数据库文件路径 |
| `ADMIN_PASSWORD` | `timecapsule-admin` | 管理员登录密码 |
| `JWT_SECRET` | `hellotime-jwt-secret-key-that-is-long-enough-for-hs256` | JWT 签名密钥 |
| `JWT_EXPIRATION_HOURS` | `2` | JWT 过期时间（小时） |

## 项目结构

```text
├── Cargo.toml
├── src/
│   ├── lib.rs              # 路由、状态、DTO、鉴权与业务实现
│   └── main.rs             # 可执行入口
├── static/
│   └── tech-logos/         # 健康检查配套静态资源
├── tests/
│   └── backend_tests.rs    # 集成测试
├── run
└── run.ps1
```

## 测试

```bash
cd backends/axum
cargo test
```

## 契约说明

- API 路径遵循 `spec/api/openapi.yaml`
- 响应统一为 `{ success, data, message, errorCode }`
- 普通访客在 `openAt` 之前拿到的 `content` 为 `null`
- 管理员分页接口始终返回完整正文
- `/api/v1/health` 返回 Axum / Rust / SQLite 技术栈信息
