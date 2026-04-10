import Vapor

/// 管理员接口控制器。
/// Vapor 版使用 JWTAuthenticator + guardMiddleware 组合保护路由，体现框架原生认证流。
struct AdminController: RouteCollection {
    let config: AppConfig

    func boot(routes: RoutesBuilder) throws {
        let admin = routes.grouped("admin")
        admin.post("login", use: login)

        let protected = admin.grouped(AdminTokenMiddleware(config: config))
        protected.get("capsules", use: listCapsules)
        protected.delete("capsules", ":code", use: deleteCapsule)
    }

    func login(req: Request) async throws -> ApiResponse<AdminTokenResponse> {
        try AdminLoginRequest.validate(content: req)
        let input = try req.content.decode(AdminLoginRequest.self)
        let token = try await AdminAuthService(config: req.application.helloTimeConfig)
            .login(password: input.password)

        return .ok(AdminTokenResponse(token: token), message: "登录成功")
    }

    func listCapsules(req: Request) async throws -> ApiResponse<CapsulePageResponse> {
        let query = try req.query.decode(AdminListCapsulesQuery.self)
        let page = try await CapsuleService(db: req.db).list(page: query.page ?? 0, size: query.size ?? 20)
        return .ok(page)
    }

    func deleteCapsule(req: Request) async throws -> ApiResponse<EmptyPayload> {
        guard let code = req.parameters.get("code"), !code.isEmpty else {
            throw AppAbortError(status: .badRequest, reason: "缺少胶囊编码", errorCode: "BAD_REQUEST")
        }

        try await CapsuleService(db: req.db).delete(code: code)
        return .ok(nil, message: "删除成功")
    }
}
