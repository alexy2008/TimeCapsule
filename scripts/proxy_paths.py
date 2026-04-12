#!/usr/bin/env python3
"""代理运行时路径配置。"""
from __future__ import annotations

import json
from pathlib import Path


PROXY_PID_FILENAME = "hellotime-backend-proxy.pid"
PROXY_META_FILENAME = "hellotime-backend-proxy.meta"
PROXY_LOG_FILENAME = "hellotime-backend-proxy.log"
PROXY_ERR_FILENAME = "hellotime-backend-proxy.err"

# 使用项目 .runtime 目录，而非系统临时目录，避免被系统清理
_PROXY_RUNTIME_DIR = Path(__file__).resolve().parent.parent / ".runtime" / "proxy"


def get_proxy_runtime_dir() -> Path:
    return _PROXY_RUNTIME_DIR


def build_proxy_paths() -> dict[str, str]:
    runtime_dir = get_proxy_runtime_dir()
    return {
        "PROXY_RUNTIME_DIR": str(runtime_dir),
        "PID_FILE": str(runtime_dir / PROXY_PID_FILENAME),
        "META_FILE": str(runtime_dir / PROXY_META_FILENAME),
        "LOG_FILE": str(runtime_dir / PROXY_LOG_FILENAME),
        "ERR_FILE": str(runtime_dir / PROXY_ERR_FILENAME),
    }


if __name__ == "__main__":
    print(json.dumps(build_proxy_paths(), ensure_ascii=False))
