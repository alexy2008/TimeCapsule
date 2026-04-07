# HelloTime Spring Boot MVC 全栈实现

这是 HelloTime 的 Spring MVC 全栈版本，基于：

- Spring Boot 3
- Java 21
- Thymeleaf
- HTMX
- SQLite

## 技术特点

- Spring MVC Controller 返回页面模板
- Thymeleaf fragments 组织页面结构
- HTMX 负责管理员局部刷新、分页与删除
- Session 登录态驱动管理员界面

## 运行

```bash
cd fullstacks/spring-boot-mvc
./run
```

Windows PowerShell:

```powershell
cd fullstacks/spring-boot-mvc
.\run.ps1
```

默认地址：

- 应用入口：[http://localhost:4179](http://localhost:4179)
- API 健康检查：[http://localhost:4179/api/v1/health](http://localhost:4179/api/v1/health)

## 构建与测试

```bash
./mvnw test
./mvnw package
```

## 技术栈展示

本实现技术栈展示固定为 5 项：

- Spring Boot
- Java
- Thymeleaf
- HTMX
- SQLite

对应静态资源：

- `src/main/resources/static/stack-logos/spring-boot.svg`
- `src/main/resources/static/stack-logos/java.svg`
- `src/main/resources/static/stack-logos/thymeleaf.svg`
- `src/main/resources/static/stack-logos/htmx.svg`
- `src/main/resources/static/stack-logos/sqlite.svg`

不依赖外部后端的 `/tech-logos/*` 或 `localhost:8080`。

## 路由

- `/`
- `/create`
- `/open`
- `/open/{code}`
- `/about`
- `/admin`
- `/api/v1/*`

## 说明

- 原有 `backends/spring-boot` 保持不动
- 本实现保留 REST API，同时新增 MVC 页面层
- 管理员 Web 界面使用 Session 登录态
