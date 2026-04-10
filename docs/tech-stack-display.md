# 技术栈展示约定

## 目的

本文档用于约束 HelloTime 项目中“技术栈展示”的统一实现方式，供后续新增前端、新增后端或新增全栈实现时参考。

目标有两点：

1. 不让前端为某个具体技术栈写特判逻辑。
2. 保持所有前端在首页、关于页、页脚三处展示一致。

## 实现类型

当前仓库里的技术栈展示分为三类：

1. **前后端分离实现**
   - 目录：`frontends/*` + `backends/*`
   - 前端通过 `http://localhost:8080` 访问后端
   - 技术栈展示包含 5 项：
     - 前端框架
     - 前端语言
     - 后端框架
     - 后端语言
     - 数据库

2. **全栈实现**
   - 目录：`fullstacks/*`
   - 应用自带页面与 API，不依赖 `localhost:8080`
   - 技术栈展示项由实现自身决定，目前分两种：
     - `Next / Nuxt`：固定 3 项，框架、语言、数据库
     - `Spring Boot MVC`：固定 5 项，Spring Boot、Java、Thymeleaf、HTMX、SQLite

3. **桌面端实现**
   - 目录：`desktop/*`
   - 使用原生或桌面技术栈构建，不依赖浏览器静态资源约定
   - 当前统一展示 5 项：
     - 桌面端框架
     - 桌面端语言
     - 后端框架
     - 后端语言
     - 数据库

4. **移动端实现**
   - 目录：`mobile/*`
   - 使用原生移动技术栈构建
   - 当前统一展示 5 项：
     - 移动端框架
     - 移动端语言
     - 后端框架
     - 后端语言
     - 数据库

桌面端和移动端实现一样，都需要通过 `GET /api/v1/health` 读取后端三项名称；不同点在于它们自己的前两项由实现自身固定声明，不走浏览器的静态资源（.svg）映射。

当前参考实现包括：
- `desktop/tauri`
- `desktop/macos-swiftui`
- `desktop/winui3`
- `mobile/ios-swiftui`

后续新增实现时，必须先明确自己属于哪一类，再决定采用哪套展示规则。

## 展示位置

当前技术栈信息固定出现在三个位置：

### 首页

- 前后端分离实现展示 5 个图标
- 全栈实现展示固定数量图标
- 顺序必须稳定，不可随意调整
- 文案使用简洁名称
- 不显示版本号

示例：

`React · TypeScript · NestJS · TypeScript · SQLite`

### 关于页

- 展示项数量与首页一致
- 顺序与首页一致
- 使用大图标
- 显示完整名称
- 可以显示版本号

示例：

- `React 19`
- `TypeScript 5`
- `NestJS 11`
- `TypeScript 5`
- `SQLite`

### 页脚

- 使用紧凑单行摘要
- 使用 `·` 分隔
- 文案使用简洁名称
- 不显示版本号

示例：

`HelloTime · 时间胶囊 · Svelte · TypeScript · NestJS · TypeScript · SQLite`

## 前后端分离实现

### 资源归属

每个前端实现都必须在自己的静态资源目录中提供以下两个文件：

- `frontend.svg`
- `frontend-language.svg`

含义：

- `frontend.svg`：前端框架图标
- `frontend-language.svg`：前端语言图标

这两个文件由前端自己维护，不从后端获取。

之所以使用 `frontend-language.svg`，而不是 `typescript-logo.svg`，是因为前端语言未来不一定总是 TypeScript。

### 后端持有的资源

每个后端实现都必须提供固定静态资源路径：

- `/tech-logos/backend.svg`
- `/tech-logos/language.svg`
- `/tech-logos/database.svg`

含义：

- `backend.svg`：后端框架图标
- `language.svg`：后端语言图标
- `database.svg`：数据库图标

这些文件由后端自己维护，前端只按固定路径读取。

### 接口约定

前端从健康检查接口读取后端技术栈名称：

- `GET /api/v1/health`

关键返回结构：

```json
{
  "success": true,
  "data": {
    "status": "UP",
    "timestamp": "2026-04-03T12:00:00Z",
    "techStack": {
      "framework": "NestJS 11",
      "language": "TypeScript 5",
      "database": "SQLite"
    }
  }
}
```

注意：

- `/health` 只负责返回名称信息
- 图标路径不由接口下发
- 图标路径完全依赖固定约定

### 名称展示规则

#### 关于页

关于页直接显示完整名称。

例如后端返回：

- `NestJS 11`
- `TypeScript 5`
- `SQLite`

关于页就直接按这个值展示。

#### 首页和页脚

首页和页脚允许做“通用简化”，但只能做通用规则，不能做技术栈特判。

允许的简化：

- 去掉尾部版本号
- 去掉尾部通用构建后缀

例如：

- `NestJS 11` -> `NestJS`
- `Spring Boot 3` -> `Spring Boot`
- `Java 21` -> `Java`
- `TypeScript 5` -> `TypeScript`

不允许的做法：

- 为 `NestJS`、`Spring Boot`、`FastAPI`、`Gin` 等写单独映射表
- 通过 `if/else` 或 `switch` 去判断某个技术栈名字再手动改写

换句话说，前端只能做“格式清理”，不能做“技术栈识别”。

### 运行时访问约定

开发环境下，前端始终通过 `http://localhost:8080` 访问后端。

因此每个前端开发服务器都必须代理以下两个前缀：

- `/api`
- `/tech-logos`

