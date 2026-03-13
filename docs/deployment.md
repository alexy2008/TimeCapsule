# 部署指南

## 环境要求

### 后端
- Java 17+
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

后端运行在 http://localhost:8080

### 启动前端

```bash
cd frontends/vue3-ts
npm install
npm run dev
```

前端开发服务器运行在 http://localhost:5173，API 请求自动代理到后端。

### 使用脚本

```bash
# 同时启动前后端
./scripts/dev.sh

# 构建生产版本
./scripts/build.sh
```

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
| `SERVER_PORT` | 8080 | 后端端口 |

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

## 数据库

SQLite 数据库文件默认生成在后端运行目录下 (`hellotime.db`)。备份只需复制此文件。
