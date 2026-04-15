# Api::V1::CapsulesController — 胶囊 JSON API
#
# 职责：对外暴露胶囊的创建与查询端点，无需认证。
# 端点：
#   POST /api/v1/capsules        → create（创建胶囊）
#   GET  /api/v1/capsules/:code  → show（查询胶囊详情）
#
# 内容隐藏规则：show 调用 CapsuleService#get_by_code，
# 该方法在开启时间未到时将 content 设为 nil，普通用户无法提前读取内容。

module Api
  module V1
    class CapsulesController < BaseController
      # 创建时间胶囊
      #
      # 请求体（JSON）：title, content, creator, openAt（ISO8601 UTC）
      # 成功响应：201 Created，data 包含 code、title、creator、openAt、createdAt
      # 失败响应：400 VALIDATION_ERROR（字段缺失或 openAt 不是未来时间）
      def create
        # 手动校验必填字段，与其他技术栈保持相同的错误码和消息格式
        required = %i[title content creator openAt]
        missing = required.select { |k| params[k].blank? }
        unless missing.empty?
          return render json: {
            success: false,
            message: "Missing required fields: #{missing.join(', ')}",
            errorCode: "VALIDATION_ERROR"
          }, status: :bad_request
        end

        capsule = CapsuleService.new.create(
          title: params[:title],
          content: params[:content],
          creator: params[:creator],
          openAt: params[:openAt]
        )

        # 创建响应不返回 content，避免用户绕过开启时间限制
        render json: {
          success: true,
          data: {
            code: capsule.code,
            title: capsule.title,
            creator: capsule.creator,
            openAt: capsule.open_at.utc.iso8601,
            createdAt: capsule.created_at.utc.iso8601
          }
        }, status: :created
      rescue ArgumentError => e
        # CapsuleService 在 openAt 为过去时间时抛出 ArgumentError
        render json: { success: false, message: e.message, errorCode: "VALIDATION_ERROR" }, status: :bad_request
      end

      # 查询胶囊详情
      #
      # 成功响应：200，data 包含胶囊信息；开启时间未到时 content 为 nil，opened 为 false
      # 失败响应：404 CAPSULE_NOT_FOUND
      def show
        data = CapsuleService.new.get_by_code(params[:code])
        unless data
          return render json: {
            success: false,
            message: "Capsule not found",
            errorCode: "CAPSULE_NOT_FOUND"
          }, status: :not_found
        end

        render json: { success: true, data: data }
      end
    end
  end
end
