# Api::V1::AdminController — 管理员 JSON API
#
# 职责：管理员的登录认证、胶囊列表查询和删除。
# 端点：
#   POST   /api/v1/admin/login           → login（无需认证）
#   GET    /api/v1/admin/capsules        → index（需要 JWT）
#   DELETE /api/v1/admin/capsules/:code  → destroy（需要 JWT）
#
# 认证方式：JWT Bearer Token（由 BaseController#authenticate_jwt! 拦截）
# 与 Web 管理员的 Session 认证相互独立：
#   - API 管理员适合程序调用，无状态；
#   - Web 管理员适合浏览器使用，依赖 Cookie Session。

module Api
  module V1
    class AdminController < BaseController
      # index 和 destroy 需要 JWT 认证；login 本身是认证入口，无需保护
      before_action :authenticate_jwt!, only: [:index, :destroy]

      # 管理员登录，返回 JWT Token
      #
      # 请求体（JSON）：password
      # 成功响应：200，data.token 为 JWT Bearer Token
      # 失败响应：401 UNAUTHORIZED（密码错误）
      def login
        password = params[:password]
        unless password.present?
          return render json: {
            success: false, message: "Password is required", errorCode: "VALIDATION_ERROR"
          }, status: :bad_request
        end

        token = AdminService.new.login(password)
        unless token
          return render json: {
            success: false, message: "Invalid password", errorCode: "UNAUTHORIZED"
          }, status: :unauthorized
        end

        render json: { success: true, data: { token: token } }
      end

      # 分页查询所有胶囊（管理员可见完整内容）
      #
      # 查询参数：page（默认 0）、size（默认 20）
      # 管理员视角下，content 始终可见，无论是否已到开启时间。
      def index
        page = (params[:page] || 0).to_i
        size = (params[:size] || 20).to_i

        data = CapsuleService.new.list_paginated(page, size)
        render json: { success: true, data: data }
      end

      # 删除指定胶囊
      #
      # 成功响应：200 { success: true }
      # 失败响应：404 CAPSULE_NOT_FOUND
      def destroy
        deleted = CapsuleService.new.delete(params[:code])
        unless deleted
          return render json: {
            success: false, message: "Capsule not found", errorCode: "CAPSULE_NOT_FOUND"
          }, status: :not_found
        end

        render json: { success: true }
      end
    end
  end
end
