"""
Pydantic 模型（请求/响应 DTO）
与前端 API 契约保持一致，使用 camelCase 序列化
时间统一使用 ISO 8601 字符串格式
"""
from __future__ import annotations

from datetime import datetime, timezone
from typing import Generic, TypeVar, Optional, Any

from pydantic import BaseModel, ConfigDict, Field, field_validator


def to_camel(name: str) -> str:
    """snake_case → camelCase"""
    parts = name.split("_")
    return parts[0] + "".join(w.capitalize() for w in parts[1:])


T = TypeVar("T")


# ========== 请求 ==========


class CreateCapsuleRequest(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    title: str = Field(..., min_length=1, max_length=100)
    content: str = Field(..., min_length=1)
    creator: str = Field(..., min_length=1, max_length=30)
    open_at: datetime  # ISO 8601 字符串，内部解析为 datetime

    @field_validator("open_at", mode="before")
    @classmethod
    def parse_open_at(cls, v: Any) -> datetime:
        """支持 ISO 8601 字符串或 datetime 对象"""
        if isinstance(v, datetime):
            return v.replace(tzinfo=timezone.utc) if v.tzinfo is None else v
        if isinstance(v, str):
            # 解析 ISO 8601 字符串
            dt = datetime.fromisoformat(v.replace("Z", "+00:00"))
            return dt
        raise ValueError("open_at 必须是 ISO 8601 字符串或 datetime 对象")


class AdminLoginRequest(BaseModel):
    password: str = Field(..., min_length=1)


# ========== 响应 ==========


class CapsuleResponse(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    code: str
    title: str
    content: Optional[str] = None
    creator: str
    # ISO 8601 格式时间字符串
    open_at: str
    created_at: Optional[str] = None
    opened: Optional[bool] = None


class AdminTokenResponse(BaseModel):
    token: str


class PageResponse(BaseModel, Generic[T]):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    content: list[T]
    total_elements: int
    total_pages: int
    number: int
    size: int


class ApiResponse(BaseModel, Generic[T]):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    success: bool
    data: Optional[T] = None
    message: Optional[str] = None
    error_code: Optional[str] = None

    @staticmethod
    def ok(data: T, message: str | None = None) -> ApiResponse[T]:
        return ApiResponse(success=True, data=data, message=message)

    @staticmethod
    def error(message: str, error_code: str) -> ApiResponse:
        return ApiResponse(success=False, message=message, error_code=error_code)
