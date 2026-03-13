"""
管理员认证服务
JWT 令牌的生成与验证
"""
from datetime import datetime, timedelta, timezone

import jwt

from app.config import ADMIN_PASSWORD, JWT_SECRET, JWT_EXPIRATION_HOURS


class UnauthorizedException(Exception):
    """认证失败"""
    def __init__(self, message: str = "认证失败"):
        super().__init__(message)


def login(password: str) -> str | None:
    """
    管理员登录
    密码正确返回 JWT token，否则返回 None
    """
    if password != ADMIN_PASSWORD:
        return None

    now = datetime.now(timezone.utc)
    payload = {
        "sub": "admin",
        "iat": now,
        "exp": now + timedelta(hours=JWT_EXPIRATION_HOURS),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")


def validate_token(token: str) -> bool:
    """验证 JWT 令牌"""
    try:
        jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        return True
    except (jwt.InvalidTokenError, Exception):
        return False
