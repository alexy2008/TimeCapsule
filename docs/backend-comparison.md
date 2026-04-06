# HelloTime 后端实现对比

本文对 HelloTime 仓库当前的六个后端实现进行横向对比：

- `backends/spring-boot`
- `backends/fastapi`
- `backends/gin`
- `backends/elysia`
- `backends/nest`
- `backends/aspnet-core`

它们都实现同一套胶囊业务，但各自体现的框架风格不同：

- `Spring Boot` 强调企业级分层与注解体系
- `FastAPI` 强调异步接口、类型注解和自动文档
- `Gin` 强调轻量、显式分层和 Go 的工程习惯
- `Elysia` 强调 Bun 运行时、链式 API 和端到端类型推断
- `NestJS` 强调模块化、依赖注入、守卫与过滤器
- `ASP.NET Core` 强调控制器体系、中间件管线、Options 模式和现代 C# 异步 API

## 1. 总览

| 维度 | Spring Boot | FastAPI | Gin | Elysia | NestJS | ASP.NET Core |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 路径 | `backends/spring-boot/` | `backends/fastapi/` | `backends/gin/` | `backends/elysia/` | `backends/nest/` | `backends/aspnet-core/` |
| 语言 | Java 21 | Python 3.12 | Go 1.24 | TypeScript + Bun | TypeScript + Node.js | C# 12 + .NET 8 |
| 风格 | MVC + DI | Router + dependency | Handler + service | Fluent API + schema | Module + controller + guard | Controller + middleware + options |
| 数据层 | Spring Data JPA | SQLAlchemy | GORM | Bun SQLite | node:sqlite | Microsoft.Data.Sqlite |
| 校验层 | Jakarta Bean Validation | Pydantic | struct tag + validator | TypeBox | class-validator / DTO | DataAnnotations + ApiController |
| 认证模型 | JWT + interceptor | JWT + dependency | JWT + middleware | JWT + route guard | JWT + guard / filter | JWT Bearer + authorization |
| 健康检查 | `/api/v1/health` | `/api/v1/health` | `/api/v1/health` | `/api/v1/health` | `/api/v1/health` | `/api/v1/health` |

## 2. 架构定位

### 2.1 Spring Boot

Spring Boot 是这组后端里最“传统企业 Java”的实现。

它的结构最接近典型的分层架构：

- `controller` 负责 HTTP 入口
- `service` 负责业务规则
- `repository` 负责数据访问
- `dto` 负责请求 / 响应对象
- `entity` 负责持久化实体
- `config` 负责认证、CORS、字符串转换等横切逻辑

这套实现的优点是边界清晰，适合长期维护；代价是样板代码最多。

### 2.2 FastAPI

FastAPI 是最偏“开发效率和类型体验”的实现。

它的核心特征是：

- 路由写在 `routers`
- 业务写在 `services`
- Pydantic 同时承担校验、序列化和文档生成
- 依赖注入主要通过 `dependencies.py` 组织

相比 Spring Boot，它更短、更直接；相比 Gin，它更少显式样板。

### 2.3 Gin

Gin 是最典型的 Go 风格分层实现。

它的目录组织比较直白：

- `handler`
- `service`
- `model`
- `dto`
- `middleware`
- `router`

特点是轻量、明确、没有多余抽象。它很适合展示 Go 的工程习惯，也很适合读者快速理解一套 REST API 是怎么拆开的。

### 2.4 Elysia

Elysia 是这组后端里最“现代 TypeScript / Bun”风格的实现。

它的特点是：

- 链式路由定义
- 直接围绕 schema 组织请求校验
- Bun 内置 SQLite，配置很薄
- API 和类型定义贴得很近

这套实现最适合展示“运行时轻、类型链路紧”的特点。

### 2.5 NestJS

NestJS 是六个后端里最强调框架约束的一套。

它的核心是：

- `module`
- `controller`
- `service`
- `guard`
- `filter`
- `dto`

Nest 的价值不在于“代码最少”，而在于把职责拆得很明确。对于更复杂的后端系统，这种组织方式最有扩展性。

### 2.6 ASP.NET Core

ASP.NET Core 是这组后端里最能体现现代 .NET 工程风格的一套。

它的核心表达是：

- `Program.cs` 最小宿主模型
- `Controller` 作为 HTTP 入口
- `Service` 承担业务与数据访问
- `Middleware` 统一异常响应
- `Options` 模式组织配置
- `JwtBearer` 负责管理员认证

