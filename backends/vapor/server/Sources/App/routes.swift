import Vapor

/// 统一注册 `/api/v1` 路由。
/// Vapor 版按 RouteCollection 组织，而不是把所有端点堆在单一文件里。
func routes(_ app: Application) throws {
    let api = app.grouped("api", "v1")
    try api.register(collection: HealthController())
    try api.register(collection: CapsuleController())
    try api.register(collection: AdminController(config: app.helloTimeConfig))
}
