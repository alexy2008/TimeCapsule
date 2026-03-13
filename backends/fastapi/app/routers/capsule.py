"""
胶囊路由
POST /api/v1/capsules      创建胶囊
GET  /api/v1/capsules/{code} 查询胶囊
"""
from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas import CreateCapsuleRequest, CapsuleResponse, ApiResponse
from app.services import capsule_service

router = APIRouter(prefix="/api/v1/capsules", tags=["capsules"])


@router.post("", response_model=ApiResponse[CapsuleResponse])
def create(request: CreateCapsuleRequest, db: Session = Depends(get_db)):
    capsule = capsule_service.create_capsule(db, request)
    response = ApiResponse.ok(capsule, "胶囊创建成功")
    return JSONResponse(
        status_code=201,
        content=response.model_dump(by_alias=True, exclude_none=True, mode="json"),
    )


@router.get("/{code}", response_model=ApiResponse[CapsuleResponse])
def get(code: str, db: Session = Depends(get_db)):
    capsule = capsule_service.get_capsule(db, code)
    return ApiResponse.ok(capsule)
