#!/usr/bin/env bash
# switch-backend.sh — 薄封装，内部调用 dev-manager.py
set -euo pipefail
SCRIPT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"

action="${1:-status}"
case "$action" in
  stop)
    exec python3 "$SCRIPT_DIR/dev-manager.py" --stop-proxy
    ;;
  status)
    exec python3 "$SCRIPT_DIR/dev-manager.py" --status
    ;;
  *)
    exec python3 "$SCRIPT_DIR/dev-manager.py" --switch-proxy "$action"
    ;;
esac
