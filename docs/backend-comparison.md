# HelloTime 后端实现对比

本文对 HelloTime 仓库当前的 10 个后端实现进行横向对比：

- `backends/spring-boot`
- `backends/fastapi`
- `backends/gin`
- `backends/elysia`
- `backends/nest`
- `backends/aspnet-core`
- `backends/ktor`
- `backends/vapor`
- `backends/axum`
- `backends/drogon`

它们实现同一套 API 契约和业务规则，但刻意保留各自技术栈的表达方式：

- `Spring Boot` 强调企业级分层、注解与 JPA
- `FastAPI` 强调类型注解、依赖注入和开发效率
- `Gin` 强调轻量、显式分层和 Go 风格工程组织
- `Elysia` 强调 Bun 运行时、链式定义与端到端类型
- `NestJS` 强调模块化、守卫、过滤器与依赖注入
- `ASP.NET Core` 强调控制器体系、中间件管线和 Options 模式
- `Ktor` 强调 Kotlin DSL、插件式中间层和轻量 JVM 服务
- `Vapor` 强调 Swift 并发、RouteCollection 与 Fluent
- `Axum` 强调 extractor 组合、Tower 中间件与显式状态管理
- `Drogon` 强调 C++20、轻量路由与对底层细节的显式掌控

## 1. 总览

| 维度 | Spring Boot | FastAPI | Gin | Elysia | NestJS | ASP.NET Core | Ktor | Vapor | Axum | Drogon |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 路径 | `backends/spring-boot/` | `backends/fastapi/` | `backends/gin/` | `backends/elysia/` | `backends/nest/` | `backends/aspnet-core/` | `backends/ktor/` | `backends/vapor/` | `backends/axum/` | `backends/drogon/` |
| 语言 | Java 21 | Python 3.12 | Go 1.24 | TypeScript + Bun | TypeScript + Node.js | C# 12 + .NET 8 | Kotlin + JVM | Swift 6.2 | Rust 1.94 | C++20 |
| 风格 | MVC + DI | Router + dependency | Handler + service | Fluent API + schema | Module + guard + filter | Controller + middleware | Kotlin DSL + plugin | RouteCollection + async/await | Router + extractor + state | Handler + explicit state |
| 数据层 | Spring Data JPA | SQLAlchemy | GORM | Bun SQLite | node:sqlite | Microsoft.Data.Sqlite | JDBC SQLite | Fluent SQLite | SQLx SQLite | SQLite3 API |
| 校验层 | Jakarta Bean Validation | Pydantic | 手写校验 + tag | TypeBox | class-validator / DTO | DataAnnotations | kotlinx.serialization + 手写校验 | Vapor Validations | 手写校验 + extractor | 手写校验 |
| 认证模型 | JWT + interceptor | JWT + dependency | JWT + middleware | JWT + route guard | JWT + guard | JwtBearer | JWT + Ktor Authentication | JWTAuthenticator | JWT extractor | 手写 JWT 校验 |
| 健康检查 | `/api/v1/health` | `/api/v1/health` | `/api/v1/health` | `/api/v1/health` | `/api/v1/health` | `/api/v1/health` | `/api/v1/health` | `/api/v1/health` | `/api/v1/health` | `/api/v1/health` |

## 2. 架构定位

### 2.1 Spring Boot

Spring Boot 是最标准的企业 Java 风格样板。

它把职责明确拆分为 `controller`、`service`、`repository`、`dto`、`entity`、`config`，优点是边界稳定、可维护性强，代价是样板代码最多。

### 2.2 FastAPI

FastAPI 最偏“类型体验 + 开发效率”。

它依赖 Pydantic 承担校验、序列化和文档角色，`routers` 与 `services` 的分工清晰，整体实现很短，适合展示 Python 后端的快速交付路径。

### 2.3 Gin

Gin 是最典型的 Go 风格实现。

目录结构直接围绕 `handler`、`service`、`model`、`middleware`、`router` 展开，强调少抽象、少魔法、显式控制。

### 2.4 Elysia

Elysia 是这组里最偏现代 Bun + TypeScript 的路线。

它的 schema、handler 与类型定义靠得很近，适合展示“轻运行时 + 强类型链路”的组合。

### 2.5 NestJS

NestJS 是最强调框架约束和模块边界的一套。

它通过 `module`、`controller`、`service`、`guard`、`filter`、`dto` 展示 TypeScript 后端在复杂系统中的组织方式。

### 2.6 ASP.NET Core

ASP.NET Core 体现的是现代 .NET Web API 的平台能力。

它使用最小宿主模型、控制器、中间件、Options 和 JwtBearer，把平台级集成能力表达得很完整。

### 2.7 Ktor

