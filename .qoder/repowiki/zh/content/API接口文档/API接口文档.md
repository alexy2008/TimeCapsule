# API接口文档

<cite>
**本文档引用的文件**
- [openapi.yaml](file://spec/api/openapi.yaml)
- [main.py](file://backends/fastapi/app/main.py)
- [health.py](file://backends/fastapi/app/routers/health.py)
- [capsule.py](file://backends/fastapi/app/routers/capsule.py)
- [admin.py](file://backends/fastapi/app/routers/admin.py)
- [schemas.py](file://backends/fastapi/app/schemas.py)
- [test_capsule_api.py](file://backends/fastapi/tests/test_capsule_api.py)
- [router.go](file://backends/gin/router/router.go)
- [auth.go](file://backends/gin/middleware/auth.go)
- [capsule.go](file://backends/gin/handler/capsule.go)
- [admin.go](file://backends/gin/handler/admin.go)
- [config.go](file://backends/gin/config/config.go)
- [CapsuleController.java](file://backends/spring-boot/src/main/java/com/hellotime/controller/CapsuleController.java)
- [AdminController.java](file://backends/spring-boot/src/main/java/com/hellotime/controller/AdminController.java)
- [application.yml](file://backends/spring-boot/src/main/resources/application.yml)
- [HelloTimeApplication.java](file://backends/spring-boot/src/main/java/com/hellotime/HelloTimeApplication.java)
- [api-spec.md](file://docs/api-spec.md)
</cite>

## 目录
1. [简介](#简介)
2. [项目结构](#项目结构)
3. [核心组件](#核心组件)
4. [架构概览](#架构概览)
5. [详细组件分析](#详细组件分析)
6. [依赖分析](#依赖分析)
7. [性能考虑](#性能考虑)
8. [故障排除指南](#故障排除指南)
9. [结论](#结论)
10. [附录](#附录)

## 简介
HelloTime是一个时间胶囊应用，允许用户创建未来可开启的消息胶囊，并在指定时间自动解锁。本项目提供了三种后端实现（FastAPI、Gin、Spring Boot），均遵循统一的OpenAPI 3.0规范，提供一致的RESTful API体验。

## 项目结构
项目采用多后端架构，每个后端实现都遵循相同的API规范和响应格式：

```mermaid
graph TB
subgraph "前端"
FE[前端应用]
end
subgraph "后端实现"
subgraph "FastAPI"
FAPI[FastAPI应用]
FRoutes[路由层]
FSvc[业务服务层]
end
subgraph "Gin"
GApp[Gin应用]
GRoutes[路由层]
GHandlers[处理器层]
end
subgraph "Spring Boot"
SBA[Spring Boot应用]
SBControllers[控制器层]
SBService[服务层]
end
end
subgraph "基础设施"
DB[(SQLite数据库)]
Config[配置管理]
end
FE --> FAPI
FE --> GApp
FE --> SBA
FAPI --> FRoutes
FRoutes --> FSvc
FSvc --> DB
GApp --> GRoutes
GRoutes --> GHandlers
GHandlers --> DB
SBA --> SBControllers
SBControllers --> SBService
SBService --> DB
Config --> FAPI
Config --> GApp
Config --> SBA
```

**图表来源**
- [main.py:19-34](file://backends/fastapi/app/main.py#L19-L34)
- [router.go:11-45](file://backends/gin/router/router.go#L11-L45)
- [HelloTimeApplication.java:6-11](file://backends/spring-boot/src/main/java/com/hellotime/HelloTimeApplication.java#L6-L11)

**章节来源**
- [main.py:1-89](file://backends/fastapi/app/main.py#L1-L89)
- [router.go:1-46](file://backends/gin/router/router.go#L1-L46)
- [HelloTimeApplication.java:1-12](file://backends/spring-boot/src/main/java/com/hellotime/HelloTimeApplication.java#L1-L12)

## 核心组件
本项目的核心组件包括统一响应格式、JWT认证机制、分页查询系统和错误处理策略。

### 统一响应格式
所有API响应都遵循统一的JSON结构：

```mermaid
classDiagram
class ApiResponse {
+boolean success
+T data
+string message
+string errorCode
+ok(data, message) ApiResponse
+error(message, errorCode) ApiResponse
}
class CapsuleResponse {
+string code
+string title
+string content
+string creator
+string openAt
+string createdAt
+boolean opened
}
class AdminTokenResponse {
+string token
}
class PageResponse {
+T[] content
+int totalElements
+int totalPages
+int number
+int size
}
ApiResponse --> CapsuleResponse : "包含"
ApiResponse --> AdminTokenResponse : "包含"
ApiResponse --> PageResponse : "包含"
```

**图表来源**
- [schemas.py:81-96](file://backends/fastapi/app/schemas.py#L81-L96)
- [schemas.py:54-65](file://backends/fastapi/app/schemas.py#L54-L65)
- [schemas.py:67-69](file://backends/fastapi/app/schemas.py#L67-L69)
- [schemas.py:71-79](file://backends/fastapi/app/schemas.py#L71-L79)

### JWT认证机制
系统使用JWT进行管理员身份验证，支持多种后端实现的一致行为：

```mermaid
sequenceDiagram
participant Client as 客户端
participant Admin as 管理员控制器
participant Service as 认证服务
participant Token as JWT令牌
participant Middleware as 认证中间件
Client->>Admin : POST /api/v1/admin/login
Admin->>Service : 验证密码
Service->>Token : 生成JWT令牌
Token-->>Admin : 返回令牌
Admin-->>Client : {success : true, data : {token}}
Client->>Middleware : 带令牌请求受保护资源
Middleware->>Middleware : 验证Authorization头
Middleware->>Service : 验证JWT签名
Service-->>Middleware : 验证通过
Middleware->>Admin : 放行请求
Admin-->>Client : 受保护资源数据
```

**图表来源**
- [admin.go:20-35](file://backends/gin/handler/admin.go#L20-L35)
- [auth.go:13-36](file://backends/gin/middleware/auth.go#L13-L36)
- [AdminController.java:41-48](file://backends/spring-boot/src/main/java/com/hellotime/controller/AdminController.java#L41-L48)

**章节来源**
- [schemas.py:81-96](file://backends/fastapi/app/schemas.py#L81-L96)
- [auth.go:13-36](file://backends/gin/middleware/auth.go#L13-L36)
- [config.go:32-43](file://backends/gin/config/config.go#L32-L43)

## 架构概览
系统采用分层架构设计，确保各组件职责清晰分离：

```mermaid
graph TB
subgraph "API层"
Health[健康检查]
CapsuleAPI[胶囊API]
AdminAPI[管理员API]
end
subgraph "业务逻辑层"
CapsuleService[胶囊服务]
AdminService[管理员服务]
end
subgraph "数据访问层"
Repository[数据仓库]
Database[(SQLite)]
end
subgraph "配置层"
Config[应用配置]
JWT[JWT配置]
end
Health --> CapsuleService
CapsuleAPI --> CapsuleService
AdminAPI --> AdminService
CapsuleService --> Repository
AdminService --> Repository
Repository --> Database
Config --> JWT
```

**图表来源**
- [health.py:14-24](file://backends/fastapi/app/routers/health.py#L14-L24)
- [capsule.py:17-30](file://backends/fastapi/app/routers/capsule.py#L17-L30)
- [admin.py:25-54](file://backends/fastapi/app/routers/admin.py#L25-L54)

## 详细组件分析

### 健康检查接口
提供系统健康状态监控功能，无需认证即可访问。

**接口定义**
- 方法: GET
- 路径: `/api/v1/health`
- 认证: 无需认证
- 成功响应: 200 OK
- 响应数据: 包含服务状态、时间戳和技术栈信息

**请求示例**
```json
GET /api/v1/health
```

**响应示例**
```json
{
  "success": true,
  "data": {
    "status": "UP",
    "timestamp": "2024-01-01T00:00:00Z",
    "techStack": {
      "framework": "FastAPI >=0.115",
      "language": "Python 3.12",
      "database": "SQLite"
    }
  }
}
```

**章节来源**
- [health.py:14-24](file://backends/fastapi/app/routers/health.py#L14-L24)
- [api-spec.md:18-31](file://docs/api-spec.md#L18-L31)

### 胶囊创建接口
允许用户创建新的时间胶囊，包含标题、内容、创建者和开启时间等信息。

**接口定义**
- 方法: POST
- 路径: `/api/v1/capsules`
- 认证: 无需认证
- 成功响应: 201 Created
- 请求体: CreateCapsuleRequest
- 响应数据: CapsuleResponse

**请求参数**
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| title | string | 是 | 标题，最多100字符 |
| content | string | 是 | 内容，不能为空 |
| creator | string | 是 | 创建者昵称，最多30字符 |
| openAt | string | 是 | 开启时间（ISO 8601格式），必须为未来时间 |

**请求示例**
```json
POST /api/v1/capsules
{
  "title": "给未来的信",
  "content": "希望你一切都好...",
  "creator": "小明",
  "openAt": "2025-06-01T00:00:00Z"
}
```

**响应示例**
```json
{
  "success": true,
  "data": {
    "code": "Ab3xK9mZ",
    "title": "给未来的信",
    "creator": "小明",
    "openAt": "2025-06-01T00:00:00Z",
    "createdAt": "2024-01-01T12:00:00Z"
  },
  "message": "胶囊创建成功"
}
```

**错误处理**
- 400 Bad Request: 参数校验失败
- 500 Internal Server Error: 服务器内部错误

**章节来源**
- [capsule.py:17-24](file://backends/fastapi/app/routers/capsule.py#L17-L24)
- [schemas.py:26-45](file://backends/fastapi/app/schemas.py#L26-L45)
- [api-spec.md:35-69](file://docs/api-spec.md#L35-L69)

### 胶囊查询接口
根据8位胶囊码查询胶囊详情，未到开启时间时content字段为null。

**接口定义**
- 方法: GET
- 路径: `/api/v1/capsules/{code}`
- 路径参数: code (8位字母数字组合)
- 认证: 无需认证
- 成功响应: 200 OK

**查询流程**
```mermaid
flowchart TD
Start([开始查询]) --> ValidateCode["验证胶囊码格式"]
ValidateCode --> CodeValid{"格式有效?"}
CodeValid --> |否| Return404["返回404错误"]
CodeValid --> |是| CheckCapsule["检查胶囊是否存在"]
CheckCapsule --> Exists{"存在?"}
Exists --> |否| Return404
Exists --> |是| CheckTime["检查是否到达开启时间"]
CheckTime --> IsOpen{"已到时间?"}
IsOpen --> |是| ReturnFull["返回完整胶囊信息"]
IsOpen --> |否| ReturnPartial["返回部分胶囊信息<br/>content为null"]
Return404 --> End([结束])
ReturnFull --> End
ReturnPartial --> End
```

**图表来源**
- [capsule.py:27-30](file://backends/fastapi/app/routers/capsule.py#L27-L30)

**响应示例**
未到开启时间：
```json
{
  "success": true,
  "data": {
    "code": "Ab3xK9mZ",
    "title": "给未来的信",
    "creator": "小明",
    "openAt": "2025-06-01T00:00:00Z",
    "createdAt": "2024-01-01T12:00:00Z",
    "opened": false
  }
}
```

已到开启时间：
```json
{
  "success": true,
  "data": {
    "code": "Ab3xK9mZ",
    "title": "给未来的信",
    "content": "希望你一切都好...",
    "creator": "小明",
    "openAt": "2025-06-01T00:00:00Z",
    "createdAt": "2024-01-01T12:00:00Z",
    "opened": true
  }
}
```

**章节来源**
- [capsule.py:27-30](file://backends/fastapi/app/routers/capsule.py#L27-L30)
- [api-spec.md:73-109](file://docs/api-spec.md#L73-L109)

### 管理员登录接口
管理员使用密码进行身份验证，成功后返回JWT访问令牌。

**接口定义**
- 方法: POST
- 路径: `/api/v1/admin/login`
- 认证: 无需认证
- 成功响应: 200 OK

**请求参数**
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| password | string | 是 | 管理员密码 |

**请求示例**
```json
POST /api/v1/admin/login
{
  "password": "your-admin-password"
}
```

**响应示例**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiJ9..."
  },
  "message": "登录成功"
}
```

**章节来源**
- [admin.py:25-30](file://backends/fastapi/app/routers/admin.py#L25-L30)
- [admin.go:20-35](file://backends/gin/handler/admin.go#L20-L35)
- [AdminController.java:41-48](file://backends/spring-boot/src/main/java/com/hellotime/controller/AdminController.java#L41-L48)

### 管理员分页查询接口
管理员可分页查询所有胶囊，支持页码和页面大小参数控制。

**接口定义**
- 方法: GET
- 路径: `/api/v1/admin/capsules`
- 认证: 需要JWT令牌
- 请求头: `Authorization: Bearer {token}`
- 成功响应: 200 OK

**查询参数**
| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| page | integer | 0 | 页码，从0开始 |
| size | integer | 20 | 页面大小，最大100 |

**请求示例**
```json
GET /api/v1/admin/capsules?page=0&size=20
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
```

**响应示例**
```json
{
  "success": true,
  "data": {
    "content": [
      {
        "code": "Ab3xK9mZ",
        "title": "给未来的信",
        "content": "希望你一切都好...",
        "creator": "小明",
        "openAt": "2025-06-01T00:00:00Z",
        "createdAt": "2024-01-01T12:00:00Z",
        "opened": false
      }
    ],
    "totalElements": 1,
    "totalPages": 1,
    "number": 0,
    "size": 20
  }
}
```

**章节来源**
- [admin.py:33-44](file://backends/fastapi/app/routers/admin.py#L33-L44)
- [admin.go:37-59](file://backends/gin/handler/admin.go#L37-L59)
- [AdminController.java:59-64](file://backends/spring-boot/src/main/java/com/hellotime/controller/AdminController.java#L59-L64)

### 管理员删除接口
管理员可删除指定的胶囊，删除后无法恢复。

**接口定义**
- 方法: DELETE
- 路径: `/api/v1/admin/capsules/{code}`
- 认证: 需要JWT令牌
- 请求头: `Authorization: Bearer {token}`
- 成功响应: 200 OK

**请求示例**
```json
DELETE /api/v1/admin/capsules/Ab3xK9mZ
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
```

**响应示例**
```json
{
  "success": true,
  "data": null,
  "message": "删除成功"
}
```

**章节来源**
- [admin.py:47-54](file://backends/fastapi/app/routers/admin.py#L47-L54)
- [admin.go:61-76](file://backends/gin/handler/admin.go#L61-L76)
- [AdminController.java:74-78](file://backends/spring-boot/src/main/java/com/hellotime/controller/AdminController.java#L74-L78)

## 依赖分析
系统各组件间的依赖关系如下：

```mermaid
graph TB
subgraph "FastAPI实现"
FMain[main.py]
FRoutes[routers/*]
FSchemas[schemas.py]
FServices[services/*]
end
subgraph "Gin实现"
GMain[main.go]
GRoutes[router/router.go]
GHandlers[handler/*]
GMiddleware[middleware/*]
end
subgraph "Spring Boot实现"
SMain[HelloTimeApplication.java]
SControllers[controller/*]
SService[service/*]
SConfig[resources/application.yml]
end
subgraph "共享组件"
Config[config.go]
DB[(SQLite数据库)]
JWT[JWT配置]
end
FMain --> FRoutes
FRoutes --> FSchemas
FRoutes --> FServices
GMain --> GRoutes
GRoutes --> GHandlers
GHandlers --> GMiddleware
SMain --> SControllers
SControllers --> SService
SService --> SConfig
FRoutes --> DB
GHandlers --> DB
SService --> DB
Config --> JWT
```

**图表来源**
- [main.py:10-14](file://backends/fastapi/app/main.py#L10-L14)
- [router.go:12-17](file://backends/gin/router/router.go#L12-L17)
- [HelloTimeApplication.java:6-11](file://backends/spring-boot/src/main/java/com/hellotime/HelloTimeApplication.java#L6-L11)

**章节来源**
- [main.py:1-89](file://backends/fastapi/app/main.py#L1-L89)
- [router.go:1-46](file://backends/gin/router/router.go#L1-L46)
- [HelloTimeApplication.java:1-12](file://backends/spring-boot/src/main/java/com/hellotime/HelloTimeApplication.java#L1-L12)

## 性能考虑
系统在设计时充分考虑了性能优化：

### 数据库优化
- 使用SQLite作为轻量级数据库，适合小型到中型应用
- 采用连接池管理数据库连接
- 合理的索引设计提升查询性能

### 缓存策略
- 未开启的胶囊内容不缓存，避免敏感信息泄露
- 已开启的胶囊内容可根据需要进行缓存

### 并发处理
- Spring Boot使用虚拟线程提升并发性能
- Gin框架的高性能HTTP处理能力
- FastAPI的异步处理支持

## 故障排除指南

### 常见错误及解决方案

**认证相关错误**
- 401 Unauthorized: 检查Authorization头格式是否正确，确认JWT令牌未过期
- 403 Forbidden: 确认管理员权限和令牌有效性

**参数验证错误**
- 400 Bad Request: 检查请求参数格式，确保必填字段完整
- 参数长度限制：标题最多100字符，创建者昵称最多30字符

**数据访问错误**
- 404 Not Found: 确认胶囊码格式正确且存在
- 500 Internal Server Error: 检查数据库连接和服务器状态

### 调试建议
1. 启用详细的日志记录
2. 使用Postman或curl进行API测试
3. 检查环境变量配置
4. 验证数据库文件权限

**章节来源**
- [main.py:37-89](file://backends/fastapi/app/main.py#L37-L89)
- [auth.go:13-36](file://backends/gin/middleware/auth.go#L13-L36)
- [api-spec.md:186-195](file://docs/api-spec.md#L186-L195)

## 结论
HelloTime项目提供了完整的时间胶囊API解决方案，具有以下特点：

1. **一致性**: 三种后端实现遵循相同的API规范和响应格式
2. **安全性**: 完整的JWT认证机制保护管理员操作
3. **可靠性**: 统一的错误处理和响应格式
4. **可扩展性**: 清晰的分层架构便于功能扩展

该API设计满足了时间胶囊应用的核心需求，为用户提供了安全、可靠的服务体验。

## 附录

### API版本管理
- 当前版本: 1.0.0
- 版本路径: `/api/v1`
- 向后兼容性: 保持现有API不变，新增功能通过新版本实现

### 安全最佳实践
- JWT令牌过期时间: 2小时
- 管理员密码: 通过环境变量配置
- HTTPS部署: 生产环境建议启用TLS
- 输入验证: 严格的参数校验和过滤

### 部署配置
- 默认端口: 8080
- 数据库: SQLite文件存储
- 管理员密码: 默认值可通过环境变量修改

**章节来源**
- [config.go:32-43](file://backends/gin/config/config.go#L32-L43)
- [application.yml:17-26](file://backends/spring-boot/src/main/resources/application.yml#L17-L26)
- [openapi.yaml:1-6](file://spec/api/openapi.yaml#L1-L6)