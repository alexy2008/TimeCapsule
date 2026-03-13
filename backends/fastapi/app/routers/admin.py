"""
管理员路由
POST   /api/v1/admin/login           管理员登录（无需认证）
GET    /api/v1/admin/capsules        分页查询胶囊列表（需认证）
DELETE /api/v1/admin/capsules/{code} 删除胶囊（需认证）
"""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import verify_admin_token
from app.schemas import (
    AdminLoginRequest,
    AdminTokenResponse,
    CapsuleResponse,
    PageResponse,
    ApiResponse,
)
from app.services import admin_service, capsule_service
from app.services.admin_service import UnauthorizedException

router = APIRouter(prefix="/api/v1/admin", tags=["admin"])


@router.post("/login", response_model=ApiResponse[AdminTokenResponse])
def login(request: AdminLoginRequest):
    token = admin_service.login(request.password)
    if token is None:
        raise UnauthorizedException("密码错误")
    return ApiResponse.ok(AdminTokenResponse(token=token), "登录成功")


@router.get(
    "/capsules",
    response_model=ApiResponse[PageResponse[CapsuleResponse]],
    dependencies=[Depends(verify_admin_token)],
)
def list_capsules(
    page: int = Query(default=0, ge=0),
    size: int = Query(default=20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    result = capsule_service.list_capsules(db, page, size)
    return ApiResponse.ok(result)


@router.delete(
    "/capsules/{code}",
    response_model=ApiResponse[None],
    dependencies=[Depends(verify_admin_token)],
)
def delete_capsule(code: str, db: Session = Depends(get_db)):
    capsule_service.delete_capsule(db, code)
    return ApiResponse.ok(None, "删除成功")
