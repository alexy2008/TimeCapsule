"""
FastAPI 依赖注入
JWT 令牌验证中间件
"""
from fastapi import Header

from app.services.admin_service import validate_token, UnauthorizedException


def verify_admin_token(authorization: str | None = Header(default=None)) -> None:
    """
    验证管理员 JWT 令牌
    从 Authorization: Bearer {token} 头提取并验证
    抛出 UnauthorizedException 以便全局异常处理器统一处理
    """
    if authorization is None or not authorization.startswith("Bearer "):
        raise UnauthorizedException("缺少认证令牌")

    token = authorization[7:]  # 去掉 "Bearer " 前缀

    if not validate_token(token):
        raise UnauthorizedException("认证令牌无效或已过期")
