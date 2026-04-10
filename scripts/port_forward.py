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
from typing import Tuple

BUFFER_SIZE = 65536
MAX_CONNECTIONS = 100
active_connections = 0
connections_lock = threading.Lock()


def pump_bidirectional(left: socket.socket, right: socket.socket) -> None:
    selector = selectors.DefaultSelector()
    selector.register(left, selectors.EVENT_READ, right)
    selector.register(right, selectors.EVENT_READ, left)

    try:
        while True:
            events = selector.select()
            if not events:
                continue

            for key, _ in events:
                source: socket.socket = key.fileobj
                target: socket.socket = key.data
                chunk = source.recv(BUFFER_SIZE)
                if not chunk:
                    return
                target.sendall(chunk)
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
            upstream = socket.create_connection((self.target_host, self.target_port))
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
        server.shutdown()
        server.server_close()

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