如果新增前端实现，必须确认开发服务器配置了这两个代理入口。

否则会出现：

- `/api/v1/health` 正常，名称能显示
- `/tech-logos/*.svg` 404，图标无法显示

### 新增前端实现清单

新增一个前端实现时，必须完成以下事项：

1. 在本地静态资源中提供：
   - `frontend.svg`
   - `frontend-language.svg`
2. 首页技术栈区块固定展示 5 项：
   - 前端框架
   - 前端语言
   - 后端框架
   - 后端语言
   - 数据库
3. 关于页技术栈区块同样展示 5 项，但使用完整名称
4. 页脚使用单行摘要格式
5. 从 `/api/v1/health` 读取后端名称
6. 从 `/tech-logos/*.svg` 读取后端图标
7. 开发服务器代理：
   - `/api -> localhost:8080`
   - `/tech-logos -> localhost:8080`
8. 首页和页脚的名称简化函数只能做通用去版本号
9. 更新验证脚本中的前端资源路径与端口配置

### 新增后端实现清单

新增一个后端实现时，必须完成以下事项：

1. 实现 `GET /api/v1/health`
2. 在返回体中提供：
   - `techStack.framework`
   - `techStack.language`
   - `techStack.database`
3. 提供以下静态资源：
   - `/tech-logos/backend.svg`
   - `/tech-logos/language.svg`
   - `/tech-logos/database.svg`
4. 保证技术栈名称本身可直接面向用户展示
5. 接入 `scripts/switch-backend.sh` 或等效的 `8080 -> 后端端口` 转发链路

## 全栈实现

全栈实现不走“前端本地资源 + 后端 `/tech-logos/*` + `/health` 动态读取”的组合方案，而是由实现自身直接决定展示项、名称和资源路径。

### Next / Nuxt

`fullstacks/next-ts` 与 `fullstacks/nuxt-ts` 当前统一采用 3 项展示：

- 框架
- 语言
- 数据库

固定资源文件：

- `frontend.svg`
- `frontend-language.svg`
- `sqlite-logo.svg`

要求：

1. 首页、关于页、页脚三处都使用这 3 项
2. 不再依赖 `/api/v1/health` 决定技术栈展示
3. 不再依赖 `/tech-logos/*`
4. 名称直接由实现自身写死

### Spring Boot MVC

`fullstacks/spring-boot-mvc` 当前固定展示 5 项：

- Spring Boot
- Java
- Thymeleaf
- HTMX
- SQLite

固定资源文件：

- `/stack-logos/spring-boot.svg`
- `/stack-logos/java.svg`
- `/stack-logos/thymeleaf.svg`
- `/stack-logos/htmx.svg`
- `/stack-logos/sqlite.svg`

要求：

1. 首页、关于页、页脚三处都使用这 5 项
2. 展示值不依赖 `/api/v1/health`
3. 这 5 项视为该实现技术特色的一部分，不做动态推导

### 新增全栈实现清单

新增一个全栈实现时，必须完成以下事项：

1. 明确技术栈展示项数量与顺序
2. 把展示规则写入该实现自己的 README
3. 首页、关于页、页脚三处保持一致
4. 所有展示图标都使用本实现自己的本地静态资源
5. 更新验证脚本中的实现路径、端口和展示断言
6. 更新 `frontend-links.html`、根 README、必要时更新 `docs/fullstack-comparison.md`

## 禁忌项

以下做法不要再引入：

1. 不要让前端按技术栈名字选择不同图标文件
2. 不要在前端写某个后端框架的专属映射
3. 不要让后端通过接口返回“前端应该显示哪个图标文件名”
4. 不要修改后端固定静态资源文件名：
   - `backend.svg`
   - `language.svg`
   - `database.svg`
5. 不要把前端语言资源命名回具体语言名，例如 `typescript-logo.svg`

4. 不要让全栈实现继续假装依赖 `8080` 外部后端
5. 不要修改前后端分离实现约定中的固定后端图标文件名：
   - `backend.svg`
   - `language.svg`
   - `database.svg`
6. 不要把前端语言资源命名回具体语言名，例如 `typescript-logo.svg`

## 验证建议

完成新增前端或新增后端后，至少执行以下检查：

```bash
bash verification/scripts/verify-frontend-flows.sh
bash verification/scripts/verify-frontend-browser-flows.sh
```

如果只验证某一个前端，可传入实现名，例如：

```bash
bash verification/scripts/verify-frontend-flows.sh svelte-ts
bash verification/scripts/verify-frontend-browser-flows.sh svelte-ts
```

对于全栈实现，建议额外执行：

```bash
bash verification/scripts/verify-frontend-flows.sh next-ts nuxt-ts spring-boot-mvc
bash verification/scripts/verify-frontend-browser-flows.sh next-ts nuxt-ts spring-boot-mvc
```

## 参考实现

可优先参考以下现有实现：

- React：`frontends/react-ts`
- Vue：`frontends/vue3-ts`
- Angular：`frontends/angular-ts`
- Svelte：`frontends/svelte-ts`
- SolidJS：`frontends/solid-ts`
- macOS SwiftUI：`desktop/macos-swiftui`
- Windows WinUI 3：`desktop/winui3`
- iOS SwiftUI：`mobile/ios-swiftui`
- Next 全栈：`fullstacks/next-ts`
- Nuxt 全栈：`fullstacks/nuxt-ts`
- Spring MVC 全栈：`fullstacks/spring-boot-mvc`
- 共享样式：`spec/styles/cyber.css`
