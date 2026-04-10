#!/bin/bash
# 后端共享契约验证脚本
# 兼容 macOS 默认 Bash 3.x

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(dirname "$(dirname "$SCRIPT_DIR")")"
ADMIN_PASSWORD="${ADMIN_PASSWORD:-timecapsule-admin}"
SAFE_PATH="/usr/bin:/bin:/usr/sbin:/sbin"

if [ "$#" -eq 0 ]; then
  SELECTED_BACKENDS="spring-boot fastapi gin elysia nest aspnet-core"
else
  SELECTED_BACKENDS="$*"
fi

FAILED_COUNT=0
SUMMARY_LINES=""

print_divider() {
  echo "------------------------------------------------------------"
}

label_for() {
  case "$1" in
    spring-boot) echo "Spring Boot" ;;
    fastapi) echo "FastAPI" ;;
    gin) echo "Gin" ;;
    elysia) echo "Elysia" ;;
    nest) echo "NestJS" ;;
    aspnet-core) echo "ASP.NET Core" ;;
    *) echo "Unknown" ;;
  esac
}

dir_for() {
  case "$1" in
    spring-boot) echo "$ROOT_DIR/backends/spring-boot" ;;
    fastapi) echo "$ROOT_DIR/backends/fastapi" ;;
    gin) echo "$ROOT_DIR/backends/gin" ;;
    elysia) echo "$ROOT_DIR/backends/elysia" ;;
    nest) echo "$ROOT_DIR/backends/nest" ;;
    aspnet-core) echo "$ROOT_DIR/backends/aspnet-core" ;;
    *) return 1 ;;
  esac
}

base_url_for() {
  case "$1" in
    spring-boot) echo "http://127.0.0.1:18000" ;;
    fastapi) echo "http://127.0.0.1:18010" ;;
    gin) echo "http://127.0.0.1:18020" ;;
    elysia) echo "http://127.0.0.1:18030" ;;
    nest) echo "http://127.0.0.1:18040" ;;
    aspnet-core) echo "http://127.0.0.1:18050" ;;
    *) return 1 ;;
  esac
}

port_for() {
  case "$1" in
    spring-boot) echo "18000" ;;
    fastapi) echo "18010" ;;
    gin) echo "18020" ;;
    elysia) echo "18030" ;;
    nest) echo "18040" ;;
    aspnet-core) echo "18050" ;;
    *) return 1 ;;
  esac
}

run_command_for() {
  case "$1" in
    spring-boot) echo "./run" ;;
    fastapi) echo "./run" ;;
    gin) echo "./run" ;;
    elysia) echo "./run" ;;
    nest) echo "./run" ;;
    aspnet-core) echo "./run" ;;
    *) return 1 ;;
  esac
}

append_summary() {
  backend="$1"
  server_result="$2"
  contract_result="$3"
  overall_result="$4"
  SUMMARY_LINES="${SUMMARY_LINES}${backend}|${server_result}|${contract_result}|${overall_result}
"
}

wait_for_url() {
  url="$1"
  retries="${2:-90}"

  while [ "$retries" -gt 0 ]; do
    if curl -fsS "$url" >/dev/null 2>&1; then
      return 0
    fi
    sleep 1
    retries=$((retries - 1))
  done

  return 1
}

ensure_dependencies_ready() {
  if ! command -v curl >/dev/null 2>&1; then
    echo "缺少 curl，请先安装。"
    exit 1
  fi

  if ! command -v python3 >/dev/null 2>&1; then
    echo "缺少 python3，请先安装。"
    exit 1
  fi
}

start_backend_if_needed() {
  backend="$1"
  base_url="$(base_url_for "$backend")" || return 1
  workdir="$(dir_for "$backend")" || return 1
  command="$(run_command_for "$backend")" || return 1
  port="$(port_for "$backend")" || return 1

  STARTED_BACKEND=0
  STARTED_BACKEND_PID=""
  STARTED_BACKEND_PORT="$port"

  if curl -fsS "$base_url/api/v1/health" >/dev/null 2>&1; then
    return 0
  fi

  log_file="/tmp/hellotime-${backend}-verify.log"
  (
    cd "$workdir" &&
    nohup sh -c "$command" >"$log_file" 2>&1 &
    echo $!
  ) > /tmp/hellotime-"$backend"-verify.pid.tmp

  STARTED_BACKEND_PID="$(cat /tmp/hellotime-"$backend"-verify.pid.tmp)"
  rm -f /tmp/hellotime-"$backend"-verify.pid.tmp
  STARTED_BACKEND=1

  if ! wait_for_url "$base_url/api/v1/health" 120; then
    echo "  后端启动失败，日志: $log_file"
    return 1
  fi

  return 0
}