Ktor 展示的是 Kotlin/JVM 里更轻量、更接近 DSL 的后端路线。

它不走 Spring 那种重注解分层，也不走 ASP.NET Core 那种平台化配置，而是用 Ktor plugin、route DSL、`kotlinx.serialization` 和直接 JDBC 组合出一套很薄的 Web API。

### 2.8 Vapor

Vapor 强调 Swift 服务端的类型安全和并发表达。

它通过 `RouteCollection`、Fluent Migration 和原生 async/await 展示 Swift 在服务端的组织方式。

### 2.9 Axum

Axum 重点展示 Rust Web 后端的显式组合能力。

这套实现把逻辑集中在 `Router`、`State`、extractor 和 `tower-http` 上，认证通过自定义 `FromRequestParts` 提取器实现，数据库层直接使用 SQLx 执行 SQL，尽量少做隐藏封装，保留 Rust/Axum 的“组合优于魔法”特征。

### 2.10 Drogon

Drogon 重点展示 C++ Web 服务的轻量高性能路线。

这套实现使用 Drogon 原生路由注册、SQLite3 C API 和 OpenSSL HMAC 手写 JWT，把状态、校验和持久化都维持在显式可见的层次上，适合展示 C++ 后端在“尽量少隐藏细节”这条路上的表达方式。

## 3. 共享业务规则下的差异

### 3.1 创建胶囊

10 个后端都遵循同一套规则：

- 胶囊码是 8 位大写字母和数字
- `openAt` 必须是未来时间
- 成功时返回统一 `ApiResponse`

差异主要在“如何表达”：

- Spring Boot / ASP.NET Core 倾向框架内建控制器模型
- FastAPI / Elysia 更强调声明式请求模型
- Ktor 更强调 Kotlin DSL、插件装配和轻量路由
- Gin / Axum / Drogon 更强调显式控制和轻量抽象
- NestJS / Vapor 更强调框架结构与类型系统结合
- Drogon 额外体现了较低层 API 组合下的服务端实现方式

### 3.2 查询胶囊

所有后端都遵循“未到开启时间隐藏内容”的规则。

差异不在业务本身，而在控制位置：

- Spring Boot / FastAPI / Gin / ASP.NET Core / Ktor 主要在 service 层判断
- Elysia 更偏 route 与 service 之间的轻封装
- NestJS 倾向把异常和认证交给框架管线
- Vapor / Axum 更强调在类型安全对象转换阶段统一完成响应映射
- Drogon 更偏向在 handler 内部显式控制响应构造和序列化

### 3.3 管理员认证

所有后端都使用 JWT，但横切逻辑的承载方式不同：

- Spring Boot：interceptor
- FastAPI：dependency
- Gin：middleware
- Elysia：请求级校验
- NestJS：guard
- ASP.NET Core：认证中间件
- Ktor：Authentication plugin
- Vapor：authenticator
- Axum：extractor
- Drogon：请求头解析 + 手写校验

这也是本仓库最有对照价值的一点之一：相同的认证需求在不同框架里会自然落到完全不同的组织位置。

### 3.4 健康检查与技术栈展示

所有后端都提供 `/api/v1/health`，并通过 `/tech-logos/*` 暴露本地静态图标。

其中 `health` 响应除了 `status` 和 `timestamp`，还必须返回技术栈三元组：

- `framework`
- `language`
- `database`

这条规则直接服务于前端、文档和验证脚本的统一展示。

## 4. 适用场景

如果把这些实现当作样板阅读，可以这样理解：

- `Spring Boot`：企业 Java 分层范式
- `FastAPI`：Python 高效率 API 开发
- `Gin`：Go 轻量 REST 服务
- `Elysia`：Bun + TypeScript 现代轻后端
- `NestJS`：TypeScript 模块化后端
- `ASP.NET Core`：现代企业 C# Web API
- `Ktor`：Kotlin 轻量 JVM 后端
- `Vapor`：Swift 服务端路线
- `Axum`：Rust 类型安全与显式组合路线
- `Drogon`：C++ 高性能轻量后端路线

## 5. 结论

HelloTime 后端矩阵的价值，不在于把所有实现写得一模一样，而在于：

- 共享同一套产品语义
- 共享同一套验证标准
- 各自保留最有辨识度的框架表达

在当前 10 套实现里：

- `FastAPI` 最偏开发效率
- `Gin` 最轻量直接
- `NestJS` 最强调结构化
- `ASP.NET Core` 最强调平台管线
- `Ktor` 最强调 Kotlin DSL 和轻量 JVM 组合
- `Vapor` 最偏类型安全框架化
- `Axum` 最强调显式组合与 Rust 风格
- `Drogon` 最强调底层细节控制与 C++ 服务端表达

这正是多技术栈对照仓库最应该保留的差异。
