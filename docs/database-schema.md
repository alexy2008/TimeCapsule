# 数据库设计

## 数据库引擎

SQLite — 轻量级、零配置，适合技术展示和小规模部署。

## 表结构

### capsules 表

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT | 自增主键 |
| code | VARCHAR(8) | UNIQUE, NOT NULL | 8 位胶囊码（62 进制，A-Z a-z 0-9） |
| title | VARCHAR(100) | NOT NULL | 标题 |
| content | TEXT | NOT NULL | 内容（时间未到时 API 不返回此字段） |
| creator | VARCHAR(30) | NOT NULL | 发布者昵称 |
| open_at | DATETIME | NOT NULL | 开启时间 (UTC) |
| created_at | DATETIME | NOT NULL | 创建时间 (UTC) |

### 索引

- `code` 字段自动创建唯一索引（UNIQUE 约束）

## 胶囊码设计

- 长度: 8 位
- 字符集: `A-Z a-z 0-9`（62 个字符）
- 空间: 62^8 ≈ 218 万亿种组合
- 生成方式: `SecureRandom` 随机生成
- 碰撞处理: 检查唯一性，最多重试 10 次

## 建表 SQL（参考）

```sql
CREATE TABLE capsules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code VARCHAR(8) NOT NULL UNIQUE,
    title VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    creator VARCHAR(30) NOT NULL,
    open_at DATETIME NOT NULL,
    created_at DATETIME NOT NULL
);
```

实际使用中，Spring Data JPA + Hibernate 会自动管理表结构（`ddl-auto: update`）。
