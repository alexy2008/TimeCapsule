//! HelloTime Axum 后端实现
//!
//! 单文件结构（lib.rs），集中展示 Axum 的核心概念：
//! - `FromRequestParts` 自定义 extractor（AdminAuth 鉴权）
//! - `State` + `FromRef` 显式状态管理
//! - `IntoResponse` 统一错误处理
//! - Tower 中间件（CORS）
//!
//! 对应其他技术栈：
//! - Spring Boot: controller/service/repository 三层
//! - Gin: handler/service/model/router 四层
//! - FastAPI: router/service/schema 三层
//! - NestJS: module/controller/service/guard/filter
//!
//! 单文件结构便于横向对比，阅读者无需在文件间跳转即可理解全貌。

use std::{net::SocketAddr, sync::Arc, time::Duration};

use axum::{
    Json, Router,
    extract::{FromRef, FromRequestParts, Path, Query, State},
    http::{
        HeaderMap, HeaderValue, Method, StatusCode,
        header::{AUTHORIZATION, CONTENT_TYPE},
        request::Parts,
    },
    response::{IntoResponse, Response},
    routing::{delete, get, post},
};
use chrono::{DateTime, SecondsFormat, Utc};
use http::Uri;
use jsonwebtoken::{Algorithm, DecodingKey, EncodingKey, Header, Validation, decode, encode};
use rand::{Rng, distr::Alphanumeric};
use serde::{Deserialize, Serialize};
use sqlx::{FromRow, SqlitePool, sqlite::SqlitePoolOptions};
use tower_http::{
    cors::{AllowOrigin, CorsLayer},
    services::ServeDir,
};

// 默认配置值，可通过环境变量覆盖
// 演示项目硬编码默认密码，生产环境应通过环境变量覆盖
const DEFAULT_DATABASE_URL: &str = "../../data/hellotime.db";
const DEFAULT_ADMIN_PASSWORD: &str = "timecapsule-admin";
const DEFAULT_JWT_SECRET: &str = "hellotime-jwt-secret-key-that-is-long-enough-for-hs256";
const DEFAULT_JWT_EXPIRATION_HOURS: i64 = 2;
const DEFAULT_HOST: &str = "127.0.0.1";
const DEFAULT_PORT: u16 = 18070;
const CODE_LENGTH: usize = 8;
const CODE_RETRY_LIMIT: usize = 10;

/// 应用配置 — 从环境变量读取，提供合理的默认值
///
/// 对应其他技术栈：
/// - Spring Boot: application.properties + @Value
/// - FastAPI: os.getenv / pydantic Settings
/// - Gin: viper / os.Getenv
#[derive(Clone)]
pub struct AppConfig {
    pub database_url: String,
    pub admin_password: String,
    pub jwt_secret: String,
    pub jwt_expiration_hours: i64,
    pub host: String,
    pub port: u16,
}

impl AppConfig {
    pub fn from_env() -> Self {
        Self {
            database_url: std::env::var("DATABASE_URL")
                .unwrap_or_else(|_| DEFAULT_DATABASE_URL.to_string()),
            admin_password: std::env::var("ADMIN_PASSWORD")
                .unwrap_or_else(|_| DEFAULT_ADMIN_PASSWORD.to_string()),
            jwt_secret: std::env::var("JWT_SECRET")
                .unwrap_or_else(|_| DEFAULT_JWT_SECRET.to_string()),
            jwt_expiration_hours: std::env::var("JWT_EXPIRATION_HOURS")
                .ok()
                .and_then(|value| value.parse().ok())
                .unwrap_or(DEFAULT_JWT_EXPIRATION_HOURS),
            host: std::env::var("HOST").unwrap_or_else(|_| DEFAULT_HOST.to_string()),
            port: std::env::var("PORT")
                .ok()
                .and_then(|value| value.parse().ok())
                .unwrap_or(DEFAULT_PORT),
        }
    }

