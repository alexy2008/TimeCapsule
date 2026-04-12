#!/usr/bin/env python3
"""
简单 TCP 端口转发器。
将本地监听端口的流量转发到目标主机端口，用于把 8080 动态切到不同后端。
"""

from __future__ import annotations

import argparse
import selectors
import signal
import socket
import socketserver
import threading
import time
from typing import Tuple

BUFFER_SIZE = 65536
MAX_CONNECTIONS = 100
IDLE_TIMEOUT = 300  # 空闲连接超时（秒），防止半开连接永久阻塞

active_connections = 0
connections_lock = threading.Lock()


def pump_bidirectional(left: socket.socket, right: socket.socket) -> None:
    selector = selectors.DefaultSelector()
    selector.register(left, selectors.EVENT_READ, right)
    selector.register(right, selectors.EVENT_READ, left)

    last_activity = time.monotonic()
    try:
        while True:
            events = selector.select(timeout=30)
            if not events:
                # 超时无数据：检查是否超过 idle timeout
                if time.monotonic() - last_activity > IDLE_TIMEOUT:
                    return
                continue

            last_activity = time.monotonic()
            for key, _ in events:
                source: socket.socket = key.fileobj
                target: socket.socket = key.data
                try:
                    chunk = source.recv(BUFFER_SIZE)
                except (ConnectionResetError, ConnectionAbortedError, OSError):
                    return
                if not chunk:
                    return
                try:
                    target.sendall(chunk)
                except (ConnectionResetError, ConnectionAbortedError, BrokenPipeError, OSError):
                    return
    finally:
        selector.close()


class ForwardHandler(socketserver.BaseRequestHandler):
    target_host: str
    target_port: int

    def handle(self) -> None:
        global active_connections
        with connections_lock:
            if active_connections >= MAX_CONNECTIONS:
                return
            active_connections += 1

        try:
            try:
                upstream = socket.create_connection((self.target_host, self.target_port))
            except (ConnectionRefusedError, ConnectionResetError, OSError):
                return
            try:
                try:
                    self.request.setsockopt(socket.IPPROTO_TCP, socket.TCP_NODELAY, 1)
                except OSError:
                    pass
                try:
                    upstream.setsockopt(socket.IPPROTO_TCP, socket.TCP_NODELAY, 1)
                except OSError:
                    pass
                pump_bidirectional(self.request, upstream)
            finally:
                upstream.close()
                self.request.close()
        finally:
            with connections_lock:
                active_connections -= 1


class ThreadedTCPServer(socketserver.ThreadingTCPServer):
    allow_reuse_address = True
    daemon_threads = True


def create_handler(target_host: str, target_port: int):
    class ConfiguredForwardHandler(ForwardHandler):
        pass

    ConfiguredForwardHandler.target_host = target_host
    ConfiguredForwardHandler.target_port = target_port
    return ConfiguredForwardHandler


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="TCP 端口转发器")
    parser.add_argument("--listen-host", default="127.0.0.1")
    parser.add_argument("--listen-port", type=int, required=True)
    parser.add_argument("--target-host", default="127.0.0.1")
    parser.add_argument("--target-port", type=int, required=True)
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    server_address: Tuple[str, int] = (args.listen_host, args.listen_port)
    handler = create_handler(args.target_host, args.target_port)

    server = ThreadedTCPServer(server_address, handler)

    def shutdown(signum: int, frame) -> None:
        print("收到关闭信号，正在停止服务...", flush=True)
        # `server.shutdown()` 不能在 `serve_forever()` 所在线程里直接调用，否则会卡死。
        # 这里改为后台线程触发关闭，避免留下"占着 8080 但不再转发"的僵尸进程。
        threading.Thread(target=server.shutdown, daemon=True).start()

    signal.signal(signal.SIGTERM, shutdown)
    signal.signal(signal.SIGINT, shutdown)

    try:
        print(
            f"Forwarding tcp://{args.listen_host}:{args.listen_port} -> "
            f"tcp://{args.target_host}:{args.target_port}",
            flush=True,
        )
        server.serve_forever()
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
