# HelloTime Drogon Backend

时间胶囊应用的 C++ 后端实现，基于 Drogon + SQLite + OpenSSL 构建。

## 技术栈

- **框架**: Drogon 1.9
- **语言**: C++20
- **数据库**: SQLite3
- **安全**: OpenSSL HMAC SHA-256

## 实现说明

- 使用 Drogon 原生 `registerHandler` 组织路由，保持轻量显式的 C++ Web 风格。
- 使用手写 SQLite 语句与极薄封装完成持久化，避免引入额外 ORM，方便与其他后端并排对照。
- 使用手写 JWT 生成与校验，体现 C++ 服务端对底层控制的特点。
- 使用全局前置处理统一补齐 CORS 与 `OPTIONS` 响应。
- 使用本地静态资源目录暴露 `/tech-logos/*`，与前端技术栈展示约定保持一致。

## 快速开始

### 前置要求

- CMake 3.24+
- Ninja
- C++20 编译器
- OpenSSL
- SQLite3

首次配置时会通过 `FetchContent` 自动拉取 Drogon 源码。

### 运行应用

```bash
cd backends/drogon
./run
```

Windows PowerShell:

```powershell
cd backends/drogon
.\run.ps1
```

应用默认监听 `http://localhost:18080`。

如果前端仍通过固定入口 `http://localhost:8080` 访问后端，可在仓库根目录执行：

```bash
./scripts/switch-backend.sh drogon
```

Windows PowerShell:

```powershell
.\scripts\switch-backend.ps1 drogon
```

## 环境变量配置

| 变量名 | 默认值 | 描述 |
|--------|--------|------|
| `HOST` | `127.0.0.1` | 服务监听地址 |
| `PORT` | `18080` | 服务端口 |
| `DATABASE_URL` | `../../data/hellotime.db` | SQLite 数据库文件路径 |
| `ADMIN_PASSWORD` | `timecapsule-admin` | 管理员登录密码 |
| `JWT_SECRET` | `hellotime-jwt-secret-key-that-is-long-enough-for-hs256` | JWT 签名密钥 |
| `JWT_EXPIRATION_HOURS` | `2` | JWT 过期时间（小时） |

## 项目结构

```text
├── CMakeLists.txt
├── src/
│   ├── server.h            # 配置、状态与公共声明
│   ├── server.cc           # 路由、JWT、SQLite 与静态资源处理
│   └── main.cc             # 可执行入口
├── static/
│   └── tech-logos/         # 健康检查配套静态资源
├── tests/
│   └── backend_tests.cc    # 集成测试
├── run
└── run.ps1
```

## 测试

```bash
cd backends/drogon
cmake -S . -B build -G Ninja
cmake --build build --target hellotime-drogon-tests
ctest --test-dir build --output-on-failure
```

## 契约说明

- API 路径遵循 `spec/api/openapi.yaml`
- 响应统一为 `{ success, data, message, errorCode }`
- 普通访客在 `openAt` 之前拿到的 `content` 为 `null`
- 管理员分页接口始终返回完整正文
- `/api/v1/health` 返回 Drogon / C++ / SQLite 技术栈信息
