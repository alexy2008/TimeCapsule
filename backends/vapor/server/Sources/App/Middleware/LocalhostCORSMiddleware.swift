import Foundation
import Vapor

/// 为本地前端开发服务器回显正确的 Origin。
/// 前后端分离实现运行在 localhost 的不同端口，固定写死单一源站会导致浏览器拦截响应。
struct LocalhostCORSMiddleware: AsyncMiddleware {
    func respond(to request: Request, chainingTo next: AsyncResponder) async throws -> Response {
        let allowedOrigin = resolveAllowedOrigin(from: request)

        if request.method == .OPTIONS {
            let response = Response(status: .noContent)
            applyCorsHeaders(to: &response.headers, allowedOrigin: allowedOrigin)
            return response
        }

        let response = try await next.respond(to: request)
        applyCorsHeaders(to: &response.headers, allowedOrigin: allowedOrigin)
        return response
    }

    private func resolveAllowedOrigin(from request: Request) -> String? {
        guard
            let origin = request.headers.first(name: .origin),
            let components = URLComponents(string: origin),
            let host = components.host?.lowercased(),
            let scheme = components.scheme?.lowercased(),
            ["http", "https"].contains(scheme),
            ["localhost", "127.0.0.1"].contains(host)
        else {
            return nil
        }

        return origin
    }

    private func applyCorsHeaders(to headers: inout HTTPHeaders, allowedOrigin: String?) {
        if let allowedOrigin {
            headers.replaceOrAdd(name: .accessControlAllowOrigin, value: allowedOrigin)
        }

        headers.replaceOrAdd(name: .accessControlAllowHeaders, value: "Accept, Authorization, Content-Type, Origin, X-Requested-With")
        headers.replaceOrAdd(name: .accessControlAllowMethods, value: "GET, POST, DELETE, OPTIONS")
        headers.replaceOrAdd(name: .accessControlAllowCredentials, value: "true")
        headers.replaceOrAdd(name: .accessControlMaxAge, value: "600")
        headers.replaceOrAdd(name: .vary, value: "Origin")
    }
}
