#!/bin/bash
# 运行所有测试

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

echo "=== 运行时间胶囊全部测试 ==="

# 后端测试
echo ""
echo "[后端] 运行 Spring Boot 测试..."
cd "$ROOT_DIR/backends/spring-boot"
./mvnw test
echo "[后端] 测试完成"

echo ""
echo "[后端] 运行 ASP.NET Core 测试..."
cd "$ROOT_DIR/backends/aspnet-core"
./dotnetw test tests/tests.csproj
echo "[ASP.NET Core 后端] 测试完成"

# Gin 后端测试
echo ""
echo "[后端] 运行 Gin 测试..."
cd "$ROOT_DIR/backends/gin"
go test ./tests/ -v
echo "[Gin 后端] 测试完成"

# FastAPI 后端测试
echo ""
echo "[后端] 运行 FastAPI 测试..."
cd "$ROOT_DIR/backends/fastapi"
pytest
echo "[FastAPI 后端] 测试完成"

# Elysia 后端测试
if command -v bun >/dev/null 2>&1; then
  echo ""
  echo "[后端] 运行 Elysia 测试..."
  cd "$ROOT_DIR/backends/elysia"
  bun test
  echo "[Elysia 后端] 测试完成"
else
  echo ""
  echo "[后端] 跳过 Elysia 测试（需要 Bun 运行时）"
fi

# NestJS 后端测试
echo ""
echo "[后端] 运行 NestJS 测试..."
cd "$ROOT_DIR/backends/nest"
npm test
echo "[NestJS 后端] 测试完成"

# Vue 前端测试
echo ""
echo "[前端] 运行 Vue 3 Vitest 测试..."
cd "$ROOT_DIR/frontends/vue3-ts"
npm run test
echo "[Vue 前端] 测试完成"

# Angular 前端测试
echo ""
echo "[前端] 运行 Angular Karma 测试..."
cd "$ROOT_DIR/frontends/angular-ts"
npm run test
echo "[Angular 前端] 测试完成"

# React 前端测试
echo ""
echo "[前端] 运行 React Vitest 测试..."
cd "$ROOT_DIR/frontends/react-ts"
npm run test
echo "[React 前端] 测试完成"

# Svelte 前端检查
echo ""
echo "[前端] 运行 Svelte 类型检查..."
cd "$ROOT_DIR/frontends/svelte-ts"
npm run check
echo "[Svelte 前端] 检查完成"

# Next 全栈构建验证
echo ""
echo "[全栈] 运行 Next.js 构建验证..."
cd "$ROOT_DIR/fullstacks/next-ts"
npm run build
echo "[Next 全栈] 验证完成"

# Nuxt 全栈构建验证
echo ""
echo "[全栈] 运行 Nuxt 构建验证..."
cd "$ROOT_DIR/fullstacks/nuxt-ts"
npm run build
echo "[Nuxt 全栈] 验证完成"

# Spring MVC 全栈测试
echo ""
echo "[全栈] 运行 Spring MVC 测试..."
cd "$ROOT_DIR/fullstacks/spring-boot-mvc"
./mvnw test
echo "[Spring MVC 全栈] 验证完成"

# macOS 桌面端测试
if [[ "$(uname -s)" == "Darwin" ]] && command -v swift >/dev/null 2>&1; then
  echo ""
  echo "[桌面端] 运行 macOS SwiftUI 测试..."
  cd "$ROOT_DIR/desktop/macos-swiftui"
  swift test
  echo "[macOS 桌面端] 验证完成"
else
  echo ""
  echo "[桌面端] 跳过 macOS SwiftUI 测试（需要 macOS + Swift）"
fi

# Tauri 桌面端测试
if command -v cargo >/dev/null 2>&1; then
  echo ""
  echo "[桌面端] 运行 Tauri 测试..."
  cd "$ROOT_DIR/desktop/tauri/src-tauri"
  cargo test
  echo "[Tauri 桌面端] 测试完成"
else
  echo ""
  echo "[桌面端] 跳过 Tauri 测试（需要 Rust 工具链）"
fi

echo ""
echo "=== 全部测试通过 ==="
