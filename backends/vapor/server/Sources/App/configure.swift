import Fluent
import FluentSQLiteDriver
import Vapor

/// 配置 Vapor 应用入口。
/// 这里集中注册数据库、JWT、全局中间件和路由，保持启动路径清晰可对照。
public func configure(_ app: Application) throws {
    let config = AppConfig.load(from: app.environment)
    app.helloTimeConfig = config

    app.http.server.configuration.hostname = config.host
    app.http.server.configuration.port = config.port

    try configureDatabase(for: app, config: config)

    app.middleware.use(APIErrorMiddleware())
    app.middleware.use(LocalhostCORSMiddleware())
    app.middleware.use(FileMiddleware(publicDirectory: app.directory.publicDirectory))

    app.migrations.add(CreateCapsuleMigration())

    try routes(app)
    try app.autoMigrate().wait()
}

private func configureDatabase(for app: Application, config: AppConfig) throws {
    if config.databaseURL == ":memory:" {
        app.databases.use(.sqlite(.memory), as: .sqlite)
        return
    }

    let databasePath = URL(
        fileURLWithPath: config.databaseURL,
        relativeTo: URL(fileURLWithPath: app.directory.workingDirectory, isDirectory: true)
    ).standardizedFileURL.path

    let databaseDirectory = URL(fileURLWithPath: databasePath).deletingLastPathComponent()
    try FileManager.default.createDirectory(at: databaseDirectory, withIntermediateDirectories: true)

    app.databases.use(.sqlite(.file(databasePath)), as: .sqlite)
}
