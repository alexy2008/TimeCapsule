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

echo ""
echo "=== 全部测试通过 ==="
