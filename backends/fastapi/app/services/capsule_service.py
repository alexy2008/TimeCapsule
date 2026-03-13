"""
胶囊业务逻辑
封装创建、查询、列表、删除等核心操作
"""
import math
import secrets
import string
from datetime import datetime, timezone
from typing import Optional

from sqlalchemy.orm import Session

from app.models import Capsule
from app.schemas import (
    CreateCapsuleRequest,
    CapsuleResponse,
    PageResponse,
)

CODE_CHARS = string.ascii_letters + string.digits  # A-Za-z0-9 (62 chars)
CODE_LENGTH = 8
MAX_RETRIES = 10


class CapsuleNotFoundException(Exception):
    """胶囊不存在"""
    def __init__(self, code: str):
        self.code = code
        super().__init__(f"胶囊不存在：{code}")


def _generate_code() -> str:
    """生成 8 位 base62 随机码"""
    return "".join(secrets.choice(CODE_CHARS) for _ in range(CODE_LENGTH))


def _generate_unique_code(db: Session) -> str:
    """生成唯一的胶囊码，最多重试 MAX_RETRIES 次"""
    for _ in range(MAX_RETRIES):
        code = _generate_code()
        if not db.query(Capsule).filter(Capsule.code == code).first():
            return code
    raise RuntimeError("无法生成唯一的胶囊码")


def _to_response_dict(
    capsule: Capsule,
    include_content: bool = False,
) -> dict:
    """将 Capsule 实体转换为响应字典，时间格式化为 ISO 8601 字符串"""
    now = datetime.now(timezone.utc)
    # 确保 open_at 有时区信息
    open_at = capsule.open_at
    if open_at.tzinfo is None:
        open_at = open_at.replace(tzinfo=timezone.utc)
    opened = now > open_at

    # 时间格式化为 ISO 8601 字符串
    open_at_str = open_at.isoformat().replace("+00:00", "Z")
    created_at_str = capsule.created_at.isoformat().replace("+00:00", "Z") if capsule.created_at else None

    result = {
        "code": capsule.code,
        "title": capsule.title,
        "creator": capsule.creator,
        "open_at": open_at_str,
        "created_at": created_at_str,
    }

    if include_content:
        result["content"] = capsule.content
    else:
        result["content"] = capsule.content if opened else None

    result["opened"] = opened
    return result


def create_capsule(db: Session, request: CreateCapsuleRequest) -> CapsuleResponse:
    """创建时间胶囊"""
    # openAt 必须在未来
    now = datetime.now(timezone.utc)
    if request.open_at <= now:
        raise ValueError("开启时间必须在未来")

    code = _generate_unique_code(db)

    capsule = Capsule(
        code=code,
        title=request.title,
        content=request.content,
        creator=request.creator,
        open_at=request.open_at,
        created_at=now,
    )
    db.add(capsule)
    db.commit()
    db.refresh(capsule)

    # 返回响应（不含 content）
    response_data = _to_response_dict(capsule, include_content=False)
    return CapsuleResponse(**response_data)


def get_capsule(db: Session, code: str) -> CapsuleResponse:
    """查询胶囊详情"""
    capsule = db.query(Capsule).filter(Capsule.code == code).first()
    if not capsule:
        raise CapsuleNotFoundException(code)
    response_data = _to_response_dict(capsule, include_content=False)
    return CapsuleResponse(**response_data)


def list_capsules(db: Session, page: int = 0, size: int = 20) -> PageResponse[CapsuleResponse]:
    """分页查询胶囊列表（管理员用）"""
    total = db.query(Capsule).count()
    total_pages = max(1, math.ceil(total / size))

    capsules = (
        db.query(Capsule)
        .order_by(Capsule.created_at.desc())
        .offset(page * size)
        .limit(size)
        .all()
    )

    content = [CapsuleResponse(**_to_response_dict(c, include_content=True)) for c in capsules]
    return PageResponse(
        content=content,
        total_elements=total,
        total_pages=total_pages,
        number=page,
        size=size,
    )


def delete_capsule(db: Session, code: str) -> None:
    """删除胶囊"""
    capsule = db.query(Capsule).filter(Capsule.code == code).first()
    if not capsule:
        raise CapsuleNotFoundException(code)
    db.delete(capsule)
    db.commit()
