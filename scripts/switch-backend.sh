#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
PID_FILE="/tmp/hellotime-backend-proxy.pid"
META_FILE="/tmp/hellotime-backend-proxy.meta"
LOG_FILE="/tmp/hellotime-backend-proxy.log"

usage() {
  cat <<'EOF'
用法:
  ./scripts/switch-backend.sh spring-boot
  ./scripts/switch-backend.sh fastapi
  ./scripts/switch-backend.sh gin
  ./scripts/switch-backend.sh elysia
  ./scripts/switch-backend.sh nest
  ./scripts/switch-backend.sh aspnet-core
  ./scripts/switch-backend.sh 18010
  ./scripts/switch-backend.sh status
  ./scripts/switch-backend.sh stop

固定入口:
  前端始终访问 http://localhost:8080

后端默认端口:
  spring-boot -> 18000
  fastapi     -> 18010
  gin         -> 18020
  elysia      -> 18030
  nest        -> 18040
  aspnet-core -> 18050
EOF
}

resolve_target() {
  case "${1:-}" in
    spring|spring-boot) echo "spring-boot 18000" ;;
    fastapi) echo "fastapi 18010" ;;
    gin) echo "gin 18020" ;;
    elysia) echo "elysia 18030" ;;
    nest) echo "nest 18040" ;;
    aspnet-core|aspnet) echo "aspnet-core 18050" ;;
    ''|help|-h|--help) usage; exit 0 ;;
    *)
      if [[ "$1" =~ ^[0-9]+$ ]]; then
        echo "custom $1"
      else
        echo "未知后端: $1" >&2
        usage >&2
        exit 1
      fi
      ;;
  esac
}

is_running() {
  [[ -f "$PID_FILE" ]] || return 1
  local pid
  pid="$(cat "$PID_FILE")"
  kill -0 "$pid" 2>/dev/null
}

stop_proxy() {
  if is_running; then
    local pid
    pid="$(cat "$PID_FILE")"
    kill "$pid" 2>/dev/null || true
    wait "$pid" 2>/dev/null || true
    echo "已停止 8080 转发 (PID: $pid)"
  fi

  rm -f "$PID_FILE" "$META_FILE"
}

show_status() {
  if is_running && [[ -f "$META_FILE" ]]; then
    cat "$META_FILE"
  else
    echo "当前没有运行中的 8080 转发"
  fi
}

main() {
  local action="${1:-}"

  case "$action" in
    status)
      show_status
      exit 0
      ;;
    stop)
      stop_proxy
      exit 0
      ;;
  esac

  read -r target_name target_port <<<"$(resolve_target "$action")"

  stop_proxy

  nohup python3 "$SCRIPT_DIR/port_forward.py" \
    --listen-host 127.0.0.1 \
    --listen-port 8080 \
    --target-host 127.0.0.1 \
    --target-port "$target_port" \
    >"$LOG_FILE" 2>&1 &

  local proxy_pid=$!
  echo "$proxy_pid" > "$PID_FILE"
  cat > "$META_FILE" <<EOF
当前 8080 -> $target_name ($target_port)
PID: $proxy_pid
日志: $LOG_FILE
EOF

  sleep 1
  if ! kill -0 "$proxy_pid" 2>/dev/null; then
    echo "端口转发启动失败，请查看日志: $LOG_FILE" >&2
    rm -f "$PID_FILE" "$META_FILE"
    exit 1
  fi

  show_status
}

main "$@"
