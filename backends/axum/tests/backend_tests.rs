use axum::{
    body::Body,
    http::{Method, Request, StatusCode, header},
};
use hellotime_axum::{AppConfig, create_app};
use serde_json::Value;
use tempfile::TempDir;
use tower::util::ServiceExt;

struct TestContext {
    _temp_dir: TempDir,
    app: axum::Router,
}

impl TestContext {
    async fn new() -> Self {
        let temp_dir = tempfile::tempdir().expect("create temp dir");
        let db_path = temp_dir.path().join("hellotime-axum-test.db");
        let config = AppConfig {
            database_url: db_path.display().to_string(),
            admin_password: "timecapsule-admin".to_string(),
            jwt_secret: "test-jwt-secret-key-which-is-long-enough".to_string(),
            jwt_expiration_hours: 2,
            host: "127.0.0.1".to_string(),
            port: 0,
        };
        let app = create_app(config).await.expect("create app");
        Self {
            _temp_dir: temp_dir,
            app,
        }
    }

    async fn json_request(
        &self,
        method: Method,
        uri: &str,
        body: Option<Value>,
        token: Option<&str>,
    ) -> (StatusCode, Value) {
        let mut builder = Request::builder().method(method).uri(uri);
        if let Some(token) = token {
            builder = builder.header(header::AUTHORIZATION, format!("Bearer {token}"));
        }
        let request = builder
            .header(header::CONTENT_TYPE, "application/json")
            .body(match body {
                Some(body) => Body::from(body.to_string()),
                None => Body::empty(),
            })
            .expect("build request");

        let response = self
            .app
            .clone()
            .oneshot(request)
            .await
            .expect("send request");
        let status = response.status();
        let bytes = axum::body::to_bytes(response.into_body(), usize::MAX)
            .await
            .expect("read body");
        let value = serde_json::from_slice(&bytes).expect("parse json");
        (status, value)
    }
}

#[tokio::test]
async fn health_returns_up() {
    let context = TestContext::new().await;
    let (status, body) = context
        .json_request(Method::GET, "/api/v1/health", None, None)
        .await;

    assert_eq!(status, StatusCode::OK);
    assert_eq!(body["data"]["status"], "UP");
    assert_eq!(body["data"]["techStack"]["framework"], "Axum 0.8");
    assert_eq!(body["data"]["techStack"]["language"], "Rust 1.94");
}

#[tokio::test]
async fn create_and_fetch_locked_capsule() {
    let context = TestContext::new().await;
    let payload = serde_json::json!({
        "title": "Axum 测试",
        "content": "未来再看",
        "creator": "测试者",
        "openAt": (chrono::Utc::now() + chrono::Duration::minutes(10)).to_rfc3339(),
    });

    let (create_status, create_body) = context
        .json_request(Method::POST, "/api/v1/capsules", Some(payload), None)
        .await;
    let code = create_body["data"]["code"].as_str().expect("capsule code");

    assert_eq!(create_status, StatusCode::CREATED);
    assert_eq!(code.len(), 8);

    let (get_status, get_body) = context
        .json_request(Method::GET, &format!("/api/v1/capsules/{code}"), None, None)
        .await;

    assert_eq!(get_status, StatusCode::OK);
    assert_eq!(get_body["data"]["opened"], false);
    assert!(get_body["data"]["content"].is_null());
}

#[tokio::test]
async fn invalid_time_returns_400() {
    let context = TestContext::new().await;
    let payload = serde_json::json!({
        "title": "非法时间",
        "content": "内容",
        "creator": "测试者",
        "openAt": "not-a-date",
    });

    let (status, body) = context
        .json_request(Method::POST, "/api/v1/capsules", Some(payload), None)
        .await;

    assert_eq!(status, StatusCode::BAD_REQUEST);
    assert_eq!(body["errorCode"], "BAD_REQUEST");
}

#[tokio::test]
async fn admin_can_list_and_delete_capsules() {
    let context = TestContext::new().await;
    let payload = serde_json::json!({
        "title": "管理员可见",
        "content": "完整内容",
        "creator": "测试者",
        "openAt": (chrono::Utc::now() + chrono::Duration::minutes(10)).to_rfc3339(),
    });

    let (_, create_body) = context
        .json_request(Method::POST, "/api/v1/capsules", Some(payload), None)
        .await;
    let code = create_body["data"]["code"].as_str().expect("capsule code");

    let (login_status, login_body) = context
        .json_request(
            Method::POST,
            "/api/v1/admin/login",
            Some(serde_json::json!({ "password": "timecapsule-admin" })),
            None,
        )
        .await;
    let token = login_body["data"]["token"].as_str().expect("admin token");

    assert_eq!(login_status, StatusCode::OK);

    let (list_status, list_body) = context
        .json_request(
            Method::GET,
            "/api/v1/admin/capsules?page=0&size=20",
            None,
            Some(token),
        )
        .await;
    assert_eq!(list_status, StatusCode::OK);
    assert_eq!(list_body["data"]["content"][0]["content"], "完整内容");

    let (delete_status, _) = context
        .json_request(
            Method::DELETE,
            &format!("/api/v1/admin/capsules/{code}"),
            None,
            Some(token),
        )
        .await;
    assert_eq!(delete_status, StatusCode::OK);
}
