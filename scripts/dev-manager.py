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
import ctypes
import json
import os
import re
import signal
import socket
import subprocess
import sys
import time
import webbrowser
from concurrent.futures import ThreadPoolExecutor
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

WEB_UI_FILE = ROOT_DIR / "scripts" / "dev-manager-web.html"
ASSETS_DIR = ROOT_DIR / "scripts" / "dev-manager-assets"
PROXY_PATHS = build_proxy_paths()
PROXY_RUNTIME_DIR = Path(PROXY_PATHS["PROXY_RUNTIME_DIR"])
PROXY_PID_FILE = Path(PROXY_PATHS["PID_FILE"])
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
    os: str = "all"  # "all" | "windows" | "macos" | "linux"

    @property
    def available(self) -> bool:
        if self.os == "all":
            return True
        if self.os == "windows":
            return os.name == "nt"
        if self.os == "macos":
            return sys.platform == "darwin"
        if self.os == "linux":
            return sys.platform.startswith("linux")
        return False

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
        key="ktor",
        label="Ktor",
        kind="backend",
        workdir=ROOT_DIR / "backends" / "ktor",
        command=["bash", str(ROOT_DIR / "backends" / "ktor" / "run")],
        port=18090,
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
        key="laravel",
        label="Laravel",
        kind="fullstack",
        workdir=ROOT_DIR / "fullstacks" / "laravel",
        command=["bash", str(ROOT_DIR / "fullstacks" / "laravel" / "run")],
        port=5179,
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
        os="macos",
    ),
    Service(
        key="winui3",
        label="WinUI 3 桌面",
        kind="desktop",
        workdir=ROOT_DIR / "desktop" / "winui3",
        command=["powershell", "-NoProfile", "-ExecutionPolicy", "Bypass", "-File", str(ROOT_DIR / "desktop" / "winui3" / "run.ps1")],
        port=0,
        os="windows",
    ),
]


def ensure_runtime_dirs() -> None:
    PID_DIR.mkdir(parents=True, exist_ok=True)
    LOG_DIR.mkdir(parents=True, exist_ok=True)
    PROXY_RUNTIME_DIR.mkdir(parents=True, exist_ok=True)


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


def get_listening_pids(port: int, netstat_output: str | None = None) -> list[int]:
    if port <= 0:
        return []

    if os.name == "nt":
        if netstat_output is not None:
            stdout = netstat_output
        else:
            result = subprocess.run(
                ["netstat", "-ano", "-p", "tcp"],
                text=True,
                capture_output=True,
                check=False,
            )
            if result.returncode != 0:
                return []
            stdout = result.stdout
        found_pids: list[int] = []
        suffixes = (f":{port}", f".{port}")
        for raw_line in stdout.splitlines():
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
                found_pids.append(int(pid_str))
            except ValueError:
                continue
        return sorted(set(found_pids))

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

    found_pids: list[int] = []
    for line in result.stdout.splitlines():
        line = line.strip()
        if not line:
            continue
        try:
            found_pids.append(int(line))
        except ValueError:
            continue
    return sorted(set(found_pids))


def read_pid(pid_file: Path) -> int | None:
    if not pid_file.exists():
        return None

    try:
        return int(pid_file.read_text(encoding="utf-8", errors="replace").strip())
    except ValueError:
        pid_file.unlink(missing_ok=True)
        return None


def _is_pid_alive_windows(pid: int) -> bool:
    """Windows: 用 OpenProcess 检查进程存活，比 tasklist 快 50 倍。"""
    SYNCHRONIZE = 0x100000
    process = ctypes.windll.kernel32.OpenProcess(SYNCHRONIZE, False, pid)  # type: ignore[attr-defined]
    if process:
        ctypes.windll.kernel32.CloseHandle(process)  # type: ignore[attr-defined]
        return True
    return False


def is_pid_alive(pid: int | None) -> bool:
    if pid is None:
        return False

    if os.name == "nt":
        return _is_pid_alive_windows(pid)

    try:
        os.kill(pid, 0)
    except OSError:
        return False
    return True


def cleanup_stale_pid(service: Service) -> None:
    pid = read_pid(service.pid_file)
    if pid is not None and not is_pid_alive(pid):
        service.pid_file.unlink(missing_ok=True)


