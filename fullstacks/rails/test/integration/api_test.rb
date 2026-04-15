require "test_helper"

class ApiTest < ActionDispatch::IntegrationTest
  setup do
    Capsule.delete_all
  end

  # ── Health ──────────────────────────────────────────────────────────────────

  test "health endpoint returns UP" do
    get "/api/v1/health"
    assert_response :ok

    json = JSON.parse(response.body)
    assert_equal true, json["success"]
    assert_equal "UP", json.dig("data", "status")
    assert json.dig("data", "techStack", "framework").start_with?("Rails")
    assert json.dig("data", "techStack", "language").start_with?("Ruby")
    assert_equal "SQLite", json.dig("data", "techStack", "database")
  end

  # ── Create capsule ─────────────────────────────────────────────────────────

  test "create capsule returns 201 with code" do
    post "/api/v1/capsules", params: {
      title: "时间胶囊测试", content: "未来的你好", creator: "alex", openAt: "2099-01-01T00:00:00Z"
    }, as: :json

    assert_response :created
    json = JSON.parse(response.body)
    assert_equal true, json["success"]

    code = json.dig("data", "code")
    assert_equal 8, code.length
    assert_match(/\A[A-Z0-9]{8}\z/, code)
    assert json.dig("data", "title")
    assert json.dig("data", "creator")
    assert json.dig("data", "openAt")
    assert json.dig("data", "createdAt")
  end

  test "create capsule rejects past date" do
    post "/api/v1/capsules", params: {
      title: "过去", content: "内容", creator: "alex", openAt: "2000-01-01T00:00:00Z"
    }, as: :json

    assert_response :bad_request
    json = JSON.parse(response.body)
    assert_equal false, json["success"]
    assert_equal "VALIDATION_ERROR", json["errorCode"]
  end

  test "create capsule validates required fields" do
    post "/api/v1/capsules", params: {}, as: :json

    assert_response :bad_request
    json = JSON.parse(response.body)
    assert_equal false, json["success"]
    assert_equal "VALIDATION_ERROR", json["errorCode"]
  end

  # ── Get capsule ────────────────────────────────────────────────────────────

  test "get capsule hides content before open time" do
    post "/api/v1/capsules", params: {
      title: "未来消息", content: "秘密", creator: "test", openAt: "2099-01-01T00:00:00Z"
    }, as: :json
    code = JSON.parse(response.body).dig("data", "code")

    get "/api/v1/capsules/#{code}"
    assert_response :ok

    json = JSON.parse(response.body)
    assert_equal true, json["success"]
    assert_nil json.dig("data", "content")
    assert_equal false, json.dig("data", "opened")
  end

  test "get capsule returns 404 for unknown code" do
    get "/api/v1/capsules/XXXXXXXX"
    assert_response :not_found

    json = JSON.parse(response.body)
    assert_equal false, json["success"]
    assert_equal "CAPSULE_NOT_FOUND", json["errorCode"]
  end

  # ── Admin login ────────────────────────────────────────────────────────────

  test "admin login succeeds with correct password" do
    post "/api/v1/admin/login", params: { password: "timecapsule-admin" }, as: :json

    assert_response :ok
    json = JSON.parse(response.body)
    assert_equal true, json["success"]
    assert json.dig("data", "token").present?
  end

  test "admin login fails with wrong password" do
    post "/api/v1/admin/login", params: { password: "wrong-password" }, as: :json

    assert_response :unauthorized
    json = JSON.parse(response.body)
    assert_equal false, json["success"]
    assert_equal "UNAUTHORIZED", json["errorCode"]
  end

  # ── Admin list & delete ────────────────────────────────────────────────────

  test "admin can list capsules with jwt" do
    post "/api/v1/capsules", params: {
      title: "管理员可见", content: "内容", creator: "alex", openAt: "2099-01-01T00:00:00Z"
    }, as: :json

    token = login_admin

    get "/api/v1/admin/capsules", headers: { "Authorization" => "Bearer #{token}" }
    assert_response :ok

    json = JSON.parse(response.body)
    assert_equal true, json["success"]
    assert json.dig("data", "totalElements") >= 1
    assert json.dig("data", "content").is_a?(Array)
  end

  test "admin list requires jwt" do
    get "/api/v1/admin/capsules"
    assert_response :unauthorized
  end

  test "admin can delete capsule with jwt" do
    post "/api/v1/capsules", params: {
      title: "待删除", content: "内容", creator: "alex", openAt: "2099-01-01T00:00:00Z"
    }, as: :json
    code = JSON.parse(response.body).dig("data", "code")

    token = login_admin

    delete "/api/v1/admin/capsules/#{code}", headers: { "Authorization" => "Bearer #{token}" }
    assert_response :ok

    json = JSON.parse(response.body)
    assert_equal true, json["success"]

    assert_nil Capsule.find_by(code: code)
  end

  test "admin delete nonexistent capsule returns 404" do
    token = login_admin

    delete "/api/v1/admin/capsules/XXXXXXXX", headers: { "Authorization" => "Bearer #{token}" }
    assert_response :not_found

    json = JSON.parse(response.body)
    assert_equal "CAPSULE_NOT_FOUND", json["errorCode"]
  end

  private

  def login_admin
    post "/api/v1/admin/login", params: { password: "timecapsule-admin" }, as: :json
    JSON.parse(response.body).dig("data", "token")
  end
end
