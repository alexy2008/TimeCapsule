# API 接口文档

基础路径: `/api/v1`

## 统一响应格式

```json
{
  "success": true,
  "data": {},
  "message": "操作说明",
  "errorCode": "ERROR_CODE"
}
```

## 接口列表

### 健康检查

**GET** `/api/v1/health`

响应示例:
```json
{
  "success": true,
  "data": {
    "status": "UP",
    "timestamp": "2024-01-01T00:00:00Z"
  }
}
```

---

### 创建时间胶囊

**POST** `/api/v1/capsules`

请求体:
```json
{
  "title": "给未来的信",
  "content": "希望你一切都好...",
  "creator": "小明",
  "openAt": "2025-06-01T00:00:00Z"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| title | string | 是 | 标题，最多 100 字符 |
| content | string | 是 | 内容 |
| creator | string | 是 | 发布者昵称，最多 30 字符 |
| openAt | string (ISO 8601) | 是 | 开启时间，必须为未来时间 |

响应 (201):
```json
{
  "success": true,
  "data": {
    "code": "Ab3xK9mZ",
    "title": "给未来的信",
    "creator": "小明",
    "openAt": "2025-06-01T00:00:00Z",
    "createdAt": "2024-01-01T12:00:00Z"
  },
  "message": "胶囊创建成功"
}
```

---

### 查询时间胶囊

**GET** `/api/v1/capsules/{code}`

路径参数:
- `code`: 8 位胶囊码

响应 (200) — 时间未到:
```json
{
  "success": true,
  "data": {
    "code": "Ab3xK9mZ",
    "title": "给未来的信",
    "creator": "小明",
    "openAt": "2025-06-01T00:00:00Z",
    "createdAt": "2024-01-01T12:00:00Z",
    "opened": false
  }
}
```

响应 (200) — 已到时间:
```json
{
  "success": true,
  "data": {
    "code": "Ab3xK9mZ",
    "title": "给未来的信",
    "content": "希望你一切都好...",
    "creator": "小明",
    "openAt": "2025-06-01T00:00:00Z",
    "createdAt": "2024-01-01T12:00:00Z",
    "opened": true
  }
}
```

---

### 管理员登录

**POST** `/api/v1/admin/login`

请求体:
```json
{
  "password": "your-admin-password"
}
```

响应 (200):
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiJ9..."
  },
  "message": "登录成功"
}
```

---

### 管理员 - 分页查询胶囊

**GET** `/api/v1/admin/capsules?page=0&size=20`

请求头: `Authorization: Bearer {token}`

响应 (200):
```json
{
  "success": true,
  "data": {
    "content": [
      {
        "code": "Ab3xK9mZ",
        "title": "给未来的信",
        "content": "希望你一切都好...",
        "creator": "小明",
        "openAt": "2025-06-01T00:00:00Z",
        "createdAt": "2024-01-01T12:00:00Z",
        "opened": false
      }
    ],
    "totalElements": 1,
    "totalPages": 1,
    "number": 0,
    "size": 20
  }
}
```

---

### 管理员 - 删除胶囊

**DELETE** `/api/v1/admin/capsules/{code}`

请求头: `Authorization: Bearer {token}`

响应 (200):
```json
{
  "success": true,
  "data": null,
  "message": "删除成功"
}
```

---

## 错误码

| 错误码 | HTTP 状态码 | 说明 |
|--------|-------------|------|
| VALIDATION_ERROR | 400 | 参数校验失败 |
| BAD_REQUEST | 400 | 请求参数错误 |
| UNAUTHORIZED | 401 | 认证失败 |
| CAPSULE_NOT_FOUND | 404 | 胶囊不存在 |
| INTERNAL_ERROR | 500 | 服务器内部错误 |
