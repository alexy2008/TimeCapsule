# 验证层设计

## 目的

`verification/` 目录用于在彼此独立的实现之间约束共享产品行为。

这个仓库有意不通过共享运行时代码来维持一致性，因此一致性必须通过共享验证场景来保证。

这个目录要回答的核心问题是：

某个前端或后端实现，是否仍然表现为 HelloTime？

## 设计目标

- 在不耦合实现的前提下验证行为
- 保持每个实现都可单独运行和测试
- 为跨实现验收标准提供统一位置
- 尽早暴露行为漂移

## 作用范围

`verification/` 不是用来替代各实现自己的单元测试或集成测试。

本地测试回答的问题是：

- 这个实现内部是否工作正常？
- 这个技术栈特有的代码行为是否正确？

共享验证回答的问题是：

- 这个实现是否仍然符合产品契约？
- 它是否仍然在行为层面与其他实现一致？

## 建议目录结构

```text
verification/
  README.md
  matrix.md
  backends/
    contract/
      health.md
      capsules.md
      admin.md
    scenarios/
      backend-contract-checklist.md
  frontends/
    scenarios/
      public-flows.md
      admin-flows.md
      persistence-rules.md
  scripts/
    verify-backend-contract.sh
    verify-frontend-flows.sh
```

具体脚本实现可以后续演进，但职责边界应保持清晰：

- `matrix.md` 定义必须覆盖的验证对象
- `backends/contract/` 定义后端契约预期
- `frontends/scenarios/` 定义面向用户的前端流程
- `scripts/` 负责组织验证执行

## 实现矩阵

### 后端

- `spring-boot`
- `fastapi`
- `gin`
- `elysia`
- `nest`
- `aspnet-core`
- `vapor`
- `axum`
- `drogon`

### 前端

- `react-ts`
- `vue3-ts`
- `angular-ts`
- `svelte-ts`

任何矩阵报告都应显式展示每个实现的状态。

## 后端验证契约

每个后端都应跑同一组场景。

### A. 健康检查

- `GET /api/v1/health` 返回 `200`
- 响应结构符合统一 API 包装
- 返回体包含技术栈信息

### B. 胶囊创建

- 合法请求返回 `201`
- 响应包含 `code`、标题、创建者、开启时间、创建时间
- 创建响应不暴露未开启内容

### C. 时间校验

- 非法时间格式返回 `400`
- 过去时间的 `openAt` 返回 `400`
- 等于当前时间的 `openAt` 也应被拒绝，因为它不属于未来时间

### D. 胶囊查询

- 未知胶囊码返回 `404`
- 未来胶囊隐藏内容
- 已开启胶囊暴露内容

### E. 管理员登录

- 正确密码返回 `200` 和 token
- 错误密码返回 `401`

### F. 管理员鉴权

- 无 token 查询列表返回 `401`
- 无 token 删除返回 `401`
- 非法 token 返回 `401`

### G. 管理员列表

- 合法 token 返回 `200`
- 响应符合统一分页结构
- 管理员能够看到未开启胶囊内容

### H. 管理员删除

- 删除已存在胶囊成功
- 删除不存在胶囊返回 `404`

## 前端验证场景

前端验证应优先覆盖演示时用户能直接感知的行为。

### A. 公共流程

- 首页正常加载
- 创建流程可以成功提交胶囊
- 开启流程可以按胶囊码查询
- 未开启胶囊隐藏内容并显示锁定状态

### B. 管理流程

- 正确密码可登录管理员
- 错误密码登录失败
- 登录后能渲染管理列表
- 删除操作后表格内容正确更新

### C. 持久化规则

- 主题设置在刷新后仍然保留
- 管理员会话存储行为符合规范
- 路由参数行为在不同框架下保持一致

## 与规范对齐的处理原则

验证应始终优先以规范定义的行为为准，而不是默认服从某个实现的习惯。

当验证发现不一致时，应按以下顺序处理：

1. 先确认规范是否清晰
2. 如果规范正确，则修正实现
3. 如果产品决策已经改变，则先更新规范，再更新实现

不要通过默认接受技术栈特有行为来消化漂移。

## 推荐执行模型

### 各实现本地测试

每个实现保留自己的原生测试命令。

例如：

- Spring Boot: `mvn test`
- FastAPI: `pytest`
- Gin: `go test ./tests/...`
- Elysia: `bun test`
- ASP.NET Core: `./dotnetw test tests/tests.csproj`
- Axum: `cargo test`
- Drogon: `cmake -S . -B build -G Ninja && cmake --build build --target hellotime-drogon-tests && ctest --test-dir build --output-on-failure`
- React: `npm run test`
- Vue: `npm run test`
- Angular: `npm run test`
- Svelte: `npm run check`

### 仓库级验证

仓库级验证建议分层执行：

1. 跑每个实现自己的本地测试
2. 对每个后端执行共享契约检查
3. 对每个前端执行共享场景检查
4. 输出简洁的通过 / 失败矩阵

这样既能保持实现独立，又能让仓库整体拥有统一健康视图。

## 第一阶段交付建议

`verification/` 的第一版建议至少包含：

1. 覆盖所有前后端实现的 `matrix.md`
2. 一份覆盖核心 API 的后端契约检查清单
3. 一份覆盖公共流程与管理流程的前端场景清单
4. 覆盖当前全部实现的根级编排脚本

当前已提供的脚本包括：

- `verification/scripts/verify-backend-contract.sh`
- `verification/scripts/verify-frontend-flows.sh`
- `verification/scripts/verify-frontend-browser-flows.sh`

## 成功标准

当验证层发挥作用时，应该满足这些结果：

- 新增一个实现时，只需要把它接入矩阵，而不是重写架构
- 行为漂移能被尽早发现
- 不会有某个实现被默认当成“标准实现”
- 整个仓库仍然适合作为并排对照的技术展示 demo
