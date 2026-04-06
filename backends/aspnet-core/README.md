# HelloTime ASP.NET Core 后端

这是 HelloTime 的 ASP.NET Core 8 + C# 12 实现。

这套实现保持 .NET 的典型风格：

- `Program.cs` 使用最小宿主模型
- `Controllers` 负责 HTTP 入口
- `Services` 承担业务与数据访问
- `record` DTO + DataAnnotations 做请求校验
- JWT Bearer 负责管理员认证
- `TimeProvider` 和异步 `Task` API 体现现代 .NET 写法

## 运行

```bash
cd backends/aspnet-core
./run
```

默认地址：

- `http://127.0.0.1:18050`

如果前端仍走 `http://localhost:8080`，可在仓库根目录执行：

```bash
./scripts/switch-backend.sh aspnet-core
```

## 测试

```bash
cd backends/aspnet-core
./dotnetw test
```

## 构建

```bash
cd backends/aspnet-core
./dotnetw build
```

## 环境变量

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `PORT` | `18050` | 服务端口 |
| `DATABASE_URL` | `../../data/hellotime.db` | SQLite 文件路径 |
| `ADMIN_PASSWORD` | `timecapsule-admin` | 管理员密码 |
| `JWT_SECRET` | 内置默认值 | JWT 签名密钥 |
| `JWT_EXPIRATION_HOURS` | `2` | JWT 过期时间（小时） |
