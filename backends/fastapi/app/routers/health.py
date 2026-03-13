"""
健康检查路由
GET /api/v1/health
"""
from datetime import datetime, timezone

from fastapi import APIRouter

from app.schemas import ApiResponse

router = APIRouter(prefix="/api/v1", tags=["health"])


@router.get("/health")
def health() -> ApiResponse[dict]:
    return ApiResponse.ok({
        "status": "UP",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "techStack": {
            "framework": "FastAPI >=0.115",
            "language": "Python 3.12",
            "database": "SQLite"
        }
    })
