"""
胶囊 API 端点测试
"""
from datetime import datetime, timedelta, timezone


def test_health(client):
    """Health check 返回 200"""
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["status"] == "UP"
    assert data["data"]["techStack"]["framework"] == "FastAPI >=0.115"
    assert data["data"]["techStack"]["language"] == "Python 3.12"
    assert data["data"]["techStack"]["database"] == "SQLite"


def test_create_capsule(client):
    """创建胶囊返回 201"""
    future = (datetime.now(timezone.utc) + timedelta(days=30)).isoformat()
    response = client.post("/api/v1/capsules", json={
        "title": "测试胶囊",
        "content": "测试内容",
        "creator": "测试者",
        "openAt": future,
    })
    assert response.status_code == 201
    data = response.json()
    assert data["success"] is True
    assert len(data["data"]["code"]) == 8
    assert data["data"]["title"] == "测试胶囊"
    assert data["message"] == "胶囊创建成功"


def test_create_capsule_missing_fields(client):
    """缺少字段返回 400"""
    response = client.post("/api/v1/capsules", json={
        "title": "测试",
    })
    assert response.status_code == 400
    data = response.json()
    assert data["success"] is False
    assert data["errorCode"] == "VALIDATION_ERROR"


def test_get_nonexistent_capsule(client):
    """获取不存在胶囊返回 404"""
    response = client.get("/api/v1/capsules/NONEXIST")
    assert response.status_code == 404
    data = response.json()
    assert data["success"] is False
    assert data["errorCode"] == "CAPSULE_NOT_FOUND"


def test_get_unopened_capsule_hides_content(client):
    """获取未开启胶囊 content 为 null"""
    future = (datetime.now(timezone.utc) + timedelta(days=365)).isoformat()
    create_resp = client.post("/api/v1/capsules", json={
        "title": "未来胶囊",
        "content": "秘密内容",
        "creator": "测试者",
        "openAt": future,
    })
    code = create_resp.json()["data"]["code"]

    response = client.get(f"/api/v1/capsules/{code}")
    assert response.status_code == 200
    data = response.json()["data"]
    assert data["opened"] is False
    assert data["content"] is None