stop_backend_if_started() {
  if [ "${STARTED_BACKEND:-0}" -ne 1 ]; then
    return 0
  fi

  if [ -n "${STARTED_BACKEND_PORT:-}" ]; then
    lsof -tiTCP:"$STARTED_BACKEND_PORT" -sTCP:LISTEN 2>/dev/null | while read -r pid; do
      [ -z "$pid" ] && continue
      kill "$pid" >/dev/null 2>&1 || true
    done
  fi

  if [ -n "${STARTED_BACKEND_PID:-}" ]; then
    kill "$STARTED_BACKEND_PID" >/dev/null 2>&1 || true
    wait "$STARTED_BACKEND_PID" >/dev/null 2>&1 || true
  fi
}

api_request() {
  local method="$1"
  local url="$2"
  local body="${3:-}"
  local token="${4:-}"

  response_file="$(mktemp)"

  if [ -n "$body" ] && [ -n "$token" ]; then
    RESPONSE_STATUS="$(curl -sS -o "$response_file" -w "%{http_code}" -X "$method" "$url" -H "Content-Type: application/json" -H "Authorization: Bearer $token" --data "$body")"
  elif [ -n "$body" ]; then
    RESPONSE_STATUS="$(curl -sS -o "$response_file" -w "%{http_code}" -X "$method" "$url" -H "Content-Type: application/json" --data "$body")"
  elif [ -n "$token" ]; then
    RESPONSE_STATUS="$(curl -sS -o "$response_file" -w "%{http_code}" -X "$method" "$url" -H "Authorization: Bearer $token")"
  else
    RESPONSE_STATUS="$(curl -sS -o "$response_file" -w "%{http_code}" -X "$method" "$url")"
  fi

  RESPONSE_BODY="$(cat "$response_file")"
  rm -f "$response_file"
}

json_assert() {
  body="$1"
  code="$2"

  printf "%s" "$body" | python3 -c "
import json, sys
try:
    j = json.load(sys.stdin)
    ok = ${code}
    sys.exit(0 if ok else 1)
except:
    sys.exit(1)
" 2>/dev/null
}

json_extract() {
  body="$1"
  code="$2"

  printf "%s" "$body" | python3 -c "
import json, sys
try:
    j = json.load(sys.stdin)
    value = (${code})
    if value is None:
        sys.exit(1)
    print(value)
except:
    sys.exit(1)
" 2>/dev/null
}

iso_time_after_seconds() {
  seconds="$1"
  python3 -c "from datetime import datetime, timedelta, timezone; print((datetime.now(timezone.utc) + timedelta(seconds=${seconds})).isoformat().replace('+00:00','Z'))" 2>/dev/null
}

