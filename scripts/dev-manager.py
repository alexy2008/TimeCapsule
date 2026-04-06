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
import sys
import termios
import time
import tty
from dataclasses import dataclass
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any, Callable, Iterable
from urllib.error import HTTPError, URLError
from urllib.parse import parse_qs, urlparse
from urllib.request import Request, urlopen


ROOT_DIR = Path(__file__).resolve().parent.parent
RUNTIME_DIR = ROOT_DIR / ".runtime" / "dev-manager"
PID_DIR = RUNTIME_DIR / "pids"
LOG_DIR = RUNTIME_DIR / "logs"
SWITCH_SCRIPT = ROOT_DIR / "scripts" / "switch-backend.sh"
WEB_UI_FILE = ROOT_DIR / "scripts" / "dev-manager-web.html"
ASSETS_DIR = ROOT_DIR / "scripts" / "dev-manager-assets"
PROXY_META_FILE = Path("/tmp/hellotime-backend-proxy.meta")


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
]

BACKEND_KEYS = {"spring-boot", "fastapi", "gin", "elysia", "nest", "aspnet-core"}


def ensure_runtime_dirs() -> None:
    PID_DIR.mkdir(parents=True, exist_ok=True)
    LOG_DIR.mkdir(parents=True, exist_ok=True)


def clear_screen() -> None:
    if sys.stdout.isatty():
        print("\033[2J\033[H", end="")


def read_key() -> str:
    fd = sys.stdin.fileno()
    old_settings = termios.tcgetattr(fd)
    try:
        tty.setraw(fd)
        first = sys.stdin.read(1)
        if first != "\x1b":
            return first

        second = sys.stdin.read(1)
        if second != "[":
            return first

        third = sys.stdin.read(1)
        return f"\x1b[{third}"
    finally:
        termios.tcsetattr(fd, termios.TCSADRAIN, old_settings)


def interactive_select(
    title: str,
    options: list[tuple[str, str]],
    *,
    allow_back: bool = True,
    allow_quit: bool = False,
    header_lines: list[str] | None = None,
) -> str | None:
    if not sys.stdin.isatty() or not sys.stdout.isatty():
        return None

    selected = 0

    while True:
        clear_screen()
        if header_lines:
            for line in header_lines:
                print(line)
            print()

        print(title)
        print()

        for index, (_, label) in enumerate(options):
            prefix = ">" if index == selected else " "
            print(f" {prefix} {index + 1}. {label}")

        print()
        tips = ["上下箭头选择", "回车确认"]
        if allow_back:
            tips.append("b 返回")
        if allow_quit:
            tips.append("q 退出")
        print(" / ".join(tips))

        key = read_key()
        if key == "\x1b[A":
            selected = (selected - 1) % len(options)
            continue
        if key == "\x1b[B":
            selected = (selected + 1) % len(options)
            continue
        if key in {"\r", "\n"}:
            return options[selected][0]
        if allow_back and key.lower() == "b":
            return None
        if allow_quit and key.lower() == "q":
            raise SystemExit(0)


def is_port_open(port: int) -> bool:
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
    result = subprocess.run(
        ["lsof", f"-tiTCP:{port}", "-sTCP:LISTEN"],
        text=True,
        capture_output=True,
        check=False,
    )
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


def is_service_running(service: Service) -> bool:
    return get_service_status(service)["status"] == "运行中"


def is_service_startable(service: Service) -> bool:
    return get_service_status(service)["status"] in {"已停止", "端口占用"}


def start_service(service: Service) -> str:
    ensure_runtime_dirs()
    status = get_service_status(service)
    if status["status"] in {"运行中", "启动中"}:
        return f"{service.label} 已处于{status['status']}状态。"

    log_handle = service.log_file.open("ab")
    process = subprocess.Popen(
        service.command,
        cwd=service.workdir,
        stdout=log_handle,
        stderr=subprocess.STDOUT,
        stdin=subprocess.DEVNULL,
        start_new_session=True,
    )
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
    if use_group:
        try:
            os.killpg(pid, signal.SIGTERM)
            return
        except OSError:
            pass
    os.kill(pid, signal.SIGTERM)


def force_kill_pid(pid: int, *, use_group: bool) -> None:
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


def switch_proxy(target: str) -> str:
    result = subprocess.run(
        ["bash", str(SWITCH_SCRIPT), target],
        cwd=ROOT_DIR,
        text=True,
        capture_output=True,
    )
    output = (result.stdout or "") + (result.stderr or "")
    return output.strip() or f"切换完成，目标 {target}"


def tail_log(service: Service, lines: int = 20) -> str:
    if not service.log_file.exists():
        return f"{service.label} 还没有日志文件。"

    content = service.log_file.read_text(errors="replace").splitlines()
    return "\n".join(content[-lines:]) if content else "(日志为空)"


