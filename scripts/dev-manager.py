#!/usr/bin/env python3
"""
HelloTime 本地开发服务管理工具。

功能：
1. 展示所有前后端服务的运行状态、PID、监听端口、日志路径。
2. 启动、停止、重启单个服务或全部服务。
3. 显示并切换 localhost:8080 到不同后端的映射关系。
"""

from __future__ import annotations

import argparse
import json
import os
import signal
import socket
import subprocess
import time
import webbrowser
from dataclasses import dataclass
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.parse import parse_qs, urlparse
from urllib.request import Request, urlopen

from proxy_paths import build_proxy_paths

ROOT_DIR = Path(__file__).resolve().parent.parent
RUNTIME_DIR = ROOT_DIR / ".runtime" / "dev-manager"
PID_DIR = RUNTIME_DIR / "pids"
LOG_DIR = RUNTIME_DIR / "logs"
SWITCH_SCRIPT = ROOT_DIR / "scripts" / "switch-backend.sh"
SWITCH_SCRIPT_WINDOWS = ROOT_DIR / "scripts" / "switch-backend.ps1"
WEB_UI_FILE = ROOT_DIR / "scripts" / "dev-manager-web.html"
ASSETS_DIR = ROOT_DIR / "scripts" / "dev-manager-assets"
PROXY_PATHS = build_proxy_paths()
PROXY_RUNTIME_DIR = Path(PROXY_PATHS["PROXY_RUNTIME_DIR"])
PROXY_META_FILE = Path(PROXY_PATHS["META_FILE"])
PROXY_LOG_FILE = Path(PROXY_PATHS["LOG_FILE"])
PROXY_ERR_FILE = Path(PROXY_PATHS["ERR_FILE"])
PROXY_ACTIVITY_LOG = LOG_DIR / "proxy-switch.log"


@dataclass(frozen=True)
class Service:
    key: str
    label: str
    kind: str
    workdir: Path
    command: list[str]
    port: int

    @property
    def pid_file(self) -> Path:
        return PID_DIR / f"{self.key}.pid"

    @property
    def log_file(self) -> Path:
        return LOG_DIR / f"{self.key}.log"

    @property
    def url(self) -> str:
        return f"http://localhost:{self.port}"

    @property
    def posix_run_script(self) -> Path:
        return self.workdir / "run"

    @property
    def windows_run_script(self) -> Path:
        return self.workdir / "run.ps1"


