import Vapor

/// 公开胶囊接口控制器。
/// 这里保留薄控制器，仅负责请求解码与调用服务层，业务规则集中在 CapsuleService。
struct CapsuleController: RouteCollection {
    func boot(routes: RoutesBuilder) throws {
        routes.post("capsules", use: create)
        routes.get("capsules", ":code", use: get)
    }

    func create(req: Request) async throws -> Response {
        try CreateCapsuleRequest.validate(content: req)
        let input = try req.content.decode(CreateCapsuleRequest.self)
        let created = try await CapsuleService(db: req.db).create(input)

        let response = ApiResponse<CapsuleCreatedResponse>.ok(created, message: "胶囊创建成功")
        return try await response.encodeResponse(status: .created, for: req)
    }

    func get(req: Request) async throws -> ApiResponse<CapsuleDetailResponse> {
        guard let code = req.parameters.get("code"), !code.isEmpty else {
            throw AppAbortError(status: .badRequest, reason: "缺少胶囊编码", errorCode: "BAD_REQUEST")
        }

        let capsule = try await CapsuleService(db: req.db).get(code: code)
        return .ok(capsule)
    }
}
