# HelloTime Solid Frontend

时间胶囊应用的 SolidJS 浏览器前端实现，强调细粒度响应式与直接声明式组件写法。

## 技术栈

- **框架**: SolidJS 1
- **语言**: TypeScript 5
- **构建工具**: Vite 7
- **路由**: @solidjs/router
- **测试**: Vitest + Solid Testing Library

## 实现特点

- 使用 `createSignal`、`createMemo`、`createResource` 组织响应式状态
- 首页、关于页、页脚共享同一份技术栈 resource
- 主题切换和管理员状态采用模块级 signal，而不是 React 风格 hook 平移
- 保持与其他前端一致的 UI 和主流程

## 快速开始

```bash
cd frontends/solid-ts
npm install
npm run dev -- --host localhost --port 5180
```

浏览器访问 [http://localhost:5180](http://localhost:5180)。

## 命令

```bash
npm run dev
npm run build
npm run preview
npm run test
```

## 目录结构

```text
src/
├── components/      # 可复用 UI 组件
├── lib/             # API、主题、技术栈、管理员共享状态
├── routes/          # 5 个页面路由
├── types/           # 类型定义
└── __tests__/       # 轻量测试
```