SERVICES: list[Service] = [
    Service(
        key="spring-boot",
        label="Spring Boot",
        kind="backend",
        workdir=ROOT_DIR / "backends" / "spring-boot",
        command=["bash", str(ROOT_DIR / "backends" / "spring-boot" / "run")],
        port=18000,
    ),
    Service(
        key="fastapi",
        label="FastAPI",
        kind="backend",
        workdir=ROOT_DIR / "backends" / "fastapi",
        command=["bash", str(ROOT_DIR / "backends" / "fastapi" / "run")],
        port=18010,
    ),
    Service(
        key="gin",
        label="Gin",
        kind="backend",
        workdir=ROOT_DIR / "backends" / "gin",
        command=["bash", str(ROOT_DIR / "backends" / "gin" / "run")],
        port=18020,
    ),
    Service(
        key="elysia",
        label="Elysia",
        kind="backend",
        workdir=ROOT_DIR / "backends" / "elysia",
        command=["bash", str(ROOT_DIR / "backends" / "elysia" / "run")],
        port=18030,
    ),
    Service(
        key="nest",
        label="NestJS",
        kind="backend",
        workdir=ROOT_DIR / "backends" / "nest",
        command=["bash", str(ROOT_DIR / "backends" / "nest" / "run")],
        port=18040,
    ),
    Service(
        key="aspnet-core",
        label="ASP.NET Core",
        kind="backend",
        workdir=ROOT_DIR / "backends" / "aspnet-core",
        command=["bash", str(ROOT_DIR / "backends" / "aspnet-core" / "run")],
        port=18050,
    ),
    Service(
        key="vapor",
        label="Vapor",
        kind="backend",
        workdir=ROOT_DIR / "backends" / "vapor",
        command=["bash", str(ROOT_DIR / "backends" / "vapor" / "run")],
        port=18060,
    ),
    Service(
        key="axum",
        label="Axum",
        kind="backend",
        workdir=ROOT_DIR / "backends" / "axum",
        command=["bash", str(ROOT_DIR / "backends" / "axum" / "run")],
        port=18070,
    ),
    Service(
        key="drogon",
        label="Drogon",
        kind="backend",
        workdir=ROOT_DIR / "backends" / "drogon",
        command=["bash", str(ROOT_DIR / "backends" / "drogon" / "run")],
        port=18080,
    ),
    Service(
        key="vue3",
        label="Vue 3",
        kind="frontend",
        workdir=ROOT_DIR / "frontends" / "vue3-ts",
        command=["bash", str(ROOT_DIR / "frontends" / "vue3-ts" / "run")],
        port=5173,
    ),
    Service(
        key="react",
        label="React",
        kind="frontend",
        workdir=ROOT_DIR / "frontends" / "react-ts",
        command=["bash", str(ROOT_DIR / "frontends" / "react-ts" / "run")],
        port=5174,
    ),
    Service(
        key="angular",
        label="Angular",
        kind="frontend",
        workdir=ROOT_DIR / "frontends" / "angular-ts",
        command=["bash", str(ROOT_DIR / "frontends" / "angular-ts" / "run")],
        port=5175,
    ),
    Service(
        key="svelte",
        label="Svelte",
        kind="frontend",
        workdir=ROOT_DIR / "frontends" / "svelte-ts",
        command=["bash", str(ROOT_DIR / "frontends" / "svelte-ts" / "run")],
        port=5176,
    ),
    Service(
        key="solid",
        label="SolidJS",
        kind="frontend",
        workdir=ROOT_DIR / "frontends" / "solid-ts",
        command=["bash", str(ROOT_DIR / "frontends" / "solid-ts" / "run")],
        port=5180,
    ),
    Service(
        key="next",
        label="Next.js",
        kind="fullstack",
        workdir=ROOT_DIR / "fullstacks" / "next-ts",
        command=["bash", str(ROOT_DIR / "fullstacks" / "next-ts" / "run")],
        port=5177,
    ),
    Service(
        key="nuxt",
        label="Nuxt",
        kind="fullstack",
        workdir=ROOT_DIR / "fullstacks" / "nuxt-ts",
        command=["bash", str(ROOT_DIR / "fullstacks" / "nuxt-ts" / "run")],
        port=5178,
    ),
    Service(
        key="spring-mvc",
        label="Spring MVC",
        kind="fullstack",
        workdir=ROOT_DIR / "fullstacks" / "spring-boot-mvc",
        command=["bash", str(ROOT_DIR / "fullstacks" / "spring-boot-mvc" / "run")],
        port=4179,
    ),
    Service(
        key="tauri",
        label="Tauri 桌面",
        kind="desktop",
        workdir=ROOT_DIR / "desktop" / "tauri",
        command=["bash", str(ROOT_DIR / "desktop" / "tauri" / "run")],
        port=1420,
    ),
    Service(
        key="macos-swiftui",
        label="macOS 原生",
        kind="desktop",
        workdir=ROOT_DIR / "desktop" / "macos-swiftui",
        command=["bash", str(ROOT_DIR / "desktop" / "macos-swiftui" / "run")],
        port=0,
    ),
]

def ensure_runtime_dirs() -> None:
    PID_DIR.mkdir(parents=True, exist_ok=True)
    LOG_DIR.mkdir(parents=True, exist_ok=True)