    pub fn socket_addr(&self) -> Result<SocketAddr, AppError> {
        format!("{}:{}", self.host, self.port)
            .parse()
            .map_err(|_| AppError::internal("服务地址配置无效"))
    }
}

/// 共享应用状态 — 包含 SQLite 连接池和配置
///
/// 使用 Arc<AppConfig> + FromRef 实现子状态提取：
/// AdminAuth extractor 可以只依赖 Arc<AppConfig>，
/// 不需要整个 AppState。这是 Axum 状态管理的教科书用法。
#[derive(Clone)]
pub struct AppState {
    pool: SqlitePool,
    config: Arc<AppConfig>,
}

impl FromRef<AppState> for Arc<AppConfig> {
    fn from_ref(state: &AppState) -> Self {
        state.config.clone()
    }
}

/// 统一响应体 — 所有 9 个后端共用 { success, data, message, errorCode } 结构
///
/// 泛型设计保证类型安全，skip_serializing_if 省略 None 字段。
#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ApiResponse<T> {
    success: bool,
    data: Option<T>,
    #[serde(skip_serializing_if = "Option::is_none")]
    message: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    error_code: Option<String>,
}

impl<T> ApiResponse<T> {
    fn ok(data: T, message: impl Into<String>) -> Self {
        Self {
            success: true,
            data: Some(data),
            message: Some(message.into()),
            error_code: None,
        }
    }
}

impl ApiResponse<serde_json::Value> {
    fn ok_empty(message: impl Into<String>) -> Self {
        Self {
            success: true,
            data: None,
            message: Some(message.into()),
            error_code: None,
        }
    }

    fn error(message: impl Into<String>, error_code: impl Into<String>) -> Self {
        Self {
            success: false,
            data: None,
            message: Some(message.into()),
            error_code: Some(error_code.into()),
        }
    }
}

/// 统一错误类型 — 实现 IntoResponse 自动转为 HTTP 响应
///
/// From<sqlx::Error> 实现让 ? 操作符可以在 handler 中直接使用，
/// 数据库错误自动转为 500 内部错误。
#[derive(Debug)]
pub struct AppError {
    status: StatusCode,
    message: String,
    error_code: String,
}

impl std::fmt::Display for AppError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{} ({})", self.message, self.error_code)
    }
}

impl std::error::Error for AppError {}

impl AppError {
    fn new(status: StatusCode, message: impl Into<String>, error_code: impl Into<String>) -> Self {
        Self {
            status,
            message: message.into(),
            error_code: error_code.into(),
        }
    }

    fn validation(message: impl Into<String>) -> Self {
        Self::new(StatusCode::BAD_REQUEST, message, "VALIDATION_ERROR")
    }

    fn bad_request(message: impl Into<String>) -> Self {
        Self::new(StatusCode::BAD_REQUEST, message, "BAD_REQUEST")
    }

    fn unauthorized() -> Self {
        Self::new(
            StatusCode::UNAUTHORIZED,
            "认证令牌无效或已过期",
            "UNAUTHORIZED",
        )
    }

    fn forbidden_password() -> Self {
        Self::new(StatusCode::UNAUTHORIZED, "管理员密码错误", "UNAUTHORIZED")
    }

    fn not_found(message: impl Into<String>) -> Self {
        Self::new(StatusCode::NOT_FOUND, message, "CAPSULE_NOT_FOUND")
    }

    fn internal(message: impl Into<String>) -> Self {
        Self::new(StatusCode::INTERNAL_SERVER_ERROR, message, "INTERNAL_ERROR")
    }
}

impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        (
            self.status,
            Json(ApiResponse::<serde_json::Value>::error(
                self.message,
                self.error_code,
            )),
        )
            .into_response()
    }
}

