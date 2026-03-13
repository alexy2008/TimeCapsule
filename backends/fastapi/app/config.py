"""
应用配置
从环境变量读取配置，提供默认值
"""
import os


# 数据库路径：使用相对于项目根目录的路径
DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///../../data/hellotime.db")

ADMIN_PASSWORD: str = os.getenv("ADMIN_PASSWORD", "timecapsule-admin")

JWT_SECRET: str = os.getenv(
    "JWT_SECRET", "hellotime-jwt-secret-key-that-is-long-enough-for-hs256"
)

JWT_EXPIRATION_HOURS: int = int(os.getenv("JWT_EXPIRATION_HOURS", "2"))