相比 Spring Boot，它更轻；相比 NestJS，它的框架约束更少；相比 FastAPI 和 Gin，它又更强调中间件管线和平台级集成能力。

## 3. 业务实现差异

### 3.1 创建胶囊

六个后端都遵循同一套胶囊创建规则：

- 胶囊码是 8 位大写字母和数字
- `openAt` 必须是未来时间
- 成功后返回标准 `ApiResponse`

实现上的差异主要体现在：

- Spring Boot 更依赖 Bean Validation 和全局异常处理
- FastAPI 更依赖 Pydantic 模型与异常处理器
- Gin 更依赖手写校验和 handler/service 分层
- Elysia 直接利用 schema 和 route handler
- NestJS 则把 DTO、Guard、Filter 组合在一起
- ASP.NET Core 则把 DataAnnotations、`ApiController` 和中间件异常映射拼成完整链路

### 3.2 查询胶囊

六个后端都遵循“未到开启时间前隐藏内容”的规则。

这里的差异主要不是业务本身，而是控制方式：

- Spring Boot / FastAPI / Gin 更偏显式服务层判断
- Elysia 倾向在 route 与 service 之间薄封装
- NestJS 倾向把校验和异常抛给框架层处理
- ASP.NET Core 则通过 controller + service 的典型 Web API 组合来承载

### 3.3 管理员认证

六个后端都采用 JWT 思路，但实现手感不同：

- Spring Boot：`AdminAuthInterceptor`
- FastAPI：dependency 依赖注入
- Gin：middleware
- Elysia：请求级认证校验
- NestJS：`AdminAuthGuard`
- ASP.NET Core：`JwtBearer` 认证中间件 + `[Authorize]`

这正好体现了不同框架对“横切关注点”的不同组织方式。

### 3.4 健康检查与技术栈信息

六个后端都提供 `/api/v1/health`，用于前端展示技术栈信息。

同时，各后端都提供自己的静态技术图标目录：

- `backend.svg`
- `language.svg`
- `database.svg`
- Spring Boot 额外还提供 `frontend.svg`

这部分是仓库当前多技术栈展示的重要约定，不再依赖前端猜测后端使用了什么技术。

## 4. 代码规模

以下统计来自当前源码快照，排除测试文件与构建产物，仅用于横向体感对比：

| 实现 | 源码文件数 | 核心源码行数 |
| :--- | :--- | :--- |
| Spring Boot | 28 | 1,382 |
| FastAPI | 16 | 624 |
| Gin | 14 | 724 |
| Elysia | 11 | 874 |
| NestJS | 55 | 1,517 |
| ASP.NET Core | 17 | 785 |

几个直观结论：

- `FastAPI` 最精简
- `Gin` 保持了 Go 的轻量风格
- `Elysia` 文件数最少，但 TypeScript 结构更集中
- `Spring Boot` 是传统企业 Java 的样子，分层最完整
- `NestJS` 文件数最多，说明它的模块、DTO、guard、filter 边界最细
- `ASP.NET Core` 介于轻量和结构化之间，比较像“中等约束、平台能力完整”的企业 C# Web API

## 5. 适用场景

如果把这六个后端当作展示样板，可以这样理解：

- `Spring Boot`：适合展示企业级 Java 后端的标准化分层
- `FastAPI`：适合展示 Python 异步接口和自动文档体验
- `Gin`：适合展示 Go 的轻量、高并发和显式分层
- `Elysia`：适合展示 Bun + TypeScript 的现代轻量后端
- `NestJS`：适合展示 TypeScript 后端里最完整的模块化体系
- `ASP.NET Core`：适合展示现代 C# Web API、控制器体系和中间件管线

## 6. 结论

这六个后端实现的价值，不在于它们是否完全相同，而在于它们能否清楚展示不同框架的习惯用法。

如果从“框架特色表达”角度看：

- `FastAPI` 最顺手
- `Gin` 最轻量
- `Spring Boot` 最稳重
- `Elysia` 最现代
- `NestJS` 最结构化
- `ASP.NET Core` 最像现代企业 C# Web API

如果从仓库展示价值看，这六套后端已经覆盖了六条非常不同的路线：

1. Java 企业级 MVC
2. Python 异步接口
3. Go 轻量分层
4. Bun + TypeScript 现代后端
5. NestJS 模块化后端
6. ASP.NET Core 企业级 C# Web API

后续如果继续新增后端实现，建议优先选择能明显拉开技术路线差异的栈，而不是再补一套和现有实现过于接近的同类方案。