impl From<sqlx::Error> for AppError {
    fn from(error: sqlx::Error) -> Self {
        Self::internal(format!("数据库操作失败: {error}"))
    }
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct HealthData {
    status: &'static str,
    timestamp: String,
    tech_stack: TechStack,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct TechStack {
    framework: &'static str,
    language: &'static str,
    database: &'static str,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct CreateCapsuleRequest {
    title: String,
    content: String,
    creator: String,
    open_at: String,
}

#[derive(Debug, Deserialize)]
struct AdminLoginRequest {
    password: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct CapsuleResponse {
    code: String,
    title: String,
    content: Option<String>,
    creator: String,
    open_at: String,
    created_at: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    opened: Option<bool>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct AdminTokenResponse {
    token: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct CapsulePageResponse {
    content: Vec<CapsuleResponse>,
    total_elements: i64,
    total_pages: i64,
    number: i64,
    size: i64,
}

#[derive(Debug, Deserialize)]
struct PaginationQuery {
    page: Option<i64>,
    size: Option<i64>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct AdminClaims {
    sub: String,
    iat: i64,
    exp: i64,
}

#[derive(Debug, Clone, FromRow)]
struct CapsuleRecord {
    code: String,
    title: String,
    content: String,
    creator: String,
    open_at: String,
    created_at: String,
}

/// 内容可见性控制 — 区分公开访客和管理员的响应策略
///
/// 管理员始终看到 content（即使未到 openAt），
/// 公开访客在 openAt 之前看不到 content。
#[derive(Clone, Copy)]
enum ContentVisibility {
    Public,  // 公开访客：未到时间 content 为 None
    Admin,   // 管理员：始终返回 content
}

/// 创建 Axum Router — 组装所有路由、中间件和状态
pub async fn create_app(config: AppConfig) -> Result<Router, AppError> {
    let pool = SqlitePoolOptions::new()
        .acquire_timeout(Duration::from_secs(5))
        .max_connections(5)
        .connect(&sqlite_url(&config.database_url))
        .await?;

    initialize_database(&pool).await?;

    let state = AppState {
        pool,
        config: Arc::new(config),
    };

    let cors = CorsLayer::new()
        .allow_methods([Method::GET, Method::POST, Method::DELETE, Method::OPTIONS])
        .allow_headers([AUTHORIZATION, CONTENT_TYPE])
        .allow_origin(AllowOrigin::predicate(
            |origin: &HeaderValue, _parts: &Parts| is_localhost_origin(origin),
        ));

    let static_service = ServeDir::new("static/tech-logos");

    Ok(Router::new()
        .nest(
            "/api/v1",
            Router::new()
                .route("/health", get(health))
                .route("/capsules", post(create_capsule))
                .route("/capsules/{code}", get(get_capsule))
                .route("/admin/login", post(admin_login))
                .route("/admin/capsules", get(list_capsules))
                .route("/admin/capsules/{code}", delete(delete_capsule)),
        )
        .nest_service("/tech-logos", static_service)
        .layer(cors)
        .with_state(state))
}

/// 启动服务 — 读取配置、创建 Router、绑定端口
pub async fn run() -> Result<(), AppError> {
    let config = AppConfig::from_env();
    let address = config.socket_addr()?;
    let app = create_app(config).await?;
    let listener = tokio::net::TcpListener::bind(address)
        .await
        .map_err(|error| AppError::internal(format!("绑定监听端口失败: {error}")))?;
    axum::serve(listener, app)
        .await
        .map_err(|error| AppError::internal(format!("启动 Axum 服务失败: {error}")))
}

/// 健康检查 — 所有 9 个后端共享同一返回结构
async fn health() -> Json<ApiResponse<HealthData>> {
    Json(ApiResponse::ok(
        HealthData {
            status: "UP",
            timestamp: format_time(Utc::now()),
            tech_stack: TechStack {
                framework: "Axum 0.8",
                language: "Rust 1.94",
                database: "SQLite",
            },
        },
        "服务运行正常",
    ))
}

/// 创建胶囊 — 校验 -> 解析时间 -> 生成 code -> 入库
async fn create_capsule(
    State(state): State<AppState>,
    Json(payload): Json<CreateCapsuleRequest>,
) -> Result<(StatusCode, Json<ApiResponse<CapsuleResponse>>), AppError> {
    validate_create_request(&payload)?;

    let open_at = parse_datetime(&payload.open_at)?;
    if open_at <= Utc::now() {
        return Err(AppError::bad_request("开启时间必须在未来"));
    }

    let code = generate_unique_code(&state.pool).await?;
    let created_at = Utc::now();
    let open_at_text = format_time(open_at);
    let created_at_text = format_time(created_at);

    sqlx::query(
        r#"
        INSERT INTO capsules (code, title, content, creator, open_at, created_at)
        VALUES (?1, ?2, ?3, ?4, ?5, ?6)
        "#,
    )
    .bind(&code)
    .bind(&payload.title)
    .bind(&payload.content)
    .bind(&payload.creator)
    .bind(&open_at_text)
    .bind(&created_at_text)
    .execute(&state.pool)
    .await?;

    let response = CapsuleResponse {
        code,
        title: payload.title,
        content: None,
        creator: payload.creator,
        open_at: open_at_text,
        created_at: created_at_text,
        opened: None,
    };

    Ok((
        StatusCode::CREATED,
        Json(ApiResponse::ok(response, "胶囊创建成功")),
    ))
}

/// 查询胶囊 — ContentVisibility::Public 确保未到时间时 content 为 null
async fn get_capsule(
    State(state): State<AppState>,
    Path(code): Path<String>,
) -> Result<Json<ApiResponse<CapsuleResponse>>, AppError> {
    validate_code(&code)?;
    let capsule = find_capsule_by_code(&state.pool, &code).await?;
    let response = map_capsule(capsule, ContentVisibility::Public)?;
    Ok(Json(ApiResponse::ok(response, "查询成功")))
}

/// 管理员登录 — 密码验证 -> JWT 签发
async fn admin_login(
    State(state): State<AppState>,
    Json(payload): Json<AdminLoginRequest>,
) -> Result<Json<ApiResponse<AdminTokenResponse>>, AppError> {
    if payload.password.trim().is_empty() {
        return Err(AppError::validation("password 不能为空"));
    }

    if payload.password != state.config.admin_password {
        return Err(AppError::forbidden_password());
    }

    let now = Utc::now();
    let claims = AdminClaims {
        sub: "admin".to_string(),
        iat: now.timestamp(),
        exp: (now + chrono::Duration::hours(state.config.jwt_expiration_hours)).timestamp(),
    };

    let token = encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(state.config.jwt_secret.as_bytes()),
    )
    .map_err(|error| AppError::internal(format!("生成 JWT 失败: {error}")))?;

    Ok(Json(ApiResponse::ok(
        AdminTokenResponse { token },
        "登录成功",
    )))
}

/// 胶囊列表 — 需要 AdminAuth 认证
///
/// 函数参数 _admin: AdminAuth 就是 Axum extractor 的鉴权方式，
/// 比 Gin 的 middleware 更直观——类型签名即表达了"需要认证"的语义。
async fn list_capsules(
    _admin: AdminAuth,
    State(state): State<AppState>,
    Query(query): Query<PaginationQuery>,
) -> Result<Json<ApiResponse<CapsulePageResponse>>, AppError> {
    let page = query.page.unwrap_or(0).max(0);
    let size = query.size.unwrap_or(20).clamp(1, 100);

    let total: i64 = sqlx::query_scalar("SELECT COUNT(*) FROM capsules")
        .fetch_one(&state.pool)
        .await?;

    let capsules = sqlx::query_as::<_, CapsuleRecord>(
        r#"
        SELECT code, title, content, creator, open_at, created_at
        FROM capsules
        ORDER BY created_at DESC
        LIMIT ?1 OFFSET ?2
        "#,
    )
    .bind(size)
    .bind(page * size)
    .fetch_all(&state.pool)
    .await?;

    let content = capsules
        .into_iter()
        .map(|capsule| map_capsule(capsule, ContentVisibility::Admin))
        .collect::<Result<Vec<_>, _>>()?;

    let total_pages = ((total + size - 1) / size).max(1);

    Ok(Json(ApiResponse::ok(
        CapsulePageResponse {
            content,
            total_elements: total,
            total_pages,
            number: page,
            size,
        },
        "查询成功",
    )))
}

/// 删除胶囊 — 需要 AdminAuth 认证
async fn delete_capsule(
    _admin: AdminAuth,
    State(state): State<AppState>,
    Path(code): Path<String>,
) -> Result<Json<ApiResponse<serde_json::Value>>, AppError> {
    validate_code(&code)?;
    let result = sqlx::query("DELETE FROM capsules WHERE code = ?1")
        .bind(&code)
        .execute(&state.pool)
        .await?;

    if result.rows_affected() == 0 {
        return Err(AppError::not_found("胶囊不存在"));
    }

    Ok(Json(ApiResponse::ok_empty("删除成功")))
}

/// 初始化数据库 — CREATE TABLE IF NOT EXISTS 幂等建表
async fn initialize_database(pool: &SqlitePool) -> Result<(), AppError> {
    sqlx::query(
        r#"
        CREATE TABLE IF NOT EXISTS capsules (
            code TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            creator TEXT NOT NULL,
            open_at TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
        "#,
    )
    .execute(pool)
    .await?;

    Ok(())
}

/// 校验创建请求 — 各字段的非空和长度检查
///
/// 使用 chars().count() 做字符数校验（而非字节数），支持中文等多字节字符。
fn validate_create_request(request: &CreateCapsuleRequest) -> Result<(), AppError> {
    if request.title.trim().is_empty() {
        return Err(AppError::validation("title 不能为空"));
    }
    if request.title.chars().count() > 100 {
        return Err(AppError::validation("title 长度不能超过 100"));
    }
    if request.content.trim().is_empty() {
        return Err(AppError::validation("content 不能为空"));
    }
    if request.creator.trim().is_empty() {
        return Err(AppError::validation("creator 不能为空"));
    }
    if request.creator.chars().count() > 30 {
        return Err(AppError::validation("creator 长度不能超过 30"));
    }
    if request.open_at.trim().is_empty() {
        return Err(AppError::validation("openAt 不能为空"));
    }
    Ok(())
}

/// 校验胶囊 code — 8 位字母数字，匹配失败返回 404（而非 400）
///
/// 返回 404 而非 400 是为了安全：不暴露"这个格式有问题"的信息。
fn validate_code(code: &str) -> Result<(), AppError> {
    if code.len() != CODE_LENGTH || !code.bytes().all(|byte| byte.is_ascii_alphanumeric()) {
        return Err(AppError::not_found("胶囊不存在"));
    }
    Ok(())
}

/// 按 code 查询胶囊 — fetch_optional + ok_or_else 处理不存在的情况
async fn find_capsule_by_code(pool: &SqlitePool, code: &str) -> Result<CapsuleRecord, AppError> {
    sqlx::query_as::<_, CapsuleRecord>(
        "SELECT code, title, content, creator, open_at, created_at FROM capsules WHERE code = ?1",
    )
    .bind(code)
    .fetch_optional(pool)
    .await?
    .ok_or_else(|| AppError::not_found("胶囊不存在"))
}

/// 数据库记录转响应 — 根据可见性策略决定是否返回 content
///
/// 管理员（Admin）始终看到 content，公开访客（Public）仅在已开启时看到。
fn map_capsule(
    capsule: CapsuleRecord,
    visibility: ContentVisibility,
) -> Result<CapsuleResponse, AppError> {
    let open_at = parse_datetime(&capsule.open_at)?;
    let created_at = parse_datetime(&capsule.created_at)?;
    let opened = Utc::now() >= open_at;
    let content = match visibility {
        ContentVisibility::Admin => Some(capsule.content),
        ContentVisibility::Public if opened => Some(capsule.content),
        ContentVisibility::Public => None,
    };

    Ok(CapsuleResponse {
        code: capsule.code,
        title: capsule.title,
        content,
        creator: capsule.creator,
        open_at: format_time(open_at),
        created_at: format_time(created_at),
        opened: Some(opened),
    })
}

/// 生成唯一胶囊码 — 8 位大写字母+数字，最多重试 10 次
async fn generate_unique_code(pool: &SqlitePool) -> Result<String, AppError> {
    for _ in 0..CODE_RETRY_LIMIT {
        let candidate: String = rand::rng()
            .sample_iter(Alphanumeric)
            .take(CODE_LENGTH)
            .map(char::from)
            .map(|ch| ch.to_ascii_uppercase())
            .collect();

        let exists: Option<String> =
            sqlx::query_scalar("SELECT code FROM capsules WHERE code = ?1")
                .bind(&candidate)
                .fetch_optional(pool)
                .await?;

        if exists.is_none() {
            return Ok(candidate);
        }
    }

    Err(AppError::internal("无法生成唯一的胶囊码"))
}

/// 解析 ISO 8601 时间 — 使用 chrono 的 RFC 3339 解析器
fn parse_datetime(value: &str) -> Result<DateTime<Utc>, AppError> {
    DateTime::parse_from_rfc3339(value)
        .map(|time| time.with_timezone(&Utc))
        .map_err(|_| AppError::bad_request("openAt 格式错误，请使用 ISO 8601 格式"))
}

/// 格式化时间为 UTC ISO 8601 — 只保留秒级精度，与其他后端一致
fn format_time(value: DateTime<Utc>) -> String {
    value.to_rfc3339_opts(SecondsFormat::Secs, true)
}

/// 构造 SQLite 连接 URL — :memory: 或文件路径 + ?mode=rwc 自动创建
fn sqlite_url(database_url: &str) -> String {
    if database_url == ":memory:" || database_url.starts_with("sqlite:") {
        database_url.to_string()
    } else {
        format!("sqlite:{}?mode=rwc", database_url)
    }
}

/// CORS 来源检查 — 仅允许 localhost
fn is_localhost_origin(origin: &HeaderValue) -> bool {
    let Ok(origin) = origin.to_str() else {
        return false;
    };
    let Ok(uri) = origin.parse::<Uri>() else {
        return false;
    };
    matches!(uri.host(), Some("localhost"))
}

/// 管理员认证 extractor — 自定义 FromRequestParts 实现 JWT 鉴权
///
/// 这是 Axum 的核心卖点之一：函数参数签名 _admin: AdminAuth
/// 即表达了"需要认证"的语义，比 Gin 的 middleware 更直观。
///
/// 对应其他技术栈的鉴权方式：
/// - Spring Boot: @RequestHeader("Authorization") + 手动验证
/// - FastAPI: Depends(get_current_admin)
/// - Gin: middleware.AdminAuth() 挂载到路由组
/// - NestJS: @UseGuards(AdminAuthGuard)
pub struct AdminAuth;

impl<S> FromRequestParts<S> for AdminAuth
where
    Arc<AppConfig>: FromRef<S>,
    S: Send + Sync,
{
    type Rejection = AppError;

    async fn from_request_parts(parts: &mut Parts, state: &S) -> Result<Self, Self::Rejection> {
        let config = Arc::<AppConfig>::from_ref(state);
        let token = extract_bearer_token(&parts.headers).ok_or_else(AppError::unauthorized)?;
        let mut validation = Validation::new(Algorithm::HS256);
        validation.validate_exp = true;
        decode::<AdminClaims>(
            token,
            &DecodingKey::from_secret(config.jwt_secret.as_bytes()),
            &validation,
        )
        .map_err(|_| AppError::unauthorized())?;
        Ok(Self)
    }
}

/// 从 Authorization header 提取 Bearer token
fn extract_bearer_token(headers: &HeaderMap) -> Option<&str> {
    let header = headers.get(AUTHORIZATION)?.to_str().ok()?;
    header.strip_prefix("Bearer ")
}