def get_service_status(service: Service, *, netstat_output: str | None = None) -> dict[str, str]:
    cleanup_stale_pid(service)
    pid = read_pid(service.pid_file)
    alive = is_pid_alive(pid)
    listener_pids = get_listening_pids(service.port, netstat_output=netstat_output)
    # 当 netstat_output 可用时，直接使用 netstat 结果判断端口状态，
    # 避免对未开放端口调用 is_port_open（每次 TCP 连接超时约 1 秒）
    if netstat_output is not None:
        port_open = bool(listener_pids)
    else:
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
    if not service.available:
        return f"{service.label} 不支持当前操作系统（需要 {service.os}）。"

    is_windows = os.name == "nt"
    has_ps1 = is_windows and service.windows_run_script.exists()

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
    if is_windows:
        creationflags = 0
        if has_ps1:
            # PowerShell + DETACHED_PROCESS 会导致 PowerShell 立即退出，
            # 改用 CREATE_NO_WINDOW：不创建控制台窗口，但不脱离控制台。
            creationflags |= getattr(subprocess, "CREATE_NO_WINDOW", 0)
            creationflags |= getattr(subprocess, "CREATE_NEW_PROCESS_GROUP", 0)
        else:
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
    finally:
        # 父进程不再需要写日志文件，关闭句柄避免泄漏
        log_handle.close()

    service.pid_file.write_text(f"{process.pid}\n")

    # 轮询端口开放：用 netstat 缓存优化 Windows 性能
    for _ in range(20):
        if not is_pid_alive(process.pid):
            break
        netstat = _get_netstat_output()
        listener_pids = get_listening_pids(service.port, netstat_output=netstat)
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
            targets.append((listener_pid, True))
            seen.add(listener_pid)

    for target_pid, use_group in targets:
        try:
            terminate_pid(target_pid, use_group=use_group)
        except OSError:
            continue

    # 轮询进程退出：用 netstat 缓存优化 Windows 性能
    for _ in range(20):
        managed_alive_now = is_pid_alive(pid) if pid is not None else False
        netstat = _get_netstat_output()
        if not managed_alive_now and not get_listening_pids(service.port, netstat_output=netstat):
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
    """并行启动所有服务。"""
    with ThreadPoolExecutor(max_workers=8) as pool:
        return list(pool.map(start_service, SERVICES))


def stop_all() -> list[str]:
    """并行停止所有服务。"""
    with ThreadPoolExecutor(max_workers=8) as pool:
        return list(pool.map(stop_service, reversed(SERVICES)))


def restart_all() -> list[str]:
    return stop_all() + start_all()


def get_proxy_mapping() -> str:
    """获取当前 8080 转发映射。若进程已退出则清理过期 meta。"""
    if PROXY_META_FILE.exists():
        # 检查 PID 文件中的进程是否存活
        pid = read_pid(PROXY_PID_FILE)
        if pid is not None and is_pid_alive(pid):
            return PROXY_META_FILE.read_text(encoding="utf-8", errors="replace").strip()
        # 进程已死，清理残留文件
        PROXY_META_FILE.unlink(missing_ok=True)
        PROXY_PID_FILE.unlink(missing_ok=True)
    return "当前没有运行中的 8080 转发"


def append_proxy_activity(message: str) -> None:
    ensure_runtime_dirs()
    timestamp = time.strftime("%Y-%m-%dT%H:%M:%S")
    with PROXY_ACTIVITY_LOG.open("a", encoding="utf-8") as handle:
        handle.write(f"{timestamp} INFO {message}\n")


def _build_proxy_target_map() -> dict[str, tuple[str, int]]:
    """从 SERVICES 列表自动派生后端名→端口映射，无需硬编码。"""
    mapping: dict[str, tuple[str, int]] = {}
    for svc in SERVICES:
        if svc.kind == "backend":
            # 添加 key 本身
            mapping[svc.key] = (svc.key, svc.port)
    # 常用别名
    mapping["spring"] = ("spring-boot", 18000)
    mapping["aspnet"] = ("aspnet-core", 18050)
    return mapping


_PROXY_TARGET_MAP: dict[str, tuple[str, int]] = _build_proxy_target_map()


def _resolve_proxy_target(name: str) -> tuple[str, int]:
    """将后端名称解析为 (名称, 端口) 元组。"""
    key = name.lower().strip()
    if key in _PROXY_TARGET_MAP:
        return _PROXY_TARGET_MAP[key]
    if key.isdigit():
        return ("custom", int(key))
    raise ValueError(f"未知后端: {name}")


