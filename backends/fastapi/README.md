# HelloTime FastAPI Backend

时间胶囊应用的后端服务，基于 FastAPI 和 Python 构建。

## 技术栈

- **框架**: FastAPI >= 0.115
- **语言**: Python 3.12+
- **数据库**: SQLite + SQLAlchemy 2.0
- **安全**: PyJWT 认证
- **服务器**: Uvicorn

## 功能特性

- 异步 RESTful API
- 自动生成的 OpenAPI 文档
- 基于 Pydantic 的数据验证
- JWT 管理员认证
- 全局异常处理和统一响应格式

## 快速开始

### 前置要求

- Python 3.12+
- pip 或 uv

### 安装依赖

```bash
# 创建虚拟环境
python -m venv .venv
source .venv/bin/activate  # Linux/macOS
# 或
.venv\Scripts\activate     # Windows

# 安装依赖
pip install -r requirements.txt
```

### 运行应用

```bash
# 开发模式（自动重载）
uvicorn app.main:app --reload --host 0.0.0.0 --port 18010

# 生产模式
uvicorn app.main:app --host 0.0.0.0 --port 18010 --workers 4
```

Windows PowerShell:

```powershell
cd backends/fastapi
.\run.ps1
```

应用默认将在 `http://localhost:18010` 启动。

如需保持前端仍访问 `http://localhost:8080`，可在仓库根目录执行：

```bash
./scripts/switch-backend.sh fastapi
```

Windows PowerShell:

```powershell
.\scripts\switch-backend.ps1 fastapi
```

### 访问 API 文档

FastAPI 自动生成 OpenAPI 文档：
- Swagger UI: `http://localhost:18010/docs`
- ReDoc: `http://localhost:18010/redoc`
- OpenAPI JSON: `http://localhost:18010/openapi.json`

### 环境变量配置

| 变量名 | 默认值 | 描述 |
|--------|--------|------|
| `DATABASE_URL` | `sqlite:///../../data/hellotime.db` | 数据库连接 URL |
| `ADMIN_PASSWORD` | `timecapsule-admin` | 管理员登录密码 |
| `JWT_SECRET` | `hellotime-jwt-secret-key-that-is-long-enough-for-hs256` | JWT 签名密钥 |
| `JWT_EXPIRATION_HOURS` | `2` | JWT 过期时间（小时） |
| `PORT` | `18010` | 服务端口 |

示例：
```bash
export ADMIN_PASSWORD=my-secure-password
export JWT_SECRET=my-jwt-secret
export PORT=18010
uvicorn app.main:app --reload --host 0.0.0.0 --port "$PORT"
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

```
app/
├── main.py           # 应用入口
├── config.py         # 配置管理
├── database.py       # 数据库连接
├── models.py         # SQLAlchemy 模型
├── schemas.py        # Pydantic 模式
├── dependencies.py   # 依赖注入
├── routers/          # 路由模块
│   ├── health.py
│   ├── capsule.py
│   └── admin.py
└── services/         # 业务逻辑层
    ├── capsule_service.py
    └── admin_service.py
```

## 测试

```bash
# 运行所有测试
pytest

# 运行测试并显示覆盖率
pytest --cov=app

# 运行特定测试文件
pytest tests/test_capsule_api.py
```

## cURL 示例

```bash
# 创建胶囊
curl -X POST http://localhost:18010/api/v1/capsules \
  -H "Content-Type: application/json" \
  -d '{
    "title": "给未来的自己",
    "content": "希望你一切都好",
    "creator": "张三",
    "openAt": "2027-01-01T00:00:00Z"
  }'

# 查询胶囊
curl http://localhost:18010/api/v1/capsules/{code}

# 管理员登录
curl -X POST http://localhost:18010/api/v1/admin/login \
  -H "Content-Type: application/json" \
  -d '{"password": "timecapsule-admin"}'
```

## 响应格式

所有 API 响应遵循统一格式：

```json
{
  "success": true,
  "data": { ... },
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