def get_service_command(service: Service) -> list[str]:
    if os.name == "nt":
        if service.windows_run_script.exists():
            return [
                "powershell",
                "-NoProfile",
                "-ExecutionPolicy",
                "Bypass",
                "-File",
                str(service.windows_run_script),
            ]
        if service.posix_run_script.exists():
            return ["bash", str(service.posix_run_script)]
        raise FileNotFoundError(f"Missing Windows start command for {service.label}: {service.windows_run_script}")

    return service.command


def is_port_open(port: int) -> bool:
    if port <= 0:
        return False

    candidates = [
        ("127.0.0.1", socket.AF_INET),
        ("::1", socket.AF_INET6),
        ("localhost", socket.AF_UNSPEC),
    ]

    for host, family in candidates:
        try:
            addresses = socket.getaddrinfo(host, port, family, socket.SOCK_STREAM)
        except socket.gaierror:
            continue

        for address_family, socktype, proto, _, sockaddr in addresses:
            try:
                with socket.socket(address_family, socktype, proto) as sock:
                    sock.settimeout(0.25)
                    if sock.connect_ex(sockaddr) == 0:
                        return True
            except OSError:
                continue

    return False


def get_listening_pids(port: int) -> list[int]:
    if port <= 0:
        return []

    if os.name == "nt":
        result = subprocess.run(
            ["netstat", "-ano", "-p", "tcp"],
            text=True,
            capture_output=True,
            check=False,
        )
        if result.returncode != 0:
            return []

        pids: list[int] = []
        suffixes = (f":{port}", f".{port}")
        for raw_line in result.stdout.splitlines():
            line = raw_line.strip()
            if not line.startswith("TCP"):
                continue
            parts = line.split()
            if len(parts) < 5:
                continue
            local_address, state, pid_str = parts[1], parts[3].upper(), parts[4]
            if state != "LISTENING" or not local_address.endswith(suffixes):
                continue
            try:
                pids.append(int(pid_str))
            except ValueError:
                continue
        return sorted(set(pids))

    try:
        result = subprocess.run(
            ["lsof", f"-tiTCP:{port}", "-sTCP:LISTEN"],
            text=True,
            capture_output=True,
            check=False,
        )
    except FileNotFoundError:
        return []
    if result.returncode not in {0, 1}:
        return []

    pids: list[int] = []
    for line in result.stdout.splitlines():
        line = line.strip()
        if not line:
            continue
        try:
            pids.append(int(line))
        except ValueError:
            continue
    return sorted(set(pids))


def read_pid(pid_file: Path) -> int | None:
    if not pid_file.exists():
        return None

    try:
        return int(pid_file.read_text().strip())
    except ValueError:
        pid_file.unlink(missing_ok=True)
        return None


def is_pid_alive(pid: int | None) -> bool:
    if pid is None:
        return False

    if os.name == "nt":
        result = subprocess.run(
            ["tasklist", "/FI", f"PID eq {pid}", "/FO", "CSV", "/NH"],
            text=True,
            capture_output=True,
            check=False,
        )
        if result.returncode != 0:
            return False
        output = result.stdout.strip()
        return bool(output) and not output.startswith("INFO:")

    try:
        os.kill(pid, 0)
    except OSError:
        return False
    return True


def cleanup_stale_pid(service: Service) -> None:
    pid = read_pid(service.pid_file)
    if pid is not None and not is_pid_alive(pid):
        service.pid_file.unlink(missing_ok=True)


def get_service_status(service: Service) -> dict[str, str]:
    cleanup_stale_pid(service)
    pid = read_pid(service.pid_file)
    alive = is_pid_alive(pid)
    listener_pids = get_listening_pids(service.port)
    port_open = is_port_open(service.port) or bool(listener_pids)

    display_pid = "-"
    if alive and pid is not None:
        display_pid = str(pid)
    elif listener_pids:
        display_pid = ",".join(str(item) for item in listener_pids)

    if port_open and (alive or listener_pids):
        status = "运行中"
    elif alive:
        status = "启动中"
    elif port_open:
        status = "端口占用"
    else:
        status = "已停止"

    return {
        "status": status,
        "pid": display_pid,
        "port_open": "yes" if port_open else "no",
        "url": service.url,
    }


