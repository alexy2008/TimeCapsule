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

const DEFAULT_DATABASE_URL: &str = "../../data/hellotime.db";
const DEFAULT_ADMIN_PASSWORD: &str = "timecapsule-admin";
const DEFAULT_JWT_SECRET: &str = "hellotime-jwt-secret-key-that-is-long-enough-for-hs256";
const DEFAULT_JWT_EXPIRATION_HOURS: i64 = 2;
const DEFAULT_HOST: &str = "127.0.0.1";
const DEFAULT_PORT: u16 = 18070;
const CODE_LENGTH: usize = 8;
const CODE_RETRY_LIMIT: usize = 10;

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

#[derive(Clone, Copy)]
enum ContentVisibility {
    Public,
    Admin,
}

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

async fn get_capsule(
    State(state): State<AppState>,
    Path(code): Path<String>,
) -> Result<Json<ApiResponse<CapsuleResponse>>, AppError> {
    validate_code(&code)?;
    let capsule = find_capsule_by_code(&state.pool, &code).await?;
    let response = map_capsule(capsule, ContentVisibility::Public)?;
    Ok(Json(ApiResponse::ok(response, "查询成功")))
}

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

fn validate_code(code: &str) -> Result<(), AppError> {
    if code.len() != CODE_LENGTH || !code.bytes().all(|byte| byte.is_ascii_alphanumeric()) {
        return Err(AppError::not_found("胶囊不存在"));
    }
    Ok(())
}

async fn find_capsule_by_code(pool: &SqlitePool, code: &str) -> Result<CapsuleRecord, AppError> {
    sqlx::query_as::<_, CapsuleRecord>(
        "SELECT code, title, content, creator, open_at, created_at FROM capsules WHERE code = ?1",
    )
    .bind(code)
    .fetch_optional(pool)
    .await?
    .ok_or_else(|| AppError::not_found("胶囊不存在"))
}

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

fn parse_datetime(value: &str) -> Result<DateTime<Utc>, AppError> {
    DateTime::parse_from_rfc3339(value)
        .map(|time| time.with_timezone(&Utc))
        .map_err(|_| AppError::bad_request("openAt 格式错误，请使用 ISO 8601 格式"))
}

fn format_time(value: DateTime<Utc>) -> String {
    value.to_rfc3339_opts(SecondsFormat::Secs, true)
}

fn sqlite_url(database_url: &str) -> String {
    if database_url == ":memory:" || database_url.starts_with("sqlite:") {
        database_url.to_string()
    } else {
        format!("sqlite:{}?mode=rwc", database_url)
    }
}

fn is_localhost_origin(origin: &HeaderValue) -> bool {
    let Ok(origin) = origin.to_str() else {
        return false;
    };
    let Ok(uri) = origin.parse::<Uri>() else {
        return false;
    };
    matches!(uri.host(), Some("localhost"))
}

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

fn extract_bearer_token(headers: &HeaderMap) -> Option<&str> {
    let header = headers.get(AUTHORIZATION)?.to_str().ok()?;
    header.strip_prefix("Bearer ")
}
