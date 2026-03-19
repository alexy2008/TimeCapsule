# API认证机制

<cite>
**本文档引用的文件**
- [backends/fastapi/app/main.py](file://backends/fastapi/app/main.py)
- [backends/fastapi/app/routers/admin.py](file://backends/fastapi/app/routers/admin.py)
- [backends/fastapi/app/dependencies.py](file://backends/fastapi/app/dependencies.py)
- [backends/fastapi/app/services/admin_service.py](file://backends/fastapi/app/services/admin_service.py)
- [backends/fastapi/app/config.py](file://backends/fastapi/app/config.py)
- [backends/gin/middleware/auth.go](file://backends/gin/middleware/auth.go)
- [backends/gin/handler/admin.go](file://backends/gin/handler/admin.go)
- [backends/gin/service/admin_service.go](file://backends/gin/service/admin_service.go)
- [backends/gin/config/config.go](file://backends/gin/config/config.go)
- [backends/spring-boot/src/main/java/com/hellotime/config/AdminAuthInterceptor.java](file://backends/spring-boot/src/main/java/com/hellotime/config/AdminAuthInterceptor.java)
- [backends/spring-boot/src/main/java/com/hellotime/controller/AdminController.java](file://backends/spring-boot/src/main/java/com/hellotime/controller/AdminController.java)
- [backends/spring-boot/src/main/java/com/hellotime/service/AdminService.java](file://backends/spring-boot/src/main/java/com/hellotime/service/AdminService.java)
- [backends/spring-boot/src/main/resources/application.yml](file://backends/spring-boot/src/main/resources/application.yml)
- [frontends/angular-ts/src/app/services/admin.service.ts](file://frontends/angular-ts/src/app/services/admin.service.ts)
- [frontends/react-ts/src/hooks/useAdmin.ts](file://frontends/react-ts/src/hooks/useAdmin.ts)
- [frontends/vue3-ts/src/composables/useAdmin.ts](file://frontends/vue3-ts/src/composables/useAdmin.ts)
</cite>

## 目录
1. [简介](#简介)
2. [项目结构](#项目结构)
3. [核心组件](#核心组件)
4. [架构总览](#架构总览)
5. [详细组件分析](#详细组件分析)
6. [依赖分析](#依赖分析)
7. [性能考虑](#性能考虑)
8. [故障排查指南](#故障排查指南)
9. [结论](#结论)
10. [附录](#附录)

## 简介
本文件系统性阐述 HelloTime 项目的 API 认证机制，重点围绕 JWT Bearer Token 的实现与使用。内容涵盖：
- 管理员登录获取 Token 的完整流程
- 在请求头中携带 Authorization: Bearer {token} 的规范
- 后端三套实现（FastAPI、Gin、Spring Boot）的认证中间件/拦截器配置
- Token 过期时间与刷新机制说明
- 完整的认证请求/响应示例（成功登录、Token 无效、Token 过期）
- 安全最佳实践（HTTPS、Token 存储、防重放等）
- 不同前端框架（Angular、React、Vue3）中的认证状态处理

## 项目结构
HelloTime 采用多后端并行实现，统一采用 JWT Bearer Token 作为管理员认证方案；前端提供三套框架适配。

```mermaid
graph TB
subgraph "前端"
ANG["Angular 管理员服务<br/>sessionStorage 存储 Token"]
REACT["React 自定义 Hook<br/>useAdmin 管理 Token"]
VUE["Vue3 组合式函数<br/>useAdmin 管理 Token"]
end
subgraph "后端实现"
subgraph "FastAPI"
FAPI_MAIN["应用入口<br/>异常处理"]
FAPI_ROUTER["管理员路由<br/>/api/v1/admin/*"]
FAPI_DEP["依赖注入验证<br/>verify_admin_token"]
FAPI_SVC["认证服务<br/>login/validate_token"]
FAPI_CFG["配置<br/>JWT_SECRET/JWT_EXPIRATION_HOURS"]
end
subgraph "Gin"
GIN_MW["认证中间件<br/>JWTAuth()"]
GIN_HANDLER["管理员处理器<br/>Login/List/Delete"]
GIN_SVC["认证服务<br/>Login/ValidateToken"]
GIN_CFG["配置<br/>JWT_SECRET/JWT_EXPIRATION_HOURS"]
end
subgraph "Spring Boot"
SB_INT["拦截器<br/>AdminAuthInterceptor"]
SB_CTRL["控制器<br/>AdminController"]
SB_SVC["认证服务<br/>AdminService(login/validateToken)"]
SB_YML["配置文件<br/>application.yml"]
end
end
ANG --> |"Bearer Token"| FAPI_ROUTER
REACT --> |"Bearer Token"| FAPI_ROUTER
VUE --> |"Bearer Token"| FAPI_ROUTER
ANG --> |"Bearer Token"| GIN_HANDLER
REACT --> |"Bearer Token"| GIN_HANDLER
VUE --> |"Bearer Token"| GIN_HANDLER
ANG --> |"Bearer Token"| SB_CTRL
REACT --> |"Bearer Token"| SB_CTRL
VUE --> |"Bearer Token"| SB_CTRL
FAPI_ROUTER --> FAPI_DEP --> FAPI_SVC
GIN_HANDLER --> GIN_MW --> GIN_SVC
SB_CTRL --> SB_INT --> SB_SVC
FAPI_SVC --- FAPI_CFG
GIN_SVC --- GIN_CFG
SB_SVC --- SB_YML
```

图表来源
- [backends/fastapi/app/routers/admin.py:1-55](file://backends/fastapi/app/routers/admin.py#L1-L55)
- [backends/fastapi/app/dependencies.py:1-23](file://backends/fastapi/app/dependencies.py#L1-L23)
- [backends/fastapi/app/services/admin_service.py:1-42](file://backends/fastapi/app/services/admin_service.py#L1-L42)
- [backends/gin/middleware/auth.go:1-37](file://backends/gin/middleware/auth.go#L1-L37)
- [backends/gin/handler/admin.go:1-77](file://backends/gin/handler/admin.go#L1-L77)
- [backends/gin/service/admin_service.go:1-47](file://backends/gin/service/admin_service.go#L1-L47)
- [backends/spring-boot/src/main/java/com/hellotime/controller/AdminController.java:1-79](file://backends/spring-boot/src/main/java/com/hellotime/controller/AdminController.java#L1-L79)
- [backends/spring-boot/src/main/java/com/hellotime/config/AdminAuthInterceptor.java:1-59](file://backends/spring-boot/src/main/java/com/hellotime/config/AdminAuthInterceptor.java#L1-L59)
- [backends/spring-boot/src/main/java/com/hellotime/service/AdminService.java:1-89](file://backends/spring-boot/src/main/java/com/hellotime/service/AdminService.java#L1-L89)

章节来源
- [backends/fastapi/app/main.py:1-89](file://backends/fastapi/app/main.py#L1-L89)
- [backends/fastapi/app/routers/admin.py:1-55](file://backends/fastapi/app/routers/admin.py#L1-L55)
- [backends/gin/middleware/auth.go:1-37](file://backends/gin/middleware/auth.go#L1-L37)
- [backends/gin/handler/admin.go:1-77](file://backends/gin/handler/admin.go#L1-L77)
- [backends/spring-boot/src/main/java/com/hellotime/config/AdminAuthInterceptor.java:1-59](file://backends/spring-boot/src/main/java/com/hellotime/config/AdminAuthInterceptor.java#L1-L59)
- [backends/spring-boot/src/main/java/com/hellotime/controller/AdminController.java:1-79](file://backends/spring-boot/src/main/java/com/hellotime/controller/AdminController.java#L1-L79)

## 核心组件
- JWT Bearer Token：基于 HMAC-SHA256 签名，包含 sub、iat、exp 声明
- 登录接口：POST /api/v1/admin/login，返回包含 token 的响应
- 受保护接口：GET /api/v1/admin/capsules、DELETE /api/v1/admin/capsules/{code}
- 认证中间件/拦截器：从 Authorization 头提取 Bearer Token 并验证有效性
- Token 过期时间：默认 2 小时，可通过环境变量配置
- 前端状态管理：使用 sessionStorage 持久化 Token，并在认证失败时自动清理

章节来源
- [backends/fastapi/app/routers/admin.py:25-54](file://backends/fastapi/app/routers/admin.py#L25-L54)
- [backends/gin/handler/admin.go:20-35](file://backends/gin/handler/admin.go#L20-L35)
- [backends/spring-boot/src/main/java/com/hellotime/controller/AdminController.java:41-78](file://backends/spring-boot/src/main/java/com/hellotime/controller/AdminController.java#L41-L78)
- [backends/fastapi/app/services/admin_service.py:18-42](file://backends/fastapi/app/services/admin_service.py#L18-L42)
- [backends/gin/service/admin_service.go:14-47](file://backends/gin/service/admin_service.go#L14-L47)
- [backends/spring-boot/src/main/java/com/hellotime/service/AdminService.java:53-87](file://backends/spring-boot/src/main/java/com/hellotime/service/AdminService.java#L53-L87)
- [frontends/angular-ts/src/app/services/admin.service.ts:9-46](file://frontends/angular-ts/src/app/services/admin.service.ts#L9-L46)
- [frontends/react-ts/src/hooks/useAdmin.ts:12-67](file://frontends/react-ts/src/hooks/useAdmin.ts#L12-L67)
- [frontends/vue3-ts/src/composables/useAdmin.ts:14-66](file://frontends/vue3-ts/src/composables/useAdmin.ts#L14-L66)

## 架构总览
下图展示管理员登录、Token 验证与受保护接口调用的整体流程，覆盖三套后端实现。

```mermaid
sequenceDiagram
participant FE as "前端应用"
participant API as "后端API"
participant AUTH as "认证服务/中间件"
rect rgb(255,255,255)
Note over FE,API : "登录流程"
FE->>API : "POST /api/v1/admin/login {password}"
API->>AUTH : "校验密码"
AUTH-->>API : "生成JWT Token"
API-->>FE : "200 OK {token}"
end
rect rgb(255,255,255)
Note over FE,API : "受保护接口调用"
FE->>API : "GET /api/v1/admin/capsules<br/>Authorization : Bearer {token}"
API->>AUTH : "验证Token签名与过期时间"
alt "Token有效"
AUTH-->>API : "通过"
API-->>FE : "200 OK {data}"
else "Token无效/过期"
AUTH-->>API : "拒绝"
API-->>FE : "401 Unauthorized"
end
end
```

图表来源
- [backends/fastapi/app/routers/admin.py:25-54](file://backends/fastapi/app/routers/admin.py#L25-L54)
- [backends/fastapi/app/dependencies.py:10-23](file://backends/fastapi/app/dependencies.py#L10-L23)
- [backends/fastapi/app/services/admin_service.py:18-42](file://backends/fastapi/app/services/admin_service.py#L18-L42)
- [backends/gin/middleware/auth.go:15-36](file://backends/gin/middleware/auth.go#L15-L36)
- [backends/gin/handler/admin.go:20-35](file://backends/gin/handler/admin.go#L20-L35)
- [backends/gin/service/admin_service.go:14-47](file://backends/gin/service/admin_service.go#L14-L47)
- [backends/spring-boot/src/main/java/com/hellotime/config/AdminAuthInterceptor.java:34-57](file://backends/spring-boot/src/main/java/com/hellotime/config/AdminAuthInterceptor.java#L34-L57)
- [backends/spring-boot/src/main/java/com/hellotime/controller/AdminController.java:41-78](file://backends/spring-boot/src/main/java/com/hellotime/controller/AdminController.java#L41-L78)
- [backends/spring-boot/src/main/java/com/hellotime/service/AdminService.java:53-87](file://backends/spring-boot/src/main/java/com/hellotime/service/AdminService.java#L53-L87)

## 详细组件分析

### FastAPI 认证实现
- 应用入口负责全局异常处理与路由注册
- 管理员路由包含登录、分页查询、删除接口
- 依赖注入 verify_admin_token 从 Header 校验 Authorization: Bearer {token}
- 认证服务 login 生成 HS256 签名 Token，validate_token 解码验证
- 配置从环境变量读取，支持自定义 JWT_SECRET 与过期时间（小时）

```mermaid
flowchart TD
Start(["请求进入 FastAPI"]) --> CheckHeader["检查 Authorization 头"]
CheckHeader --> HasPrefix{"以 Bearer 开头？"}
HasPrefix --> |否| Unauthorized["401 未授权"]
HasPrefix --> |是| Extract["提取 Token"]
Extract --> Validate["validate_token 解码验证"]
Validate --> Valid{"有效？"}
Valid --> |否| Unauthorized
Valid --> |是| Next["继续处理业务逻辑"]
Next --> End(["返回响应"])
Unauthorized --> End
```

图表来源
- [backends/fastapi/app/dependencies.py:10-23](file://backends/fastapi/app/dependencies.py#L10-L23)
- [backends/fastapi/app/services/admin_service.py:35-42](file://backends/fastapi/app/services/admin_service.py#L35-L42)
- [backends/fastapi/app/routers/admin.py:25-54](file://backends/fastapi/app/routers/admin.py#L25-L54)

章节来源
- [backends/fastapi/app/main.py:19-89](file://backends/fastapi/app/main.py#L19-L89)
- [backends/fastapi/app/routers/admin.py:25-54](file://backends/fastapi/app/routers/admin.py#L25-L54)
- [backends/fastapi/app/dependencies.py:10-23](file://backends/fastapi/app/dependencies.py#L10-L23)
- [backends/fastapi/app/services/admin_service.py:18-42](file://backends/fastapi/app/services/admin_service.py#L18-L42)
- [backends/fastapi/app/config.py:11-17](file://backends/fastapi/app/config.py#L11-L17)

### Gin 认证实现
- 认证中间件 JWTAuth 从 Authorization 头提取 Bearer Token 并调用服务层验证
- 管理员处理器 Login 接收 JSON 请求体，调用服务层生成 Token
- 认证服务使用 HS256 签名，Claims 包含 sub、iat、exp
- 配置从环境变量读取，支持自定义 JWT_SECRET 与过期时间（小时）

```mermaid
sequenceDiagram
participant C as "客户端"
participant MW as "JWTAuth 中间件"
participant H as "AdminHandler.Login"
participant S as "AdminService.Login/ValidateToken"
C->>H : "POST /api/v1/admin/login {password}"
H->>S : "Login(password)"
S-->>H : "返回 token 或空"
H-->>C : "200 OK {token}"
C->>MW : "GET /api/v1/admin/capsules<br/>Authorization : Bearer {token}"
MW->>S : "ValidateToken(token)"
S-->>MW : "true/false"
alt "true"
MW-->>C : "200 OK"
else "false"
MW-->>C : "401 Unauthorized"
end
```

图表来源
- [backends/gin/middleware/auth.go:15-36](file://backends/gin/middleware/auth.go#L15-L36)
- [backends/gin/handler/admin.go:20-35](file://backends/gin/handler/admin.go#L20-L35)
- [backends/gin/service/admin_service.go:14-47](file://backends/gin/service/admin_service.go#L14-L47)

章节来源
- [backends/gin/middleware/auth.go:13-36](file://backends/gin/middleware/auth.go#L13-L36)
- [backends/gin/handler/admin.go:20-35](file://backends/gin/handler/admin.go#L20-L35)
- [backends/gin/service/admin_service.go:12-47](file://backends/gin/service/admin_service.go#L12-L47)
- [backends/gin/config/config.go:31-43](file://backends/gin/config/config.go#L31-L43)

### Spring Boot 认证实现
- 控制器 AdminController 对 /api/v1/admin/** 接口进行认证约束
- 拦截器 AdminAuthInterceptor 在 preHandle 中校验 Authorization 头与 Token 有效性
- 服务层 AdminService 使用 JJWT 生成与验证 Token，支持自定义密钥与过期时间（小时）
- 配置文件 application.yml 读取环境变量，设置数据库、JWT 密钥与过期时间

```mermaid
classDiagram
class AdminController {
+login(request)
+list(page,size)
+delete(code)
}
class AdminAuthInterceptor {
+preHandle(request,response,handler) boolean
}
class AdminService {
+login(password) String
+validateToken(token) boolean
}
AdminController --> AdminAuthInterceptor : "拦截器生效"
AdminAuthInterceptor --> AdminService : "验证Token"
```

图表来源
- [backends/spring-boot/src/main/java/com/hellotime/controller/AdminController.java:41-78](file://backends/spring-boot/src/main/java/com/hellotime/controller/AdminController.java#L41-L78)
- [backends/spring-boot/src/main/java/com/hellotime/config/AdminAuthInterceptor.java:34-57](file://backends/spring-boot/src/main/java/com/hellotime/config/AdminAuthInterceptor.java#L34-L57)
- [backends/spring-boot/src/main/java/com/hellotime/service/AdminService.java:53-87](file://backends/spring-boot/src/main/java/com/hellotime/service/AdminService.java#L53-L87)

章节来源
- [backends/spring-boot/src/main/java/com/hellotime/controller/AdminController.java:41-78](file://backends/spring-boot/src/main/java/com/hellotime/controller/AdminController.java#L41-L78)
- [backends/spring-boot/src/main/java/com/hellotime/config/AdminAuthInterceptor.java:34-57](file://backends/spring-boot/src/main/java/com/hellotime/config/AdminAuthInterceptor.java#L34-L57)
- [backends/spring-boot/src/main/java/com/hellotime/service/AdminService.java:53-87](file://backends/spring-boot/src/main/java/com/hellotime/service/AdminService.java#L53-L87)
- [backends/spring-boot/src/main/resources/application.yml:20-26](file://backends/spring-boot/src/main/resources/application.yml#L20-L26)

### 前端认证状态处理
- Angular：使用 Injectable 服务，signal 管理 token，登录成功写入 sessionStorage
- React：useAdmin Hook 使用 useSyncExternalStore 管理 token，登录成功写入 sessionStorage
- Vue3：useAdmin Composable 使用 ref 管理 token，登录成功写入 sessionStorage
- 三套前端在受保护接口调用时均携带 Authorization: Bearer {token}

```mermaid
flowchart TD
A["用户输入密码"] --> B["调用登录接口"]
B --> C{"登录成功？"}
C --> |是| D["保存 token 到 sessionStorage"]
C --> |否| E["显示错误并保持未登录"]
D --> F["后续请求携带 Authorization: Bearer {token}"]
E --> F
```

图表来源
- [frontends/angular-ts/src/app/services/admin.service.ts:27-40](file://frontends/angular-ts/src/app/services/admin.service.ts#L27-L40)
- [frontends/react-ts/src/hooks/useAdmin.ts:49-62](file://frontends/react-ts/src/hooks/useAdmin.ts#L49-L62)
- [frontends/vue3-ts/src/composables/useAdmin.ts:43-56](file://frontends/vue3-ts/src/composables/useAdmin.ts#L43-L56)

章节来源
- [frontends/angular-ts/src/app/services/admin.service.ts:9-46](file://frontends/angular-ts/src/app/services/admin.service.ts#L9-L46)
- [frontends/react-ts/src/hooks/useAdmin.ts:12-67](file://frontends/react-ts/src/hooks/useAdmin.ts#L12-L67)
- [frontends/vue3-ts/src/composables/useAdmin.ts:14-66](file://frontends/vue3-ts/src/composables/useAdmin.ts#L14-L66)

## 依赖分析
- 后端三套实现均依赖相同的 JWT 规范与 HS256 签名算法
- FastAPI 依赖注入模式与 Gin 中间件模式、Spring Boot 拦截器模式分别实现相同职责
- 前端三套框架均通过 sessionStorage 持久化 Token，遵循最小权限原则

```mermaid
graph LR
FE["前端三框架"] --> |"Authorization: Bearer"| BE1["FastAPI"]
FE --> |"Authorization: Bearer"| BE2["Gin"]
FE --> |"Authorization: Bearer"| BE3["Spring Boot"]
BE1 --> SVC1["FastAPI 认证服务"]
BE2 --> SVC2["Gin 认证服务"]
BE3 --> SVC3["Spring Boot AdminService"]
SVC1 --> CFG1["FastAPI 配置"]
SVC2 --> CFG2["Gin 配置"]
SVC3 --> CFG3["Spring Boot application.yml"]
```

图表来源
- [backends/fastapi/app/services/admin_service.py:18-42](file://backends/fastapi/app/services/admin_service.py#L18-L42)
- [backends/gin/service/admin_service.go:14-47](file://backends/gin/service/admin_service.go#L14-L47)
- [backends/spring-boot/src/main/java/com/hellotime/service/AdminService.java:53-87](file://backends/spring-boot/src/main/java/com/hellotime/service/AdminService.java#L53-L87)
- [backends/fastapi/app/config.py:11-17](file://backends/fastapi/app/config.py#L11-L17)
- [backends/gin/config/config.go:31-43](file://backends/gin/config/config.go#L31-L43)
- [backends/spring-boot/src/main/resources/application.yml:20-26](file://backends/spring-boot/src/main/resources/application.yml#L20-L26)

章节来源
- [backends/fastapi/app/services/admin_service.py:18-42](file://backends/fastapi/app/services/admin_service.py#L18-L42)
- [backends/gin/service/admin_service.go:14-47](file://backends/gin/service/admin_service.go#L14-L47)
- [backends/spring-boot/src/main/java/com/hellotime/service/AdminService.java:53-87](file://backends/spring-boot/src/main/java/com/hellotime/service/AdminService.java#L53-L87)

## 性能考虑
- Token 验证为轻量级操作（解码与签名验证），对性能影响可忽略
- 建议在网关或反向代理层缓存静态资源，减少后端压力
- 合理设置过期时间：过短增加刷新频率，过长增加泄露风险
- 前端应避免在内存中长期持有敏感数据，及时清理 sessionStorage

## 故障排查指南
- 401 未授权常见原因
  - 缺少 Authorization 头或格式错误（非 Bearer 前缀）
  - Token 无效或已过期
  - 密码错误导致登录失败
- 建议排查步骤
  - 确认请求头格式为 Authorization: Bearer {token}
  - 检查后端日志与异常处理器输出
  - 核对 JWT_SECRET 与过期时间配置
  - 前端确认 sessionStorage 中 token 是否存在且未被清理

章节来源
- [backends/fastapi/app/main.py:49-55](file://backends/fastapi/app/main.py#L49-L55)
- [backends/gin/middleware/auth.go:18-32](file://backends/gin/middleware/auth.go#L18-L32)
- [backends/spring-boot/src/main/java/com/hellotime/config/AdminAuthInterceptor.java:44-53](file://backends/spring-boot/src/main/java/com/hellotime/config/AdminAuthInterceptor.java#L44-L53)

## 结论
HelloTime 项目在三套后端实现中统一采用 JWT Bearer Token 作为管理员认证方案，具备良好的一致性与可移植性。通过明确的登录流程、严格的中间件/拦截器验证以及前端 sessionStorage 的安全存储，整体认证体系简洁可靠。建议在生产环境中结合 HTTPS、安全存储与定期轮换密钥等最佳实践进一步强化安全。

## 附录

### 认证请求/响应示例

- 成功登录
  - 请求
    - 方法：POST
    - 路径：/api/v1/admin/login
    - 请求体：{ "password": "your-admin-password" }
  - 响应
    - 状态：200
    - 响应体：{ "code": "SUCCESS", "data": { "token": "your-jwt-token" }, "message": "登录成功" }

- Token 无效
  - 请求
    - 方法：GET
    - 路径：/api/v1/admin/capsules?page=0&size=20
    - 请求头：Authorization: Bearer invalid-token
  - 响应
    - 状态：401
    - 响应体：{ "code": "UNAUTHORIZED", "message": "认证失败" }

- Token 过期
  - 请求
    - 方法：GET
    - 路径：/api/v1/admin/capsules?page=0&size=20
    - 请求头：Authorization: Bearer expired-or-invalid-token
  - 响应
    - 状态：401
    - 响应体：{ "code": "UNAUTHORIZED", "message": "认证失败" }

- 删除胶囊（受保护接口）
  - 请求
    - 方法：DELETE
    - 路径：/api/v1/admin/capsules/{code}
    - 请求头：Authorization: Bearer {token}
  - 响应
    - 状态：200
    - 响应体：{ "code": "SUCCESS", "message": "删除成功" }

章节来源
- [backends/fastapi/app/routers/admin.py:25-54](file://backends/fastapi/app/routers/admin.py#L25-L54)
- [backends/gin/handler/admin.go:20-76](file://backends/gin/handler/admin.go#L20-L76)
- [backends/spring-boot/src/main/java/com/hellotime/controller/AdminController.java:41-78](file://backends/spring-boot/src/main/java/com/hellotime/controller/AdminController.java#L41-L78)

### 安全最佳实践
- 强制使用 HTTPS，防止 Token 在传输过程中被窃取
- 前端仅使用 sessionStorage 存储 Token，避免 localStorage 长期持久化
- 后端严格校验 Authorization 头格式与签名，拒绝非 Bearer 前缀
- 合理设置过期时间（默认 2 小时），并定期轮换 JWT_SECRET
- 防重放攻击：可引入 nonce 或一次性票据机制（建议在生产环境实施）
- 最小权限原则：仅授予管理员必要权限，避免过度授权

### 不同前端框架中的认证状态处理要点
- Angular：使用 Injectable 服务与 signal 管理 token 生命周期，登录成功写入 sessionStorage
- React：useAdmin Hook 使用 useSyncExternalStore 管理跨组件共享状态，登录成功写入 sessionStorage
- Vue3：useAdmin Composable 使用 ref 管理响应式状态，登录成功写入 sessionStorage
- 三套前端在调用受保护接口时均携带 Authorization: Bearer {token}，并在认证失败时自动清理本地状态

章节来源
- [frontends/angular-ts/src/app/services/admin.service.ts:27-46](file://frontends/angular-ts/src/app/services/admin.service.ts#L27-L46)
- [frontends/react-ts/src/hooks/useAdmin.ts:49-67](file://frontends/react-ts/src/hooks/useAdmin.ts#L49-L67)
- [frontends/vue3-ts/src/composables/useAdmin.ts:43-66](file://frontends/vue3-ts/src/composables/useAdmin.ts#L43-L66)