def start_service(service: Service) -> str:
    ensure_runtime_dirs()
    status = get_service_status(service)
    if status["status"] in {"运行中", "启动中"}:
        return f"{service.label} 已处于{status['status']}状态。"

    log_handle = service.log_file.open("ab")
    try:
        command = get_service_command(service)
    except FileNotFoundError as exc:
        log_handle.close()
        return str(exc)

    popen_kwargs: dict[str, Any] = {
        "cwd": service.workdir,
        "stdout": log_handle,
        "stderr": subprocess.STDOUT,
        "stdin": subprocess.DEVNULL,
    }
    if os.name == "nt":
        creationflags = 0
        creationflags |= getattr(subprocess, "CREATE_NEW_PROCESS_GROUP", 0)
        creationflags |= getattr(subprocess, "DETACHED_PROCESS", 0)
        popen_kwargs["creationflags"] = creationflags
    else:
        popen_kwargs["start_new_session"] = True

    try:
        process = subprocess.Popen(command, **popen_kwargs)
    except OSError as exc:
        log_handle.close()
        return f"{service.label} 启动失败: {exc}"
    service.pid_file.write_text(f"{process.pid}\n")

    for _ in range(20):
        if not is_pid_alive(process.pid):
            break
        if is_port_open(service.port):
            listener_pids = get_listening_pids(service.port)
            if listener_pids:
                service.pid_file.write_text(f"{listener_pids[0]}\n")
            return f"{service.label} 已启动，监听 {service.port}。"
        time.sleep(0.5)

    if is_pid_alive(process.pid):
        return f"{service.label} 已发起启动，端口 {service.port} 可能仍在初始化。"

    service.pid_file.unlink(missing_ok=True)
    return f"{service.label} 启动失败，请检查日志 {service.log_file}。"


def terminate_pid(pid: int, *, use_group: bool) -> None:
    if os.name == "nt":
        command = ["taskkill", "/PID", str(pid)]
        if use_group:
            command.append("/T")
        subprocess.run(command, text=True, capture_output=True, check=False)
        return
    if use_group:
        try:
            os.killpg(pid, signal.SIGTERM)
            return
        except OSError:
            pass
    os.kill(pid, signal.SIGTERM)


def force_kill_pid(pid: int, *, use_group: bool) -> None:
    if os.name == "nt":
        command = ["taskkill", "/PID", str(pid), "/F"]
        if use_group:
            command.append("/T")
        subprocess.run(command, text=True, capture_output=True, check=False)
        return
    if use_group:
        try:
            os.killpg(pid, signal.SIGKILL)
            return
        except OSError:
            pass
    os.kill(pid, signal.SIGKILL)


def stop_service(service: Service) -> str:
    pid = read_pid(service.pid_file)
    managed_pid_alive = is_pid_alive(pid)
    listener_pids = get_listening_pids(service.port)

    if not managed_pid_alive and not listener_pids:
        service.pid_file.unlink(missing_ok=True)
        return f"{service.label} 当前未运行。"

    targets: list[tuple[int, bool]] = []
    seen: set[int] = set()

    if managed_pid_alive and pid is not None:
        targets.append((pid, True))
        seen.add(pid)

    for listener_pid in listener_pids:
        if listener_pid not in seen:
            targets.append((listener_pid, False))
            seen.add(listener_pid)

    for target_pid, use_group in targets:
        try:
            terminate_pid(target_pid, use_group=use_group)
        except OSError:
            continue

    for _ in range(20):
        managed_alive_now = is_pid_alive(pid) if pid is not None else False
        if not managed_alive_now and not get_listening_pids(service.port):
            service.pid_file.unlink(missing_ok=True)
            return f"{service.label} 已停止。"
        time.sleep(0.25)

    for target_pid, use_group in targets:
        try:
            force_kill_pid(target_pid, use_group=use_group)
        except OSError:
            continue
    service.pid_file.unlink(missing_ok=True)
    return f"{service.label} 已强制停止。"


