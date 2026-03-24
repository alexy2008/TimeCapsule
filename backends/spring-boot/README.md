# HelloTime Spring Boot Backend

时间胶囊应用的后端服务，基于 Spring Boot 3 和 Java 21 构建。

## 技术栈

- **框架**: Spring Boot 3.2.5
- **语言**: Java 21
- **数据库**: SQLite + Spring Data JPA
- **安全**: JWT 认证
- **构建工具**: Maven

## 功能特性

- RESTful API 遵循 OpenAPI 规范
- 时间胶囊 CRUD 操作
- 基于 JWT 的管理员认证
- 内容隐藏机制（未到解锁时间的胶囊内容隐藏）
- 全局异常处理和统一响应格式

## 快速开始

### 前置要求

- Java 21+
- Maven 3.6+

### 运行应用

```bash
# 使用 Maven Wrapper 运行
./mvnw spring-boot:run

# 或使用系统 Maven
mvn spring-boot:run
```

应用默认将在 `http://localhost:18000` 启动。

如需保持前端仍访问 `http://localhost:8080`，可在仓库根目录执行：

```bash
./scripts/switch-backend.sh spring-boot
```

### 环境变量配置

| 变量名 | 默认值 | 描述 |
|--------|--------|------|
| `SERVER_PORT` | `18000` | 服务端口 |
| `ADMIN_PASSWORD` | `timecapsule-admin` | 管理员登录密码 |
| `JWT_SECRET` | `hellotime-jwt-secret-key-that-is-long-enough-for-hs256` | JWT 签名密钥 |

示例：
```bash
export ADMIN_PASSWORD=my-secure-password
export JWT_SECRET=my-jwt-secret
export SERVER_PORT=18000
./mvnw spring-boot:run
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
src/main/java/com/hellotime/
├── controller/     # REST 控制器
├── service/        # 业务逻辑层
├── repository/     # 数据访问层
├── entity/         # JPA 实体
├── dto/            # 数据传输对象
└── security/       # 安全相关配置
```

## 测试

```bash
# 运行所有测试
./mvnw test

# 运行并跳过测试
./mvnw spring-boot:run -DskipTests
```

## 构建

```bash
# 构建可执行 JAR
./mvnw clean package

# 运行构建的 JAR
java -jar target/hellotime-backend-1.0.0.jar
```

## 数据库

应用使用 SQLite 数据库，默认数据库文件为共享路径 `../../data/hellotime.db`。

### Capsule 表结构

| 字段 | 类型 | 描述 |
|------|------|------|
| code | VARCHAR(8) | 胶囊唯一标识（Base62） |
| title | VARCHAR(255) | 胶囊标题 |
| content | TEXT | 胶囊内容 |
| creator | VARCHAR(100) | 创建者 |
| open_at | TEXT | 解锁时间（UTC ISO 8601） |
| created_at | TEXT | 创建时间（UTC ISO 8601） |

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
