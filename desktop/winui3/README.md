# HelloTime WinUI 3 桌面端

这是 HelloTime 的 Windows 原生桌面端实现，基于 WinUI 3 + Windows App SDK + C# 12 构建。

## 设计目标

- 尽量对齐 `desktop/macos-swiftui/` 的页面结构、功能范围和赛博玻璃风格
- 遵循项目的桌面端技术栈展示约定
- 使用 WinUI 3、Mica、ThemeShadow、DispatcherQueue 等 Windows 原生能力体现平台特色

## 当前能力

- 顶部导航 + 单页内容切换
- Mica 窗口背景 + 自定义标题栏
- 明亮 / 暗色主题切换（自动记住上次选择）
- 读取 `/api/v1/health` 展示桌面端 5 项技术栈
- 首页赛博 Hero、双入口动作卡片、倒计时预览
- 创建胶囊：创建前确认、成功态提取码展示、复制提取码
- 查询胶囊：锁定倒计时、进度条、到时后重新查询、解锁淡出动画
- 管理员登录、分页列表、删除确认、空状态提示
- 关于页科技球隐藏入口 + 核心技术与设计约定说明

## 运行

先确保任意一个后端已经通过 `http://localhost:8080` 暴露出来。

```powershell
cd desktop/winui3
dotnet run --project HelloTimeWinUI.csproj
```

或直接执行：

```powershell
desktop\winui3\run.ps1
```

## 构建

```powershell
cd desktop/winui3
dotnet build HelloTimeWinUI.csproj
```

当前项目默认采用非打包（`WindowsPackageType=None`）方式进行本地开发，便于在仓库内直接迭代和调试。

## 目录结构

```text
desktop/winui3/
├── Controls/          # 背景层与后续可复用视觉组件
├── Models/            # API 数据模型与页面枚举
├── Services/          # AppState、ApiClient、异常封装
├── Views/             # Home / Create / Open / About / Admin 页面
├── App.xaml           # 主题资源、颜色和通用样式
├── MainWindow.xaml    # WinUI 3 主窗口
└── HelloTimeWinUI.csproj
```