def restart_service(service: Service) -> str:
    stop_msg = stop_service(service)
    start_msg = start_service(service)
    return f"{stop_msg} {start_msg}"


def start_all() -> list[str]:
    messages: list[str] = []
    for service in SERVICES:
        messages.append(start_service(service))
    return messages


def stop_all() -> list[str]:
    messages: list[str] = []
    for service in reversed(SERVICES):
        messages.append(stop_service(service))
    return messages


def restart_all() -> list[str]:
    return stop_all() + start_all()


def get_proxy_mapping() -> str:
    if PROXY_META_FILE.exists():
        return PROXY_META_FILE.read_text().strip()
    return "当前没有运行中的 8080 转发"


def append_proxy_activity(message: str) -> None:
    ensure_runtime_dirs()
    timestamp = time.strftime("%Y-%m-%dT%H:%M:%S")
    with PROXY_ACTIVITY_LOG.open("a", encoding="utf-8") as handle:
        handle.write(f"{timestamp} INFO {message}\n")


def switch_proxy(target: str) -> str:
    if os.name == "nt":
        command = [
            "powershell",
            "-NoProfile",
            "-ExecutionPolicy",
            "Bypass",
            "-File",
            str(SWITCH_SCRIPT_WINDOWS),
            target,
        ]
    else:
        command = ["bash", str(SWITCH_SCRIPT), target]

    result = subprocess.run(command, cwd=ROOT_DIR, text=True, capture_output=True)
    output = (result.stdout or "") + (result.stderr or "")
    action = "停止 8080 转发" if target == "stop" else f"切换 8080 转发到 {target}"
    summary = output.strip() or f"{action}完成"
    append_proxy_activity(f"{action} | {summary.replace(chr(10), ' | ')}")
    return output.strip() or f"切换完成，目标 {target}"


def maybe_open_browser(host: str, port: int) -> None:
    url = f"http://{host}:{port}"
    try:
        opened = webbrowser.open(url)
    except Exception:
        opened = False
    if not opened:
        print(f"请手动打开: {url}")


def tail_log(service: Service, lines: int = 20) -> str:
    if not service.log_file.exists():
        return f"{service.label} 还没有日志文件。"

    content = service.log_file.read_text(errors="replace").splitlines()
    if not content:
        return "(日志为空)"
    # 使用显式切片以满足部分 Linter 要求
    last_lines = content[-lines:] if lines > 0 else []
    return "\n".join(last_lines)


def tail_proxy_logs(lines: int = 20) -> str:
    entries: list[str] = []
    if PROXY_ACTIVITY_LOG.exists():
        entries.extend(PROXY_ACTIVITY_LOG.read_text(errors="replace").splitlines())

    if os.name == "nt":
        proxy_process_files = [PROXY_LOG_FILE, PROXY_ERR_FILE]
    else:
        proxy_process_files = [PROXY_LOG_FILE]

    for path in proxy_process_files:
        if not path.exists():
            continue
        file_lines = path.read_text(errors="replace").splitlines()
        if not file_lines:
            continue
        entries.append(f"--- {path.name} ---")
        entries.extend(file_lines)

    if not entries:
        return "8080 转发还没有日志。"

    last_lines = entries[-lines:] if lines > 0 else []
    return "\n".join(last_lines)


def serialize_service(service: Service) -> dict[str, Any]:
    info = get_service_status(service)
    return {
        "key": service.key,
        "label": service.label,
        "kind": service.kind,
        "port": service.port,
        "url": service.url,
        "status": info["status"],
        "pid": info["pid"],
        "portOpen": info["port_open"] == "yes",
        "logFile": str(service.log_file),
    }


