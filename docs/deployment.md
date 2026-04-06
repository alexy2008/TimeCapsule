# 部署指南

## 环境要求

### 后端
- Java 21+
- Maven 3.8+（或使用内置的 Maven Wrapper）

### 前端
- Node.js 20+
- npm 9+

## 开发环境

### 启动后端

```bash
cd backends/spring-boot
./mvnw spring-boot:run
```

Spring Boot 默认运行在 http://localhost:18000

如果前端仍固定访问 `http://localhost:8080`，请在仓库根目录执行：

```bash
./scripts/switch-backend.sh spring-boot
```

当前约定的后端默认端口如下：

- `spring-boot`: `18000`
- `fastapi`: `18010`
- `gin`: `18020`
- `elysia`: `18030`
- `nest`: `18040`
- `aspnet-core`: `18050`

### 启动前端

```bash
cd frontends/vue3-ts
npm install
npm run dev
```

前端开发服务器运行在 http://localhost:5173，API 请求固定代理到 `http://localhost:8080`。
通过 `./scripts/switch-backend.sh <backend>` 可以动态把 `8080` 转发到不同后端。

### 使用脚本

```bash
# 同时启动前后端
./scripts/dev.sh

# 进入交互式服务管理工具
./scripts/dev-manager.py

# 切换前端当前连接的后端
./scripts/switch-backend.sh spring-boot
./scripts/switch-backend.sh fastapi
./scripts/switch-backend.sh gin
./scripts/switch-backend.sh elysia
./scripts/switch-backend.sh nest
./scripts/switch-backend.sh aspnet-core

# 构建生产版本
./scripts/build.sh
```

`./scripts/dev-manager.py` 会显示所有前后端服务的运行状态、监听端口、PID，以及当前 `8080` 到真实后端端口的映射关系，并提供启动、停止、重启、查看日志和切换映射的交互菜单。

## 生产部署

### 构建后端

```bash
cd backends/spring-boot
./mvnw clean package -DskipTests
# JAR 文件在 target/hellotime-backend-1.0.0.jar
```

### 构建前端

```bash
cd frontends/vue3-ts
npm run build
# 静态文件在 dist/ 目录
```

### 运行

```bash
# 启动后端
java -jar backends/spring-boot/target/hellotime-backend-1.0.0.jar

# 前端静态文件用 Nginx 或其他 Web 服务器托管
```

## 环境变量

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `ADMIN_PASSWORD` | timecapsule-admin | 管理员密码 |
| `JWT_SECRET` | (内置默认值) | JWT 签名密钥，生产环境必须修改 |
| `SERVER_PORT` | 18000 | Spring Boot 端口 |
| `PORT` | 各后端不同 | FastAPI/Gin/Elysia/Nest/ASP.NET Core 端口，默认分别为 18010/18020/18030/18040/18050 |

### 生产环境示例

```bash
export ADMIN_PASSWORD="your-secure-password"
export JWT_SECRET="your-very-long-jwt-secret-key-at-least-32-chars"
java -jar hellotime-backend-1.0.0.jar
```

## Nginx 配置示例

```nginx
server {
    listen 80;
    server_name example.com;

    # 前端静态文件
    location / {
        root /path/to/frontends/vue3-ts/dist;
        try_files $uri $uri/ /index.html;
    }

    # API 代理
    location /api/ {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

在本地开发环境中，`http://localhost:8080` 一般由 `./scripts/switch-backend.sh` 转发到实际后端端口。

## 数据库

默认情况下，后端共享同一个 SQLite 数据库文件：`data/hellotime.db`。
备份时复制该文件即可。
