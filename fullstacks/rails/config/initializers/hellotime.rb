# Hellotime 应用常量初始化
#
# 从环境变量读取运行时配置，提供开发环境默认值。
# 生产部署时必须通过环境变量覆盖以下默认值：
#   JWT_SECRET      — 用于签发和验证 JWT Token 的 HMAC 密钥，长度 ≥ 32 字节
#   ADMIN_PASSWORD  — 管理员密码，建议使用强密码
#
# 这些常量在 AdminService 中使用，其他地方不应直接引用环境变量，
# 统一通过此模块访问，便于集中管理和测试覆盖。

module Hellotime
  JWT_SECRET = ENV.fetch("JWT_SECRET", "hellotime-jwt-secret-key-that-is-long-enough-for-hs256")
  ADMIN_PASSWORD = ENV.fetch("ADMIN_PASSWORD", "timecapsule-admin")
  # JWT 有效期 2 小时，与其他技术栈实现保持一致
  JWT_EXPIRY_SECS = 2 * 3600
end