def format_table(services: Iterable[Service]) -> str:
    rows: list[list[str]] = []
    for index, service in enumerate(services, start=1):
        info = get_service_status(service)
        rows.append(
            [
                str(index),
                service.label,
                service.kind,
                info["status"],
                info["pid"],
                str(service.port),
                info["port_open"],
            ]
        )

    headers = ["#", "服务", "类型", "状态", "PID", "端口", "监听"]
    widths = [len(header) for header in headers]
    for row in rows:
        for idx, value in enumerate(row):
            widths[idx] = max(widths[idx], len(value))

    def render_row(row: list[str]) -> str:
        return "  ".join(value.ljust(widths[idx]) for idx, value in enumerate(row))

    lines = [render_row(headers), render_row(["-" * width for width in widths])]
    lines.extend(render_row(row) for row in rows)
    return "\n".join(lines)


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
        return {
            "ok": False,
            "statusCode": exc.code,
            "message": f"HTTP {exc.code}",
            "body": body[:500],
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

    return {
        "ok": 200 <= status_code < 300,
        "statusCode": status_code,
        "message": f"HTTP {status_code}",
        "body": body[:500],
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
            relative = path[len("/assets/"):].lstrip("/")
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


def print_dashboard(message: str | None = None) -> None:
    clear_screen()
    print("HelloTime 开发服务管理")
    print()
    print(format_table(SERVICES))
    print()
    print("当前 8080 映射:")
    print(get_proxy_mapping())
    print()
    print("菜单:")
    print("  1. 启动服务")
    print("  2. 停止服务")
    print("  3. 重启服务")
    print("  4. 启动全部服务")
    print("  5. 停止全部服务")
    print("  6. 重启全部服务")
    print("  7. 切换 8080 映射")
    print("  8. 查看服务日志")
    print("  r. 刷新")
    print("  q. 退出")
    if message:
        print()
        print(f"结果: {message}")


def build_dashboard_lines(message: str | None = None) -> list[str]:
    lines = [
        "HelloTime 开发服务管理",
        "",
        format_table(SERVICES),
        "",
        "当前 8080 映射:",
        get_proxy_mapping(),
    ]
    if message:
        lines.extend(["", f"结果: {message}"])
    return lines


def choose_service(
    prompt: str,
    *,
    backend_only: bool = False,
    predicate: Callable[[Service], bool] | None = None,
) -> Service | None:
    filtered_services = [service for service in SERVICES if not backend_only or service.key in BACKEND_KEYS]
    if predicate is not None:
        filtered_services = [service for service in filtered_services if predicate(service)]

    if not filtered_services:
        print()
        print("当前没有可选服务。")
        if sys.stdin.isatty():
            input("按回车返回...")
        return None

    interactive_choice = interactive_select(
        prompt,
        [(service.key, f"{service.label} ({service.port})") for service in filtered_services],
    )
    if interactive_choice is not None:
        for service in filtered_services:
            if service.key == interactive_choice:
                return service
        return None

    while True:
        print()
        print(prompt)
        for index, service in enumerate(filtered_services, start=1):
            print(f"  {index}. {service.label} ({service.port})")
        print("  b. 返回")
        choice = input("> ").strip().lower()
        if choice == "b":
            return None
        if not choice.isdigit():
            print("请输入有效编号。")
            continue

        idx = int(choice) - 1
        if 0 <= idx < len(filtered_services):
            return filtered_services[idx]

        print("请输入有效编号。")


def show_logs_menu() -> str | None:
    service = choose_service("选择要查看日志的服务:")
    if service is None:
        return None

    print()
    print(f"==== {service.label} 最近 20 行日志 ====")
    print(tail_log(service))
    print()
    input("按回车返回...")
    return None


def switch_proxy_menu() -> str | None:
    service = choose_service("选择要映射到 localhost:8080 的后端:", backend_only=True)
    if service is None:
        return None
    return switch_proxy(service.key)


def handle_choice(choice: str) -> str | None:
    if choice == "1":
        service = choose_service("选择要启动的服务:", predicate=is_service_startable)
        return None if service is None else start_service(service)
    if choice == "2":
        service = choose_service("选择要停止的服务:", predicate=is_service_running)
        return None if service is None else stop_service(service)
    if choice == "3":
        service = choose_service("选择要重启的服务:", predicate=is_service_running)
        return None if service is None else restart_service(service)
    if choice == "4":
        return "\n".join(start_all())
    if choice == "5":
        return "\n".join(stop_all())
    if choice == "6":
        return "\n".join(restart_all())
    if choice == "7":
        return switch_proxy_menu()
    if choice == "8":
        return show_logs_menu()
    if choice == "r":
        return None
    if choice == "q":
        raise SystemExit(0)
    return "未知操作，请重新输入。"


def run_cli() -> None:
    ensure_runtime_dirs()
    message: str | None = None

    while True:
        menu_options = [
            ("1", "启动服务"),
            ("2", "停止服务"),
            ("3", "重启服务"),
            ("4", "启动全部服务"),
            ("5", "停止全部服务"),
            ("6", "重启全部服务"),
            ("7", "切换 8080 映射"),
            ("8", "查看服务日志"),
            ("r", "刷新"),
            ("q", "退出"),
        ]
        choice = interactive_select(
            "请选择操作",
            menu_options,
            allow_back=False,
            allow_quit=True,
            header_lines=build_dashboard_lines(message),
        )
        if choice is None:
            print_dashboard(message)
            print()
            choice = input("请选择操作 > ").strip().lower()
        try:
            message = handle_choice(choice)
        except KeyboardInterrupt:
            message = "已取消当前操作。"
        except SystemExit:
            print("退出管理工具。")
            raise


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="HelloTime 开发服务管理工具")
    parser.add_argument("--web", action="store_true", help="启动 Web 管理模式")
    parser.add_argument("--host", default="127.0.0.1", help="Web 模式监听地址，默认 127.0.0.1")
    parser.add_argument("--port", type=int, default=8090, help="Web 模式监听端口，默认 8090")
    args = parser.parse_args()

    try:
        if args.web:
            run_web_server(args.host, args.port)
        else:
            run_cli()
    except KeyboardInterrupt:
        print("\n退出管理工具。")
