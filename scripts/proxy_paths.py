#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import os
import shlex
import tempfile
from pathlib import Path


PROXY_PID_FILENAME = "hellotime-backend-proxy.pid"
PROXY_META_FILENAME = "hellotime-backend-proxy.meta"
PROXY_LOG_FILENAME = "hellotime-backend-proxy.log"
PROXY_ERR_FILENAME = "hellotime-backend-proxy.err"


def get_proxy_runtime_dir() -> Path:
    return Path(tempfile.gettempdir()) if os.name == "nt" else Path("/tmp")


def build_proxy_paths() -> dict[str, str]:
    runtime_dir = get_proxy_runtime_dir()
    return {
        "PROXY_RUNTIME_DIR": str(runtime_dir),
        "PID_FILE": str(runtime_dir / PROXY_PID_FILENAME),
        "META_FILE": str(runtime_dir / PROXY_META_FILENAME),
        "LOG_FILE": str(runtime_dir / PROXY_LOG_FILENAME),
        "ERR_FILE": str(runtime_dir / PROXY_ERR_FILENAME),
    }


def to_shell_vars(paths: dict[str, str]) -> str:
    return "\n".join(f"{key}={shlex.quote(value)}" for key, value in paths.items())


def to_powershell_vars(paths: dict[str, str]) -> str:
    return "\n".join(f"${key} = {json.dumps(value, ensure_ascii=False)}" for key, value in paths.items())


def main() -> None:
    parser = argparse.ArgumentParser(description="HelloTime proxy runtime paths")
    parser.add_argument("--json", action="store_true", help="Print JSON object")
    parser.add_argument("--shell", action="store_true", help="Print sh-compatible assignments")
    parser.add_argument("--powershell", action="store_true", help="Print PowerShell assignments")
    args = parser.parse_args()

    paths = build_proxy_paths()
    if args.shell:
        print(to_shell_vars(paths))
        return
    if args.powershell:
        print(to_powershell_vars(paths))
        return

    print(json.dumps(paths, ensure_ascii=False))


if __name__ == "__main__":
    main()
