# Api::V1::BaseController — JSON API 控制器基类
#
# 职责：为所有 /api/v1/* 端点提供共用行为：
#   1. 跳过 CSRF 校验（JSON API 通过 JWT 认证，不依赖浏览器 Cookie）
#   2. 统一异常拦截，将 Rails 异常转为 { success, message, errorCode } 格式
#   3. 提供 authenticate_jwt! 过滤器，供需要鉴权的子控制器调用
#
# 响应结构约定：
#   所有 API 响应均遵循 { success: bool, data: ..., message: ..., errorCode: ... }，
#   与其他技术栈实现保持一致，便于前端统一处理错误。

module Api
  module V1
    class BaseController < ActionController::Base
      # JSON API 不使用浏览器 Cookie/Session，无需 CSRF 保护
      skip_before_action :verify_authenticity_token

      # 兜底异常处理：将未捕获的服务端错误统一返回 500
      rescue_from StandardError do |e|
        render json: { success: false, message: e.message, errorCode: "INTERNAL_ERROR" }, status: :internal_server_error
      end

      # 请求参数缺失时返回 400 VALIDATION_ERROR，与其他技术栈错误码一致
      rescue_from ActionController::ParameterMissing do |e|
        render json: { success: false, message: e.message, errorCode: "VALIDATION_ERROR" }, status: :bad_request
      end

      private

      # JWT Bearer Token 认证过滤器
      #
      # 从 Authorization 头提取 Bearer Token，调用 AdminService 验证。
      # 验证失败则中止请求，返回 401 UNAUTHORIZED。
      # 在子控制器中通过 before_action :authenticate_jwt! 挂载到受保护路由。
      def authenticate_jwt!
        header = request.headers["Authorization"]
        token = header&.match(/^Bearer\s+(.+)$/)&.captures&.first

        unless token && AdminService.new.verify_token(token)
          render json: { success: false, message: "Unauthorized", errorCode: "UNAUTHORIZED" }, status: :unauthorized
        end
      end
    end
  end
end