run_contract_checks() {
  backend="$1"
  base_url="$(base_url_for "$backend")" || return 1

  echo "[$(label_for "$backend")] 健康检查"
  api_request "GET" "$base_url/api/v1/health"
  [ "$RESPONSE_STATUS" = "200" ] || { echo "  健康检查状态码错误: $RESPONSE_STATUS"; return 1; }
  json_assert "$RESPONSE_BODY" 'j["success"] == true && j["data"]["status"] == "UP" && j["data"]["techStack"].is_a?(Hash)' || {
    echo "  健康检查响应结构错误"
    return 1
  }
  echo "  通过"

  echo "[$(label_for "$backend")] 创建未来胶囊并验证锁定态"
  future_title="Verify-${backend}-future-$(date +%s)"
  future_content="future-content-${backend}-$(date +%s)"
  future_open_at="$(iso_time_after_seconds 90)"
  create_future_body="{\"title\":\"${future_title}\",\"content\":\"${future_content}\",\"creator\":\"Verifier\",\"openAt\":\"${future_open_at}\"}"
  api_request "POST" "$base_url/api/v1/capsules" "$create_future_body"
  [ "$RESPONSE_STATUS" = "201" ] || { echo "  创建未来胶囊失败: $RESPONSE_STATUS"; return 1; }
  json_assert "$RESPONSE_BODY" 'j["success"] == true && j["data"]["code"].to_s.length == 8 && j["data"]["title"] == "'"${future_title}"'"' || {
    echo "  创建未来胶囊响应结构错误"
    return 1
  }
  future_code="$(json_extract "$RESPONSE_BODY" 'j["data"]["code"]')" || {
    echo "  无法读取未来胶囊 code"
    return 1
  }

  api_request "GET" "$base_url/api/v1/capsules/$future_code"
  [ "$RESPONSE_STATUS" = "200" ] || { echo "  查询未来胶囊失败: $RESPONSE_STATUS"; return 1; }
  json_assert "$RESPONSE_BODY" 'j["success"] == true && j["data"]["opened"] == false && (!j["data"].key?("content") || j["data"]["content"].nil?)' || {
    echo "  未来胶囊未正确隐藏内容"
    return 1
  }
  echo "  通过"

  echo "[$(label_for "$backend")] 查询不存在的胶囊"
  api_request "GET" "$base_url/api/v1/capsules/NONEXIST"
  [ "$RESPONSE_STATUS" = "404" ] || { echo "  不存在胶囊状态码错误: $RESPONSE_STATUS"; return 1; }
  json_assert "$RESPONSE_BODY" 'j["success"] == false && j["errorCode"] == "CAPSULE_NOT_FOUND"' || {
    echo "  不存在胶囊错误码错误"
    return 1
  }
  echo "  通过"

  echo "[$(label_for "$backend")] 过去时间应被拒绝"
  past_open_at="$(iso_time_after_seconds -90)"
  past_body="{\"title\":\"Past-${backend}\",\"content\":\"past-content\",\"creator\":\"Verifier\",\"openAt\":\"${past_open_at}\"}"
  api_request "POST" "$base_url/api/v1/capsules" "$past_body"
  [ "$RESPONSE_STATUS" = "400" ] || { echo "  过去时间状态码错误: $RESPONSE_STATUS"; return 1; }
  json_assert "$RESPONSE_BODY" 'j["success"] == false' || {
    echo "  过去时间未返回统一错误结构"
    return 1
  }
  echo "  通过"

  echo "[$(label_for "$backend")] 到时间后应公开内容"
  opened_title="Verify-${backend}-opened-$(date +%s)"
  opened_content="opened-content-${backend}-$(date +%s)"
  opened_open_at="$(iso_time_after_seconds 2)"
  opened_body="{\"title\":\"${opened_title}\",\"content\":\"${opened_content}\",\"creator\":\"Verifier\",\"openAt\":\"${opened_open_at}\"}"
  api_request "POST" "$base_url/api/v1/capsules" "$opened_body"
  [ "$RESPONSE_STATUS" = "201" ] || { echo "  创建短时胶囊失败: $RESPONSE_STATUS"; return 1; }
  opened_code="$(json_extract "$RESPONSE_BODY" 'j["data"]["code"]')" || {
    echo "  无法读取短时胶囊 code"
    return 1
  }
  sleep 3
  api_request "GET" "$base_url/api/v1/capsules/$opened_code"
  [ "$RESPONSE_STATUS" = "200" ] || { echo "  查询已开启胶囊失败: $RESPONSE_STATUS"; return 1; }
  json_assert "$RESPONSE_BODY" 'j["success"] == true && j["data"]["opened"] == true && j["data"]["content"] == "'"${opened_content}"'"' || {
    echo "  已开启胶囊未公开内容"
    return 1
  }
  echo "  通过"

  echo "[$(label_for "$backend")] 管理员登录与鉴权"
  login_body="{\"password\":\"${ADMIN_PASSWORD}\"}"
  api_request "POST" "$base_url/api/v1/admin/login" "$login_body"
  [ "$RESPONSE_STATUS" = "200" ] || { echo "  管理员正确密码登录失败: $RESPONSE_STATUS"; return 1; }
  token="$(json_extract "$RESPONSE_BODY" 'j["data"]["token"]')" || {
    echo "  无法读取管理员 token"
    return 1
  }

  wrong_login_body='{"password":"wrong-password"}'
  api_request "POST" "$base_url/api/v1/admin/login" "$wrong_login_body"
  [ "$RESPONSE_STATUS" = "401" ] || { echo "  错误密码状态码错误: $RESPONSE_STATUS"; return 1; }
  json_assert "$RESPONSE_BODY" 'j["success"] == false && j["errorCode"] == "UNAUTHORIZED"' || {
    echo "  错误密码错误码错误"
    return 1
  }

  api_request "GET" "$base_url/api/v1/admin/capsules?page=0&size=20"
  case "$RESPONSE_STATUS" in
    400|401|422) ;;
    *)
      echo "  无 token 列表接口状态码错误: $RESPONSE_STATUS"
      return 1
      ;;
  esac
  echo "  通过"

  echo "[$(label_for "$backend")] 管理员列表与删除"
  api_request "GET" "$base_url/api/v1/admin/capsules?page=0&size=20" "" "$token"
  [ "$RESPONSE_STATUS" = "200" ] || { echo "  管理员列表失败: $RESPONSE_STATUS"; return 1; }
  json_assert "$RESPONSE_BODY" 'j["success"] == true && j["data"]["content"].is_a?(Array) && !j["data"]["totalElements"].nil? && !j["data"]["totalPages"].nil?' || {
    echo "  管理员列表分页结构错误"
    return 1
  }
  json_assert "$RESPONSE_BODY" '
    item = j["data"]["content"].find { |capsule| capsule["code"] == "'"${future_code}"'" }
    !item.nil? && item["content"] == "'"${future_content}"'"
  ' || {
    echo "  管理员列表未返回完整内容"
    return 1
  }

  api_request "DELETE" "$base_url/api/v1/admin/capsules/$opened_code"
  [ "$RESPONSE_STATUS" = "401" ] || { echo "  无 token 删除状态码错误: $RESPONSE_STATUS"; return 1; }

  api_request "DELETE" "$base_url/api/v1/admin/capsules/$opened_code" "" "$token"
  [ "$RESPONSE_STATUS" = "200" ] || { echo "  管理员删除失败: $RESPONSE_STATUS"; return 1; }
  json_assert "$RESPONSE_BODY" 'j["success"] == true' || {
    echo "  管理员删除未返回 success=true"
    return 1
  }

  api_request "GET" "$base_url/api/v1/capsules/$opened_code"
  [ "$RESPONSE_STATUS" = "404" ] || { echo "  删除后仍可查询胶囊: $RESPONSE_STATUS"; return 1; }

  api_request "DELETE" "$base_url/api/v1/admin/capsules/NOTEXIST" "" "$token"
  [ "$RESPONSE_STATUS" = "404" ] || { echo "  删除不存在胶囊状态码错误: $RESPONSE_STATUS"; return 1; }
  json_assert "$RESPONSE_BODY" 'j["success"] == false && j["errorCode"] == "CAPSULE_NOT_FOUND"' || {
    echo "  删除不存在胶囊错误码错误"
    return 1
  }
  echo "  通过"

  return 0
}