def _stop_proxy_process(*, keep_meta: bool = False) -> str:
    """停止当前运行中的 8080 转发进程。

    除了杀 PID 文件记录的进程，还会杀所有在 8080 端口上监听的进程，
    防止残留进程占用端口导致新转发无法生效。

    Args:
        keep_meta: 为 True 时保留 meta 文件（用于切换场景，避免中间状态显示"未转发"）。
    """
    # 收集需要停止的进程
    targets: set[int] = set()

    # 1. PID 文件记录的进程
    pid: int | None = None
    if PROXY_PID_FILE.exists():
        try:
            pid = int(PROXY_PID_FILE.read_text(encoding="utf-8", errors="replace").strip())
        except ValueError:
            pid = None
        PROXY_PID_FILE.unlink(missing_ok=True)

    if pid is not None and is_pid_alive(pid):
        targets.add(pid)

    # 2. 所有在 8080 端口上监听的进程（捕获残留的旧进程）
    for listener_pid in get_listening_pids(8080):
        if is_pid_alive(listener_pid):
            targets.add(listener_pid)

    if not keep_meta:
        PROXY_META_FILE.unlink(missing_ok=True)

    if not targets:
        return "No active 8080 forwarding to stop"

    # 发送终止信号
    for target_pid in targets:
        terminate_pid(target_pid, use_group=True)

    # 等待进程退出
    for _ in range(12):
        if not any(is_pid_alive(p) for p in targets):
            break
        time.sleep(0.25)

    # 强制杀死未退出的进程
    for target_pid in targets:
        if is_pid_alive(target_pid):
            force_kill_pid(target_pid, use_group=True)

    return f"Stopped 8080 forwarding (PIDs: {sorted(targets)})"


def _start_proxy_process(target_name: str, target_port: int) -> str:
    """启动 8080 端口转发后台进程。"""
    ensure_runtime_dirs()
    forward_script = ROOT_DIR / "scripts" / "port_forward.py"
    python_exe = "python" if os.name == "nt" else "python3"

    # 先写过渡 meta，避免 UI 在切换期间显示"未转发"
    PROXY_META_FILE.write_text(f"切换中 -> {target_name} ({target_port})\nPID: ...\n日志: {PROXY_LOG_FILE}")

    command = [
        python_exe,
        str(forward_script),
        "--listen-host", "127.0.0.1",
        "--listen-port", "8080",
        "--target-host", "127.0.0.1",
        "--target-port", str(target_port),
    ]

    popen_kwargs: dict[str, Any] = {
        "cwd": str(ROOT_DIR / "scripts"),
        "stdin": subprocess.DEVNULL,
    }

    if os.name == "nt":
        # Windows: 用 CREATE_NO_WINDOW 避免弹黑窗口
        creationflags = getattr(subprocess, "CREATE_NO_WINDOW", 0)
        creationflags |= getattr(subprocess, "CREATE_NEW_PROCESS_GROUP", 0)
        popen_kwargs["creationflags"] = creationflags
        # 打开日志文件后立即传给 Popen，父进程关闭自己的句柄
        stdout_handle = PROXY_LOG_FILE.open("ab")
        stderr_handle = PROXY_ERR_FILE.open("ab")
        popen_kwargs["stdout"] = stdout_handle
        popen_kwargs["stderr"] = stderr_handle
    else:
        popen_kwargs["start_new_session"] = True
        stdout_handle = PROXY_LOG_FILE.open("ab")
        popen_kwargs["stdout"] = stdout_handle
        popen_kwargs["stderr"] = subprocess.STDOUT

    process = subprocess.Popen(command, **popen_kwargs)

    # 父进程关闭日志文件句柄，避免泄漏
    if os.name == "nt":
        stdout_handle.close()
        stderr_handle.close()
    else:
        stdout_handle.close()

    PROXY_PID_FILE.write_text(f"{process.pid}\n")

    # 等待 0.5 秒确认进程未立即退出
    time.sleep(0.5)
    if process.poll() is not None:
        PROXY_PID_FILE.unlink(missing_ok=True)
        PROXY_META_FILE.unlink(missing_ok=True)
        raise RuntimeError(f"端口转发启动失败，请查看日志: {PROXY_LOG_FILE}")

    meta_lines = [
        f"当前 8080 -> {target_name} ({target_port})",
        f"PID: {process.pid}",
        f"日志: {PROXY_LOG_FILE}",
    ]
    PROXY_META_FILE.write_text("\n".join(meta_lines))

    return "\n".join(meta_lines)


