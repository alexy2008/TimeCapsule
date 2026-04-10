import Vapor

/// 健康检查控制器。
/// 除了服务状态，还返回技术栈信息，供前端首页动态展示当前后端实现。
struct HealthController: RouteCollection {
    func boot(routes: RoutesBuilder) throws {
        routes.get("health", use: health)
    }

    func health(req: Request) async throws -> ApiResponse<HealthStatusResponse> {
        let config = req.application.helloTimeConfig
        let payload = HealthStatusResponse(
            status: "UP",
            timestamp: Date().helloTimeString,
            techStack: TechStackResponse(
                framework: "Vapor 4",
                language: config.swiftRuntimeLabel,
                database: "SQLite"
            )
        )

        return .ok(payload)
    }
}
