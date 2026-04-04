"""
胶囊路由
POST /api/v1/capsules      创建胶囊
GET  /api/v1/capsules/{code} 查询胶囊
"""
from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas import CreateCapsuleRequest, CapsuleCreatedResponse, CapsuleResponse, ApiResponse
from app.services import capsule_service

router = APIRouter(prefix="/api/v1/capsules", tags=["capsules"])


@router.post("", response_model=ApiResponse[CapsuleCreatedResponse])
def create(request: CreateCapsuleRequest, db: Session = Depends(get_db)):
    capsule = capsule_service.create_capsule(db, request)
    response = ApiResponse.ok(capsule, "胶囊创建成功")
    # 显式返回 201，帮助初学者区分“创建成功”和普通 200 成功的语义差异。
    return JSONResponse(
        status_code=201,
        content=response.model_dump(by_alias=True, exclude_none=True, mode="json"),
    )


@router.get("/{code}", response_model=ApiResponse[CapsuleResponse])
def get(code: str, db: Session = Depends(get_db)):
    # 是否隐藏 content 不在路由层判断，而是交给 service 层统一处理。
    capsule = capsule_service.get_capsule(db, code)
    return ApiResponse.ok(capsule)
