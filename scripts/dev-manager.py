#!/usr/bin/env python3
"""
HelloTime 本地开发服务管理工具。

功能：
1. 展示所有前后端服务的运行状态、PID、监听端口、日志路径。
2. 启动、停止、重启单个服务或全部服务。
3. 显示并切换 localhost:8080 到不同后端的映射关系。
"""

from __future__ import annotations

import os
import signal
import socket
import subprocess
import sys
import termios
import time
import tty
from dataclasses import dataclass
from pathlib import Path
from typing import Callable, Iterable


ROOT_DIR = Path(__file__).resolve().parent.parent
RUNTIME_DIR = ROOT_DIR / ".runtime" / "dev-manager"
PID_DIR = RUNTIME_DIR / "pids"
LOG_DIR = RUNTIME_DIR / "logs"
SWITCH_SCRIPT = ROOT_DIR / "scripts" / "switch-backend.sh"
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
]

BACKEND_KEYS = {"spring-boot", "fastapi", "gin", "elysia", "nest"}


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


def main() -> None:
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
    try:
        main()
    except KeyboardInterrupt:
        print("\n退出管理工具。")
