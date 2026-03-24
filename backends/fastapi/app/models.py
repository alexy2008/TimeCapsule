"""
数据库模型
SQLAlchemy ORM 模型定义
"""
from datetime import datetime, timezone
from typing import Optional

from sqlalchemy import String, Text
from sqlalchemy.types import TypeDecorator
from sqlalchemy.orm import Mapped, mapped_column, DeclarativeBase

from app.database import Base


class UTCDateTimeString(TypeDecorator):
    """以统一 UTC ISO 8601 字符串格式存储时间。"""

    impl = String(20)
    cache_ok = True

    def process_bind_param(self, value, dialect):
        if value is None:
            return None
        if value.tzinfo is None:
            value = value.replace(tzinfo=timezone.utc)
        value = value.astimezone(timezone.utc).replace(microsecond=0)
        return value.strftime("%Y-%m-%dT%H:%M:%SZ")

    def process_result_value(self, value, dialect):
        if value is None:
            return None
        normalized = value.strip().replace(" ", "T")
        if normalized.endswith("Z"):
            normalized = normalized[:-1] + "+00:00"
        elif "+" not in normalized[10:] and "-" not in normalized[10:]:
            normalized = normalized + "+00:00"
        return datetime.fromisoformat(normalized).astimezone(timezone.utc)


class Capsule(Base):
    """时间胶囊实体"""
    __tablename__ = "capsules"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    code: Mapped[str] = mapped_column(String(8), unique=True, nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(100), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    creator: Mapped[str] = mapped_column(String(30), nullable=False)
    open_at: Mapped[datetime] = mapped_column(UTCDateTimeString(), nullable=False)
    created_at: Mapped[Optional[datetime]] = mapped_column(UTCDateTimeString(), nullable=True)
