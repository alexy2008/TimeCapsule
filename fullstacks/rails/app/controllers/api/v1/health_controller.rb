# Api::V1::HealthController — 健康检查端点
#
# 职责：返回服务存活状态和技术栈信息。
# 前端通过此端点获取 Rails / Ruby 版本，动态展示首页技术栈卡片。
# 无需认证，供监控系统和前端初始化时调用。

module Api
  module V1
    class HealthController < BaseController
      # GET /api/v1/health
      #
      # 返回：status=UP、当前时间戳（UTC ISO8601）、技术栈版本信息
      def show
        render json: {
          success: true,
          data: {
            status: "UP",
            timestamp: Time.now.utc.iso8601,
            techStack: {
              framework: "Rails #{Rails::VERSION::STRING}",
              language: "Ruby #{RUBY_VERSION}",
              database: "SQLite"
            }
          }
        }
      end
    end
  end
end