def build_snapshot() -> dict[str, Any]:
    return {
        "services": [serialize_service(service) for service in SERVICES],
        "proxyMapping": get_proxy_mapping(),
        "generatedAt": int(time.time()),
    }


def find_service(key: str) -> Service | None:
    for service in SERVICES:
        if service.key == key:
            return service
    return None


def read_web_ui() -> str:
    if WEB_UI_FILE.exists():
        return WEB_UI_FILE.read_text(encoding="utf-8")
    return "<!doctype html><meta charset='utf-8'><title>HelloTime</title><h1>Web UI 文件缺失</h1>"


def check_service_health(service: Service) -> dict[str, Any]:
    if service.kind != "backend":
        return {"ok": False, "message": "仅后端服务支持健康检查"}

    url = f"{service.url}/api/v1/health"
    request = Request(url, headers={"Accept": "application/json"})
    try:
        with urlopen(request, timeout=3.5) as response:
            body = response.read().decode("utf-8", errors="replace")
            status_code = getattr(response, "status", 200)
    except HTTPError as exc:
        body = exc.read().decode("utf-8", errors="replace")
        body_str = body if body is not None else ""
        return {
            "ok": False,
            "statusCode": exc.code,
            "message": f"HTTP {exc.code}",
            "body": body_str[:500],
        }
    except URLError as exc:
        return {"ok": False, "message": f"连接失败: {exc.reason}"}
    except TimeoutError:
        return {"ok": False, "message": "请求超时"}

    parsed: Any = None
    try:
        parsed = json.loads(body)
    except json.JSONDecodeError:
        pass

    if isinstance(parsed, dict):
        data = parsed.get("data")
        inner_status = ""
        if isinstance(data, dict):
            inner_status = str(data.get("status", "")).strip()
        message = f"HTTP {status_code}"
        if inner_status:
            message = f"{message} / {inner_status}"
        return {
            "ok": 200 <= status_code < 300,
            "statusCode": status_code,
            "message": message,
            "response": parsed,
        }

    body_str = body if body is not None else ""
    return {
        "ok": 200 <= status_code < 300,
        "statusCode": status_code,
        "message": f"HTTP {status_code}",
        "body": body_str[:500],
    }


