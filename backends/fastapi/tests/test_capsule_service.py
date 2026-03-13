"""
胶囊服务测试
"""
from datetime import datetime, timedelta, timezone

import pytest

from app.services.capsule_service import (
    create_capsule,
    get_capsule,
    delete_capsule,
    CapsuleNotFoundException,
)
from app.schemas import CreateCapsuleRequest


def test_create_capsule_returns_code(db_session):
    """创建胶囊返回 8 字符 code，时间格式为 ISO 8601 字符串"""
    open_at = datetime.now(timezone.utc) + timedelta(days=30)
    request = CreateCapsuleRequest(
        title="测试",
        content="内容",
        creator="测试者",
        open_at=open_at,
    )
    result = create_capsule(db_session, request)
    assert len(result.code) == 8
    assert result.title == "测试"
    assert result.content is None  # 创建响应不含 content
    # 验证时间格式为 ISO 8601 字符串
    assert isinstance(result.open_at, str)
    assert result.open_at.endswith("Z") or "+" in result.open_at
    assert isinstance(result.created_at, str)


def test_create_capsule_past_open_at_raises(db_session):
    """openAt 在过去时抛异常"""
    open_at = datetime.now(timezone.utc) - timedelta(hours=1)
    request = CreateCapsuleRequest(
        title="测试",
        content="内容",
        creator="测试者",
        open_at=open_at,
    )
    with pytest.raises(ValueError, match="开启时间必须在未来"):
        create_capsule(db_session, request)


def test_get_unopened_capsule_hides_content(db_session):
    """未开启胶囊 content 为 None"""
    open_at = datetime.now(timezone.utc) + timedelta(days=365)
    request = CreateCapsuleRequest(
        title="测试",
        content="秘密内容",
        creator="测试者",
        open_at=open_at,
    )
    created = create_capsule(db_session, request)
    result = get_capsule(db_session, created.code)
    assert result.opened is False
    assert result.content is None


def test_get_nonexistent_capsule_raises(db_session):
    """查询不存在胶囊抛异常"""
    with pytest.raises(CapsuleNotFoundException):
        get_capsule(db_session, "NONEXIST")


def test_delete_capsule(db_session):
    """删除胶囊成功"""
    open_at = datetime.now(timezone.utc) + timedelta(days=30)
    request = CreateCapsuleRequest(
        title="测试",
        content="内容",
        creator="测试者",
        open_at=open_at,
    )
    created = create_capsule(db_session, request)
    delete_capsule(db_session, created.code)
    with pytest.raises(CapsuleNotFoundException):
        get_capsule(db_session, created.code)


def test_delete_nonexistent_capsule_raises(db_session):
    """删除不存在胶囊抛异常"""
    with pytest.raises(CapsuleNotFoundException):
        delete_capsule(db_session, "NONEXIST")
