"""
FastAPI 应用入口
CORS 配置、异常处理、路由注册
"""
from pathlib import Path

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles

from app.database import engine, Base
from app.schemas import ApiResponse
from app.routers import health, capsule, admin
from app.services.capsule_service import CapsuleNotFoundException
from app.services.admin_service import UnauthorizedException

# 创建表
Base.metadata.create_all(bind=engine)

app = FastAPI(title="HelloTime API", version="1.0.0")

# ===== CORS 配置 =====
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"http://localhost(:\d+)?",
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    allow_credentials=True,
    max_age=3600,
)

tech_logos_dir = Path(__file__).resolve().parent.parent / "static" / "tech-logos"
app.mount("/tech-logos", StaticFiles(directory=tech_logos_dir), name="tech-logos")

# ===== 注册路由 =====
app.include_router(health.router)
app.include_router(capsule.router)
app.include_router(admin.router)


# ===== 全局异常处理 =====


@app.exception_handler(CapsuleNotFoundException)
async def capsule_not_found_handler(_request: Request, exc: CapsuleNotFoundException):
    response = ApiResponse.error(str(exc), "CAPSULE_NOT_FOUND")
    return JSONResponse(
        status_code=404,
        content=response.model_dump(by_alias=True, exclude_none=True),
    )


@app.exception_handler(UnauthorizedException)
async def unauthorized_handler(_request: Request, exc: UnauthorizedException):
    response = ApiResponse.error(str(exc), "UNAUTHORIZED")
    return JSONResponse(
        status_code=401,
        content=response.model_dump(by_alias=True, exclude_none=True),
    )


@app.exception_handler(RequestValidationError)
async def validation_handler(_request: Request, exc: RequestValidationError):
    errors = exc.errors()
    messages = []
    for err in errors:
        loc = ".".join(str(l) for l in err["loc"] if l != "body")
        messages.append(f"{loc}: {err['msg']}")
    message = "; ".join(messages) if messages else "参数校验失败"
    response = ApiResponse.error(message, "VALIDATION_ERROR")
    return JSONResponse(
        status_code=400,
        content=response.model_dump(by_alias=True, exclude_none=True),
    )


@app.exception_handler(ValueError)
async def value_error_handler(_request: Request, exc: ValueError):
    response = ApiResponse.error(str(exc), "BAD_REQUEST")
    return JSONResponse(
        status_code=400,
        content=response.model_dump(by_alias=True, exclude_none=True),
    )


@app.exception_handler(Exception)
async def general_handler(_request: Request, _exc: Exception):
    response = ApiResponse.error("服务器内部错误", "INTERNAL_ERROR")
    return JSONResponse(
        status_code=500,
        content=response.model_dump(by_alias=True, exclude_none=True),
    )
