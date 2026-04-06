# HelloTime Cyber — macOS 桌面端（赛博玻璃版）

这是 HelloTime 时间胶囊应用的 macOS 桌面端实现，目标是**最大限度接近 Web 前端的 Cyber-Glass 赛博朋克视觉效果**，而非普通原生 macOS 样式。

## 设计理念

| Web CSS 概念 | SwiftUI 实现 |
| :--- | :--- |
| 网格背景 `.background-grid` | `Canvas` 绘制 40×40 网格 + 径向渐变遮罩 |
| 环境光晕 `.ambient-glow` | `RadialGradient` 脉冲动画 |
| 玻璃面板 `.cyber-glass` | 半透明背景 + 顶部扫光线 + 毛玻璃 |
| 发光按钮 `.btn-glow` | hover 时扫光动画 + 阴影发光 |
| 倒计时 `.countdown-display` | 条纹背景 + 等宽字体 + 闪烁冒号 |
| 解密动画 `.decrypt-animation-overlay` | 扫描线 + 二进制雨淡出 |
| 暗色/亮色主题 | `CyberTheme` + `CyberPalette` 双模式 |

**布局**: 顶部导航 + 单页内容切换（无侧边栏），与 Web 前端完全一致。

## 技术栈

- **SwiftUI** — UI 框架（完全自定义视图，无 NavigationSplitView）
- **Swift 6.1** — 语言版本
- **macOS 14+** — 最低系统版本
- **URLSession** — HTTP 客户端（无第三方依赖）

## 快速开始

### 编译 & 运行

```bash
cd desktop/macos-swiftui
swift run
```

### 仅编译检查

```bash
swift build
```

### 运行测试

```bash
swift test
```

## 配置

应用启动后默认连接 `http://localhost:8080/api/v1`。

启动后端服务（任意后端实现均可）：

```bash
# Spring Boot
cd backends/spring-boot && ./mvnw spring-boot:run

# Gin
cd backends/gin && go run main.go
```

## 页面路由

| 页面 | 对应 Web 路由 |
| :--- | :--- |
| 首页 | `/` |
| 创建胶囊 | `/create` |
| 开启胶囊 | `/open` |
| 关于 | `/about` |
| 管理员 | `/admin` |

## 隐藏功能

在「关于」页面点击旋转科技球 **5 次**，可进入管理员界面（与 Web 前端保持一致）。

## 目录结构

```
Sources/HelloTimeCyber/
├── HelloTimeCyberApp.swift    # App 入口
├── Theme/                     # 色彩令牌、字体、主题管理
├── Components/                # 11 个自定义组件
├── Views/                     # 6 个页面视图
├── Models/                    # API 数据模型
└── Services/                  # HTTP 客户端 + 全局状态
```