ensure_dependencies_ready

echo "=== HelloTime 后端共享契约验证 ==="
echo "验证对象: $SELECTED_BACKENDS"
echo ""

for backend in $SELECTED_BACKENDS; do
  label="$(label_for "$backend")"

  if [ "$label" = "Unknown" ]; then
    echo "[未知实现] $backend"
    append_summary "$backend" "N/A" "N/A" "FAIL"
    FAILED_COUNT=$((FAILED_COUNT + 1))
    continue
  fi

  print_divider
  echo "[$label] 启动并检查后端服务"
  server_result="FAIL"
  contract_result="FAIL"
  overall_result="FAIL"

  if start_backend_if_needed "$backend"; then
    server_result="PASS"
    echo "  通过"
  else
    echo "  失败"
  fi

  if [ "$server_result" = "PASS" ]; then
    echo "[$label] 执行共享契约验证"
    if run_contract_checks "$backend"; then
      contract_result="PASS"
      overall_result="PASS"
      echo "[$label] 契约验证通过"
    else
      echo "[$label] 契约验证失败"
      FAILED_COUNT=$((FAILED_COUNT + 1))
    fi
  else
    FAILED_COUNT=$((FAILED_COUNT + 1))
  fi

  append_summary "$backend" "$server_result" "$contract_result" "$overall_result"
  stop_backend_if_started
done

echo ""
print_divider
echo "验证矩阵"
printf "%-14s %-10s %-10s %-10s\n" "实现" "服务就绪" "契约检查" "总状态"
printf "%s" "$SUMMARY_LINES" | while IFS='|' read -r backend server_result contract_result overall_result; do
  [ -z "$backend" ] && continue
  printf "%-14s %-10s %-10s %-10s\n" "$backend" "$server_result" "$contract_result" "$overall_result"
done

echo ""
if [ "$FAILED_COUNT" -gt 0 ]; then
  echo "后端契约验证失败: $FAILED_COUNT 个实现未通过"
  exit 1
fi

echo "后端契约验证通过"
