# HelloTime 时间胶囊 - Flutter 桌面端

基于 Flutter 3 + Dart 实现的跨平台桌面时间胶囊应用，与 Tauri 版、React 版保持高度一致的赛博朋克风格视觉设计。

## 技术栈

- **框架**: Flutter 3.41.6
- **语言**: Dart 3.11.4
- **路由**: go_router
- **状态管理**: flutter_riverpod
- **HTTP 客户端**: dio
- **本地存储**: shared_preferences
- **平台**: Windows / macOS / Linux

## 快速开始

### 前提条件

- Flutter SDK 3.11+ (已安装在 `d:\flutter`)
- Windows 10/11 (或 macOS/Linux)
- Visual Studio 2022 (Windows) 或 Xcode (macOS)

### 开发模式

```powershell
# Windows
.\run.ps1

# 或手动运行
cd desktop/flutter_desktop
flutter run -d windows
```

### 构建发布版本

```powershell
# Windows
flutter build windows

# macOS
flutter build macos

# Linux
flutter build linux
```

构建产物位于 `build/windows/x64/runner/Release/` 目录。

## 项目结构

```
flutter_desktop/
├── lib/
│   ├── main.dart              # 应用入口、路由、主题
│   ├── api/
│   │   └── api_client.dart    # 统一 API 客户端
│   ├── models/
│   │   └── models.dart        # 数据模型
│   ├── providers/             # Riverpod 状态管理
│   ├── views/                 # 视图页面
│   ├── components/            # 可复用组件
│   └── utils/
│       ├── design_tokens.dart # 设计令牌 (颜色、圆角等)
│       └── helpers.dart       # 工具函数
├── assets/
│   ├── fonts/                 # 自定义字体
│   ├── images/                # 图片资源
│   └── tech-logos/            # 技术栈 Logo
├── pubspec.yaml               # 项目配置
└── run.ps1                    # 启动脚本
```

## 功能特性

### 已实现

- ✅ 首页 (Hero Section + Action Cards + Tech Stack)
- ✅ 创建胶囊 (表单验证 + 成功页面)
- ✅ 开启胶囊 (胶囊码查询 + 状态显示)
- ✅ 关于页面
- ✅ 管理员页面 (基础框架)
- ✅ 主题切换 (亮色/暗色)
- ✅ 赛博朋克背景特效 (网格 + 光晕)
- ✅ 玻璃态组件 (cyber-glass)
- ✅ 响应式布局

### 待完善

- ⏳ 倒计时动画
- ⏳ 解密动画效果
- ⏳ 管理员完整功能 (登录 + 列表 + 删除)
- ⏳ 自定义字体 (Inter + JetBrains Mono)
- ⏳ 技术栈 Logo 资源

## 设计规范

遵循项目统一的设计系统 `spec/styles/cyber.css`:

- **颜色系统**: 霓虹蓝 (#00F0FF) + 品红 (#FF003C)
- **玻璃态效果**: BackdropFilter blur + 半透明背景
- **圆角**: 4px / 8px / 16px
- **暗色模式**: `[data-theme="dark"]` 选择器对应 Flutter 的 `ThemeMode.dark`

## API 接口

连接后端 `http://localhost:8080/api/v1`:

- `POST /capsules` - 创建胶囊
- `GET /capsules/{code}` - 查询胶囊
- `POST /admin/login` - 管理员登录
- `GET /admin/capsules` - 胶囊列表
- `DELETE /admin/capsules/{code}` - 删除胶囊
- `GET /health` - 健康检查

## 与 Tauri/React 版的一致性

| 特性 | Tauri 版 | React 版 | Flutter 版 |
|------|----------|----------|------------|
| 视觉风格 | ✅ 赛博朋克 | ✅ 赛博朋克 | ✅ 赛博朋克 |
| 主题切换 | ✅ | ✅ | ✅ |
| 路由结构 | 5 个路由 | 5 个路由 | 5 个路由 |
| API 层 | ✅ 统一封装 | ✅ 统一封装 | ✅ 统一封装 |
| 组件库 | React 组件 | React 组件 | Flutter Widget |
| 状态管理 | React Hooks | React Hooks | Riverpod |

## 开发说明

### 添加新字体

1. 下载字体文件到 `assets/fonts/`
2. 取消 `pubspec.yaml` 中 fonts 配置的注释
3. 运行 `flutter pub get`

### 添加新资源

1. 将文件放入 `assets/` 对应目录
2. 在 `pubspec.yaml` 的 `flutter.assets` 中添加路径
3. 运行 `flutter pub get`

## 故障排除

### 构建失败

```powershell
# 清理构建缓存
flutter clean
flutter pub get
flutter build windows
```

### 窗口无法启动

确保已安装 Visual Studio 2022 并启用 "使用 C++ 的桌面开发" 工作负载。

## 许可证

与主项目保持一致。