class DevManagerWebHandler(BaseHTTPRequestHandler):
    server_version = "HelloTimeDevManagerWeb/1.0"

    def _send_json(self, payload: dict[str, Any], status: int = 200) -> None:
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _send_html(self, html: str, status: int = 200) -> None:
        body = html.encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _read_json_body(self) -> dict[str, Any]:
        content_length = self.headers.get("Content-Length", "0").strip()
        if not content_length.isdigit():
            return {}
        size = int(content_length)
        if size <= 0:
            return {}
        raw = self.rfile.read(size)
        if not raw:
            return {}
        try:
            data = json.loads(raw.decode("utf-8"))
            if isinstance(data, dict):
                return data
        except json.JSONDecodeError:
            return {}
        return {}

    def _ok(self, message: str, extra: dict[str, Any] | None = None) -> None:
        payload: dict[str, Any] = {"success": True, "message": message}
        if extra:
            payload.update(extra)
        self._send_json(payload, 200)

    def _error(self, message: str, status: int = 400) -> None:
        self._send_json({"success": False, "message": message}, status)

    def do_GET(self) -> None:
        parsed = urlparse(self.path)
        path = parsed.path.rstrip("/") or "/"

        if path == "/" or path == "/index.html":
            self._send_html(read_web_ui())
            return
        if path.startswith("/assets/"):
            prefix_len = len("/assets/")
            relative = path[prefix_len:].lstrip("/")
            asset_path = (ASSETS_DIR / relative).resolve()
            try:
                asset_path.relative_to(ASSETS_DIR.resolve())
            except ValueError:
                self._error("非法资源路径", 403)
                return
            if not asset_path.exists() or not asset_path.is_file():
                self._error("资源不存在", 404)
                return
            suffix = asset_path.suffix.lower()
            content_type = "application/octet-stream"
            if suffix == ".svg":
                content_type = "image/svg+xml; charset=utf-8"
            elif suffix == ".png":
                content_type = "image/png"
            elif suffix == ".jpg" or suffix == ".jpeg":
                content_type = "image/jpeg"
            body = asset_path.read_bytes()
            self.send_response(200)
            self.send_header("Content-Type", content_type)
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return
        if path == "/api/snapshot":
            self._send_json({"success": True, "data": build_snapshot()})
            return
        if path.startswith("/api/services/") and path.endswith("/health"):
            parts = path.strip("/").split("/")
            if len(parts) != 4:
                self._error("无效的健康检查路径", 404)
                return
            service = find_service(parts[2])
            if service is None:
                self._error("服务不存在", 404)
                return
            self._send_json(
                {
                    "success": True,
                    "data": {
                        "service": serialize_service(service),
                        "health": check_service_health(service),
                    },
                }
            )
            return
        if path.startswith("/api/services/") and path.endswith("/logs"):
            parts = path.strip("/").split("/")
            if len(parts) != 4:
                self._error("无效的日志请求路径", 404)
                return
            service = find_service(parts[2])
            if service is None:
                self._error("服务不存在", 404)
                return
            query = parse_qs(parsed.query)
            lines = 40
            try:
                if "lines" in query and query["lines"]:
                    lines = max(10, min(500, int(query["lines"][0])))
            except ValueError:
                lines = 40
            self._send_json(
                {
                    "success": True,
                    "data": {
                        "service": serialize_service(service),
                        "lines": lines,
                        "content": tail_log(service, lines=lines),
                    },
                }
            )
            return
        if path == "/api/proxy/logs":
            query = parse_qs(parsed.query)
            lines = 40
            try:
                if "lines" in query and query["lines"]:
                    lines = max(10, min(500, int(query["lines"][0])))
            except ValueError:
                lines = 40
            self._send_json(
                {
                    "success": True,
                    "data": {
                        "key": "__proxy__",
                        "label": "8080 转发",
                        "lines": lines,
                        "content": tail_proxy_logs(lines=lines),
                    },
                }
            )
            return

        self._error("未找到资源", 404)

    def do_POST(self) -> None:
        parsed = urlparse(self.path)
        path = parsed.path.rstrip("/") or "/"
        body = self._read_json_body()

        # 前端若误用 POST 访问健康检查，也兼容返回结果，避免“资源未找到”。
        if path.startswith("/api/services/") and path.endswith("/health"):
            parts = path.strip("/").split("/")
            if len(parts) != 4:
                self._error("无效的健康检查路径", 404)
                return
            service = find_service(parts[2])
            if service is None:
                self._error("服务不存在", 404)
                return
            self._send_json(
                {
                    "success": True,
                    "data": {
                        "service": serialize_service(service),
                        "health": check_service_health(service),
                    },
                }
            )
            return

        if path == "/api/services/start-all":
            self._ok("已执行启动全部服务", {"results": start_all(), "data": build_snapshot()})
            return
        if path == "/api/services/stop-all":
            self._ok("已执行停止全部服务", {"results": stop_all(), "data": build_snapshot()})
            return
        if path == "/api/services/restart-all":
            self._ok("已执行重启全部服务", {"results": restart_all(), "data": build_snapshot()})
            return
        if path == "/api/proxy/switch":
            target = str(body.get("target", "")).strip()
            if not target:
                self._error("target 不能为空")
                return
            output = switch_proxy(target)
            self._ok("已执行 8080 映射切换", {"result": output, "data": build_snapshot()})
            return
        if path == "/api/proxy/stop":
            output = switch_proxy("stop")
            self._ok("已停止 8080 映射", {"result": output, "data": build_snapshot()})
            return
        if path.startswith("/api/services/"):
            parts = path.strip("/").split("/")
            if len(parts) != 4 or parts[3] not in {"start", "stop", "restart"}:
                self._error("无效的服务操作路径", 404)
                return
            service = find_service(parts[2])
            if service is None:
                self._error("服务不存在", 404)
                return
            action = parts[3]
            if action == "start":
                result = start_service(service)
            elif action == "stop":
                result = stop_service(service)
            else:
                result = restart_service(service)
            self._ok(f"已执行 {service.label} {action}", {"result": result, "data": build_snapshot()})
            return

        self._error("未找到资源", 404)

    def log_message(self, format: str, *args: Any) -> None:
        return


