# HelloTime Flutter 桌面端测试脚本

Write-Host "=== HelloTime Flutter 桌面端测试 ===" -ForegroundColor Cyan
Write-Host ""

# 设置 Flutter 路径
$env:Path = "d:\flutter\bin;$env:Path"

# 检查 Flutter 版本
Write-Host "1. 检查 Flutter 版本..." -ForegroundColor Yellow
flutter --version
Write-Host ""

# 检查依赖
Write-Host "2. 检查项目依赖..." -ForegroundColor Yellow
flutter pub get
Write-Host ""

# 代码分析
Write-Host "3. 运行代码分析..." -ForegroundColor Yellow
flutter analyze
Write-Host ""

# 运行测试 (如果有)
Write-Host "4. 运行单元测试..." -ForegroundColor Yellow
flutter test
Write-Host ""

Write-Host "=== 测试完成 ===" -ForegroundColor Green
Write-Host ""
Write-Host "要启动应用，请运行: .\run.ps1" -ForegroundColor Cyan
