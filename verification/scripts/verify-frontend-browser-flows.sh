#!/bin/bash
# 使用 Playwright 模拟浏览器验证前端主要功能

set -u

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(dirname "$(dirname "$SCRIPT_DIR")")"
VERIFICATION_DIR="$ROOT_DIR/verification"
BACKEND_URL="${BACKEND_URL:-http://localhost:8080}"
ADMIN_PASSWORD="${ADMIN_PASSWORD:-timecapsule-admin}"
CHROME_EXECUTABLE_PATH="${CHROME_EXECUTABLE_PATH:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
FORCE_RESTART_FRONTENDS="${FORCE_RESTART_FRONTENDS:-0}"

if [ "$#" -eq 0 ]; then
  SELECTED_FRONTENDS="react-ts vue3-ts angular-ts svelte-ts"
else
  SELECTED_FRONTENDS="$*"
fi

FAILED_COUNT=0
SUMMARY_LINES=""

print_divider() {
  echo "------------------------------------------------------------"
}

label_for() {
  case "$1" in
    react-ts) echo "React" ;;
    vue3-ts) echo "Vue" ;;
    angular-ts) echo "Angular" ;;
    svelte-ts) echo "Svelte" ;;
    *) echo "Unknown" ;;
  esac
}

dir_for() {
  case "$1" in
    react-ts) echo "$ROOT_DIR/frontends/react-ts" ;;
    vue3-ts) echo "$ROOT_DIR/frontends/vue3-ts" ;;
    angular-ts) echo "$ROOT_DIR/frontends/angular-ts" ;;
    svelte-ts) echo "$ROOT_DIR/frontends/svelte-ts" ;;
    *) return 1 ;;
  esac
}

base_url_for() {
  case "$1" in
    react-ts) echo "http://localhost:4174" ;;
    vue3-ts) echo "http://localhost:4173" ;;
    angular-ts) echo "http://localhost:4175" ;;
    svelte-ts) echo "http://localhost:4176" ;;
    *) return 1 ;;
  esac
}

port_for() {
  case "$1" in
    react-ts) echo "4174" ;;
    vue3-ts) echo "4173" ;;
    angular-ts) echo "4175" ;;
    svelte-ts) echo "4176" ;;
    *) return 1 ;;
  esac
}

dev_command_for() {
  case "$1" in
    react-ts) echo "npm run dev -- --host localhost --port 4174 --strictPort" ;;
    vue3-ts) echo "npm run dev -- --host localhost --port 4173 --strictPort" ;;
    angular-ts) echo "./node_modules/.bin/ng serve --host localhost --port 4175 --proxy-config proxy.conf.json" ;;
    svelte-ts) echo "npm run dev -- --host localhost --port 4176 --strictPort" ;;
    *) return 1 ;;
  esac
}

append_summary() {
  frontend="$1"
  server_result="$2"
  browser_result="$3"
  overall_result="$4"
  SUMMARY_LINES="${SUMMARY_LINES}${frontend}|${server_result}|${browser_result}|${overall_result}
"
}

wait_for_url() {
  url="$1"
  retries=60

  while [ "$retries" -gt 0 ]; do
    if curl -fsS "$url" >/dev/null 2>&1; then
      return 0
    fi
    sleep 1
    retries=$((retries - 1))
  done

  return 1
}

ensure_backend_ready() {
  if ! curl -fsS "$BACKEND_URL/api/v1/health" >/dev/null 2>&1; then
    echo "后端未就绪: $BACKEND_URL/api/v1/health"
    echo "请先启动任意一个后端实现，并确保它监听 8080 端口。"
    exit 1
  fi

  for asset in backend.svg language.svg database.svg; do
    if ! curl -fsS "$BACKEND_URL/tech-logos/$asset" >/dev/null 2>&1; then
      echo "后端技术栈 logo 不可用: $BACKEND_URL/tech-logos/$asset"
      echo "首页现在依赖后端提供 backend/language/database 三个技术栈 logo。"
      exit 1
    fi
  done
}

ensure_playwright_ready() {
  if [ ! -d "$VERIFICATION_DIR/node_modules/@playwright/test" ]; then
    echo "缺少 Playwright 依赖，请先执行: (cd verification && npm install)"
    exit 1
  fi

  if [ ! -x "$CHROME_EXECUTABLE_PATH" ]; then
    echo "找不到可执行的 Chrome: $CHROME_EXECUTABLE_PATH"
    exit 1
  fi
}

