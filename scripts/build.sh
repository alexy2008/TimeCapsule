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

echo ""
echo "=== 构建完成 ==="
echo "  后端 JAR:       backends/spring-boot/target/hellotime-backend-1.0.0.jar"
echo "  Vue 静态文件:   frontends/vue3-ts/dist/"
echo "  Angular 静态:   frontends/angular-ts/dist/angular-ts/"