def switch_proxy(target: str) -> str:
    ensure_runtime_dirs()
    action = "停止 8080 转发" if target == "stop" else f"切换 8080 转发到 {target}"

    if target == "stop":
        result = _stop_proxy_process()
    elif target == "status":
        result = get_proxy_mapping()
    else:
        try:
            target_name, target_port = _resolve_proxy_target(target)
        except ValueError as exc:
            return str(exc)
        # 切换场景：保留旧 meta 直到新 meta 写入，避免 UI 闪烁"未转发"
        _stop_proxy_process(keep_meta=True)
        try:
            result = _start_proxy_process(target_name, target_port)
        except RuntimeError as exc:
            append_proxy_activity(f"{action} | 失败: {exc}")
            return str(exc)

    summary = result.strip() or f"{action}完成"
    append_proxy_activity(f"{action} | {summary.replace(chr(10), ' | ')}")
    return result.strip() or f"切换完成，目标 {target}"


def maybe_open_browser(host: str, port: int) -> None:
    url = f"http://{host}:{port}"
    try:
        opened = webbrowser.open(url)
    except Exception:
        opened = False
    if not opened:
        print(f"请手动打开: {url}")


_ANSI_ESCAPE_RE = re.compile(r"\x1b\[[0-9;]*[a-zA-Z]|\x1b\].*?\x07|\x1b\[.*?[a-zA-Z]")


def _strip_ansi(text: str) -> str:
    """剥离 ANSI 转义码，让日志在 Web UI 中可读。"""
    return _ANSI_ESCAPE_RE.sub("", text)


def tail_log(service: Service, lines: int = 20) -> str:
    if not service.log_file.exists():
        return f"{service.label} 还没有日志文件。"

    content = _strip_ansi(service.log_file.read_text(encoding="utf-8", errors="replace")).splitlines()
    if not content:
        return "(日志为空)"
    last_lines = content[-lines:] if lines > 0 else []
    return "\n".join(last_lines)


def tail_proxy_logs(lines: int = 20) -> str:
    entries: list[str] = []
    if PROXY_ACTIVITY_LOG.exists():
        entries.extend(_strip_ansi(PROXY_ACTIVITY_LOG.read_text(encoding="utf-8", errors="replace")).splitlines())

    if os.name == "nt":
        proxy_process_files = [PROXY_LOG_FILE, PROXY_ERR_FILE]
    else:
        proxy_process_files = [PROXY_LOG_FILE]

    for path in proxy_process_files:
        if not path.exists():
            continue
        file_lines = _strip_ansi(path.read_text(encoding="utf-8", errors="replace")).splitlines()
        if not file_lines:
            continue
        entries.append(f"--- {path.name} ---")
        entries.extend(file_lines)

    if not entries:
        return "8080 转发还没有日志。"

    last_lines = entries[-lines:] if lines > 0 else []
    return "\n".join(last_lines)


def serialize_service(service: Service, *, netstat_output: str | None = None) -> dict[str, Any]:
    info = get_service_status(service, netstat_output=netstat_output)
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
        "available": service.available,
    }


def _get_netstat_output() -> str | None:
    """获取一次 netstat 输出，供所有服务共享，避免重复调用。"""
    if os.name != "nt":
        return None
    result = subprocess.run(
        ["netstat", "-ano", "-p", "tcp"],
        text=True,
        capture_output=True,
        check=False,
    )
    return result.stdout if result.returncode == 0 else None


def build_snapshot() -> dict[str, Any]:
    netstat_output = _get_netstat_output()
    return {
        "services": [serialize_service(service, netstat_output=netstat_output) for service in SERVICES],
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
        try:
            self.send_response(status)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
        except (ConnectionResetError, ConnectionAbortedError, BrokenPipeError, OSError):
            pass

    def _send_html(self, html: str, status: int = 200) -> None:
        body = html.encode("utf-8")
        try:
            self.send_response(status)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
        except (ConnectionResetError, ConnectionAbortedError, BrokenPipeError, OSError):
            pass

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
            try:
                self.send_response(200)
                self.send_header("Content-Type", content_type)
                self.send_header("Content-Length", str(len(body)))
                self.end_headers()
                self.wfile.write(body)
            except (ConnectionResetError, ConnectionAbortedError, BrokenPipeError, OSError):
                pass
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

        # 前端若误用 POST 访问健康检查，也兼容返回结果，避免"资源未找到"。
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
