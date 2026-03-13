#!/bin/bash
# 开发环境启动脚本 - 同时启动前后端

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

echo "=== 启动时间胶囊开发环境 ==="

# 启动后端
echo "[后端] 启动 Spring Boot..."
cd "$ROOT_DIR/backends/spring-boot"
./mvnw spring-boot:run &
BACKEND_PID=$!

# 等待后端启动
echo "[后端] 等待服务启动..."
sleep 10

# 启动 Vue 前端
echo "[前端] 启动 Vue 3 Vite 开发服务器..."
cd "$ROOT_DIR/frontends/vue3-ts"
npm run dev &
VUE_PID=$!

# 启动 Angular 前端
echo "[前端] 启动 Angular 开发服务器..."
cd "$ROOT_DIR/frontends/angular-ts"
npm run dev &
ANGULAR_PID=$!

echo ""
echo "=== 开发环境已启动 ==="
echo "  后端:    http://localhost:8080"
echo "  Vue 3:   http://localhost:5173"
echo "  Angular: http://localhost:5175"
echo ""
echo "按 Ctrl+C 停止所有服务"

# 捕获退出信号
trap "kill $BACKEND_PID $VUE_PID $ANGULAR_PID 2>/dev/null; exit" SIGINT SIGTERM

wait
