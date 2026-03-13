"""
数据库模型
SQLAlchemy ORM 模型定义
"""
from datetime import datetime, timezone
from typing import Optional

from sqlalchemy import String, Text, DateTime
from sqlalchemy.orm import Mapped, mapped_column, DeclarativeBase

from app.database import Base


class Capsule(Base):
    """时间胶囊实体"""
    __tablename__ = "capsules"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    code: Mapped[str] = mapped_column(String(8), unique=True, nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(100), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    creator: Mapped[str] = mapped_column(String(30), nullable=False)
    # 使用 DateTime 存储 UTC 时间（与 Spring Boot 保持一致）
    open_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    created_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
