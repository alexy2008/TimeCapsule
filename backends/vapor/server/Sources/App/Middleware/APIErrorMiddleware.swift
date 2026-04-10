import Vapor

/// 全局错误映射中间件。
/// Vapor 默认错误会暴露框架内部结构，这里统一转成仓库约定的 `{ success, data, message, errorCode }`。
struct APIErrorMiddleware: AsyncMiddleware {
    func respond(to request: Request, chainingTo next: AsyncResponder) async throws -> Response {
        do {
            return try await next.respond(to: request)
        } catch let error as AppAbortError {
            return try encodeError(status: error.status, message: error.reason, errorCode: error.errorCode, for: request)
        } catch let error as ValidationsError {
            return try encodeError(status: .badRequest, message: error.description, errorCode: "VALIDATION_ERROR", for: request)
        } catch is DecodingError {
            return try encodeError(status: .badRequest, message: "请求体格式错误", errorCode: "VALIDATION_ERROR", for: request)
        } catch let error as AbortError {
            return try encodeError(
                status: error.status,
                message: message(for: error),
                errorCode: errorCode(for: error.status),
                for: request
            )
        } catch {
            request.logger.report(error: error)
            return try encodeError(status: .internalServerError, message: "服务器内部错误", errorCode: "INTERNAL_ERROR", for: request)
        }
    }

    private func encodeError(
        status: HTTPResponseStatus,
        message: String,
        errorCode: String,
        for request: Request
    ) throws -> Response {
        let response = Response(status: status)
        try response.content.encode(ApiResponse<EmptyPayload>.error(message, errorCode: errorCode))
        return response
    }

    private func message(for error: any AbortError) -> String {
        if !error.reason.isEmpty, error.reason != error.status.reasonPhrase {
            return error.reason
        }

        switch error.status {
        case .unauthorized:
            return "认证令牌无效或已过期"
        case .notFound:
            return "资源不存在"
        case .badRequest:
            return "请求参数无效"
        default:
            return "服务器内部错误"
        }
    }

    private func errorCode(for status: HTTPResponseStatus) -> String {
        switch status {
        case .unauthorized:
            return "UNAUTHORIZED"
        case .notFound:
            return "CAPSULE_NOT_FOUND"
        case .badRequest:
            return "BAD_REQUEST"
        default:
            return "INTERNAL_ERROR"
        }
    }
}

struct AppAbortError: AbortError, Sendable {
    let status: HTTPResponseStatus
    let reason: String
    let errorCode: String
}
