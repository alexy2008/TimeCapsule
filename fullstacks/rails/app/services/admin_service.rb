require "jwt"

# AdminService — 管理员认证业务逻辑
#
# 职责：管理员密码校验 + JWT 令牌的生成与验证。
# 对应关系：与 Spring MVC 的 AdminService、FastAPI 的 admin_service 承担相同职责。
#
# 认证双轨：
#   - Web 页面管理员使用 Rails Session（见 Web::PagesController）；
#   - JSON API 管理员使用此处生成的 JWT Bearer Token（见 Api::V1::AdminController）。
#   两者独立，互不干扰，分别对应"浏览器访问"和"程序调用"两种场景。
#
# JWT 规格：HS256 算法，有效期 2 小时，sub 字段固定为 "admin"。
# 密钥与密码均通过环境变量注入，生产环境必须覆盖默认值。

class AdminService
  # 管理员登录
  #
  # @param password [String] 用户提交的密码
  # @return [String, nil] 验证通过返回 JWT Token，密码错误返回 nil
  def login(password)
    return nil unless password == Hellotime::ADMIN_PASSWORD

    generate_token
  end

  # 验证 JWT Token 是否合法且未过期
  #
  # @param token [String] Bearer Token 原始字符串
  # @return [Boolean] 合法且未过期返回 true，否则返回 false
  def verify_token(token)
    JWT.decode(token, Hellotime::JWT_SECRET, true, algorithm: "HS256")
    true
  rescue JWT::ExpiredSignature, JWT::DecodeError
    # 过期或签名不合法，统一视为未授权
    false
  end

  private

  # 生成 HS256 JWT Token
  #
  # payload 中的 iat（issued at）用于日志追踪，exp 决定过期时间。
  # 有效期由 Hellotime::JWT_EXPIRY_SECS 常量控制（默认 2 小时）。
  def generate_token
    now = Time.now.to_i
    payload = { sub: "admin", iat: now, exp: now + Hellotime::JWT_EXPIRY_SECS }
    JWT.encode(payload, Hellotime::JWT_SECRET, "HS256")
  end
end