start_frontend_if_needed() {
  frontend="$1"
  base_url="$(base_url_for "$frontend")" || return 1
  port="$(port_for "$frontend")" || return 1
  workdir="$(dir_for "$frontend")" || return 1
  command="$(dev_command_for "$frontend")" || return 1

  STARTED_SERVER=0
  SERVER_PID=""

  if [ "$FORCE_RESTART_FRONTENDS" = "1" ]; then
    existing_pids="$(lsof -ti tcp:"$port" 2>/dev/null || true)"
    if [ -n "$existing_pids" ]; then
      for pid in $existing_pids; do
        kill "$pid" >/dev/null 2>&1 || true
      done
      sleep 2
    fi
  fi

  if curl -fsS "$base_url" >/dev/null 2>&1; then
    return 0
  fi

  log_file="/tmp/hellotime-${frontend}-dev.log"
  (
    cd "$workdir" &&
    nohup sh -c "$command" >"$log_file" 2>&1 &
    echo $!
  ) > /tmp/hellotime-"$frontend"-pid.tmp

  SERVER_PID="$(cat /tmp/hellotime-"$frontend"-pid.tmp)"
  rm -f /tmp/hellotime-"$frontend"-pid.tmp
  STARTED_SERVER=1

  if ! wait_for_url "$base_url"; then
    echo "  前端启动失败，日志: $log_file"
    return 1
  fi

  return 0
}

stop_frontend_if_started() {
  if [ "${STARTED_SERVER:-0}" -eq 1 ] && [ -n "${SERVER_PID:-}" ]; then
    kill "$SERVER_PID" >/dev/null 2>&1 || true
    wait "$SERVER_PID" >/dev/null 2>&1 || true
  fi
}

run_browser_verification() {
  frontend="$1"
  base_url="$(base_url_for "$frontend")" || return 1

  (
    cd "$VERIFICATION_DIR" &&
    FRONTEND_NAME="$frontend" \
    BASE_URL="$base_url" \
    BACKEND_URL="$BACKEND_URL" \
    ADMIN_PASSWORD="$ADMIN_PASSWORD" \
    CHROME_EXECUTABLE_PATH="$CHROME_EXECUTABLE_PATH" \
    npx playwright test tests/frontend-major-flows.spec.js
  )
}

ensure_backend_ready
ensure_playwright_ready

echo "=== HelloTime 前端浏览器验证 ==="
echo "验证对象: $SELECTED_FRONTENDS"
echo "后端地址: $BACKEND_URL"
echo ""

for frontend in $SELECTED_FRONTENDS; do
  label="$(label_for "$frontend")"

  if [ "$label" = "Unknown" ]; then
    echo "[未知实现] $frontend"
    append_summary "$frontend" "N/A" "N/A" "FAIL"
    FAILED_COUNT=$((FAILED_COUNT + 1))
    continue
  fi

  print_divider
  echo "[$label] 启动并检查前端服务"
  server_result="FAIL"
  browser_result="FAIL"
  overall_result="FAIL"

  if start_frontend_if_needed "$frontend"; then
    server_result="PASS"
    echo "  通过"
  else
    echo "  失败"
  fi

  if [ "$server_result" = "PASS" ]; then
    echo "[$label] 执行浏览器主流程验证"
    if run_browser_verification "$frontend"; then
      browser_result="PASS"
      overall_result="PASS"
      echo "  通过"
    else
      echo "  失败"
      FAILED_COUNT=$((FAILED_COUNT + 1))
    fi
  else
    FAILED_COUNT=$((FAILED_COUNT + 1))
  fi

  append_summary "$frontend" "$server_result" "$browser_result" "$overall_result"
  stop_frontend_if_started
done

echo ""
print_divider
echo "验证矩阵"
printf "%-12s %-10s %-10s %-10s\n" "实现" "服务就绪" "浏览器流" "总状态"
printf "%s" "$SUMMARY_LINES" | while IFS='|' read -r frontend server_result browser_result overall_result; do
  [ -z "$frontend" ] && continue
  printf "%-12s %-10s %-10s %-10s\n" "$frontend" "$server_result" "$browser_result" "$overall_result"
done

echo ""
if [ "$FAILED_COUNT" -gt 0 ]; then
  echo "浏览器验证失败: $FAILED_COUNT 个实现未通过"
  exit 1
fi

echo "浏览器验证通过"
