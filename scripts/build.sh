#!/bin/bash
# 生产构建脚本

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

echo "=== 构建时间胶囊 ==="

# 构建后端
echo "[后端] 构建 Spring Boot..."
cd "$ROOT_DIR/backends/spring-boot"
./mvnw clean package -DskipTests -q
echo "[后端] 构建完成: target/hellotime-backend-1.0.0.jar"

echo "[后端] 构建 ASP.NET Core..."
cd "$ROOT_DIR/backends/aspnet-core"
./dotnetw build -c Release
echo "[ASP.NET Core 后端] 构建完成: bin/Release/net8.0/"

# 构建 Vue 前端
echo "[前端] 构建 Vue 3..."
cd "$ROOT_DIR/frontends/vue3-ts"
npm run build
echo "[Vue 前端] 构建完成: dist/"

# 构建 Angular 前端
echo "[前端] 构建 Angular..."
cd "$ROOT_DIR/frontends/angular-ts"
npm run build
echo "[Angular 前端] 构建完成: dist/angular-ts/"

# 构建 Svelte 前端
echo "[前端] 构建 Svelte 5..."
cd "$ROOT_DIR/frontends/svelte-ts"
npm run build
echo "[Svelte 前端] 构建完成: dist/"

# 构建 React 前端
echo "[前端] 构建 React..."
cd "$ROOT_DIR/frontends/react-ts"
npm run build
echo "[React 前端] 构建完成: dist/"

# 构建 Next 全栈
echo "[全栈] 构建 Next.js..."
cd "$ROOT_DIR/fullstacks/next-ts"
npm run build
echo "[Next 全栈] 构建完成: .next/"

# 构建 Nuxt 全栈
echo "[全栈] 构建 Nuxt..."
cd "$ROOT_DIR/fullstacks/nuxt-ts"
npm run build
echo "[Nuxt 全栈] 构建完成: .output/"

# 构建 Spring MVC 全栈
echo "[全栈] 构建 Spring MVC..."
cd "$ROOT_DIR/fullstacks/spring-boot-mvc"
./mvnw clean package -DskipTests -q
echo "[Spring MVC 全栈] 构建完成: target/hellotime-backend-1.0.0.jar"

# 构建 macOS 桌面端
if [[ "$(uname -s)" == "Darwin" ]] && command -v swift >/dev/null 2>&1; then
  echo "[桌面端] 构建 macOS SwiftUI..."
  cd "$ROOT_DIR/desktop/macos-swiftui"
  swift build
  echo "[macOS 桌面端] 构建完成: .build/"
else
  echo "[桌面端] 跳过 macOS SwiftUI 构建（需要 macOS + Swift）"
fi

echo ""
echo "=== 构建完成 ==="
echo "  后端 JAR:       backends/spring-boot/target/hellotime-backend-1.0.0.jar"
echo "  Vue 静态文件:   frontends/vue3-ts/dist/"
echo "  Angular 静态:   frontends/angular-ts/dist/angular-ts/"
echo "  Svelte 静态:    frontends/svelte-ts/dist/"
echo "  React 静态:     frontends/react-ts/dist/"
echo "  Next 构建产物:  fullstacks/next-ts/.next/"
echo "  Nuxt 构建产物:  fullstacks/nuxt-ts/.output/"
echo "  Spring MVC JAR: fullstacks/spring-boot-mvc/target/hellotime-backend-1.0.0.jar"
echo "  macOS 构建产物: desktop/macos-swiftui/.build/（仅 macOS）"
