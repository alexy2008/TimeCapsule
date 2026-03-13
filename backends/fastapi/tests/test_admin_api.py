"""
管理员 API 端点测试
"""
from datetime import datetime, timedelta, timezone


def _login(client) -> str:
    """辅助：登录并返回 token"""
    resp = client.post("/api/v1/admin/login", json={"password": "timecapsule-admin"})
    return resp.json()["data"]["token"]


def test_login_correct_password(client):
    """正确密码登录返回 200 + token"""
    response = client.post("/api/v1/admin/login", json={"password": "timecapsule-admin"})
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "token" in data["data"]


def test_login_wrong_password(client):
    """错误密码返回 401"""
    response = client.post("/api/v1/admin/login", json={"password": "wrong"})
    assert response.status_code == 401
    data = response.json()
    assert data["success"] is False
    assert data["errorCode"] == "UNAUTHORIZED"


def test_list_capsules_without_token(client):
    """无 token 列表返回 4xx 错误"""
    response = client.get("/api/v1/admin/capsules")
    assert response.status_code in (400, 401, 422)


def test_list_capsules_with_token(client):
    """有 token 列表返回 200 + 分页"""
    token = _login(client)
    response = client.get(
        "/api/v1/admin/capsules",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "content" in data["data"]
    assert "totalElements" in data["data"]
    assert "totalPages" in data["data"]


def test_delete_capsule_with_token(client):
    """有 token 删除胶囊成功"""
    token = _login(client)

    # 先创建一个胶囊
    future = (datetime.now(timezone.utc) + timedelta(days=30)).isoformat()
    create_resp = client.post("/api/v1/capsules", json={
        "title": "待删除",
        "content": "内容",
        "creator": "测试者",
        "openAt": future,
    })
    code = create_resp.json()["data"]["code"]

    # 删除
    response = client.delete(
        f"/api/v1/admin/capsules/{code}",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    assert response.json()["success"] is True

    # 验证已删除
    get_resp = client.get(f"/api/v1/capsules/{code}")
    assert get_resp.status_code == 404