def run_web_server(host: str, port: int) -> None:
    ensure_runtime_dirs()
    server = ThreadingHTTPServer((host, port), DevManagerWebHandler)
    print(f"HelloTime Web 服务管理已启动: http://{host}:{port}")
    print("按 Ctrl+C 退出。")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n已停止 Web 服务管理。")
    finally:
        server.server_close()

def print_snapshot() -> None:
    payload = build_snapshot()
    print(json.dumps(payload, ensure_ascii=False, indent=2))


def require_service(key: str) -> Service:
    service = find_service(key)
    if service is None:
        raise SystemExit(f"服务不存在: {key}")
    return service


def run_single_action(args: argparse.Namespace) -> bool:
    if args.status:
        print_snapshot()
        return True
    if args.start:
        print(start_service(require_service(args.start)))
        return True
    if args.stop:
        print(stop_service(require_service(args.stop)))
        return True
    if args.restart:
        print(restart_service(require_service(args.restart)))
        return True
    if args.start_all:
        print("\n".join(start_all()))
        return True
    if args.stop_all:
        print("\n".join(stop_all()))
        return True
    if args.restart_all:
        print("\n".join(restart_all()))
        return True
    if args.logs:
        service = require_service(args.logs)
        print(tail_log(service, lines=args.lines))
        return True
    if args.health:
        service = require_service(args.health)
        print(json.dumps(check_service_health(service), ensure_ascii=False, indent=2))
        return True
    if args.switch_proxy:
        print(switch_proxy(args.switch_proxy))
        return True
    if args.stop_proxy:
        print(switch_proxy("stop"))
        return True
    return False


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="HelloTime 开发服务管理工具（Web 优先）")
    parser.add_argument("--web", action="store_true", help="启动 Web 管理界面")
    parser.add_argument("--host", default="127.0.0.1", help="Web 模式监听地址，默认 127.0.0.1")
    parser.add_argument("--port", type=int, default=8090, help="Web 模式监听端口，默认 8090")
    parser.add_argument("--no-browser", action="store_true", help="启动 Web 管理界面时不自动打开浏览器")
    parser.add_argument("--status", action="store_true", help="打印当前服务快照 JSON")
    parser.add_argument("--start", metavar="SERVICE", help="启动指定服务")
    parser.add_argument("--stop", metavar="SERVICE", help="停止指定服务")
    parser.add_argument("--restart", metavar="SERVICE", help="重启指定服务")
    parser.add_argument("--start-all", action="store_true", help="启动全部服务")
    parser.add_argument("--stop-all", action="store_true", help="停止全部服务")
    parser.add_argument("--restart-all", action="store_true", help="重启全部服务")
    parser.add_argument("--logs", metavar="SERVICE", help="查看指定服务日志")
    parser.add_argument("--lines", type=int, default=40, help="查看日志时读取的行数，默认 40")
    parser.add_argument("--health", metavar="SERVICE", help="检查指定后端健康状态")
    parser.add_argument("--switch-proxy", metavar="TARGET", help="切换 8080 到指定后端")
    parser.add_argument("--stop-proxy", action="store_true", help="停止 8080 代理")
    args = parser.parse_args()

    try:
        action_executed = run_single_action(args)
        if args.web or not action_executed:
            if not args.no_browser:
                maybe_open_browser(args.host, args.port)
            run_web_server(args.host, args.port)
    except KeyboardInterrupt:
        print("\n退出管理工具。")
