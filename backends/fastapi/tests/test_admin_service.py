"""
管理员服务测试
"""
from app.services.admin_service import login, validate_token


def test_login_correct_password():
    """正确密码返回 token"""
    token = login("timecapsule-admin")
    assert token is not None
    assert isinstance(token, str)
    assert len(token) > 0


def test_login_wrong_password():
    """错误密码返回 None"""
    token = login("wrong-password")
    assert token is None


def test_validate_valid_token():
    """有效 token 验证通过"""
    token = login("timecapsule-admin")
    assert validate_token(token) is True


def test_validate_invalid_token():
    """无效 token 验证失败"""
    assert validate_token("invalid-token") is False
