import Fluent

/// Fluent 迁移定义。
/// 演示项目在启动时自动迁移，优先降低首次运行门槛。
struct CreateCapsuleMigration: AsyncMigration {
    func prepare(on database: any Database) async throws {
        try await database.schema(Capsule.schema)
            .field(.id, .int, .identifier(auto: true))
            .field("code", .string, .required)
            .field("title", .string, .required)
            .field("content", .string, .required)
            .field("creator", .string, .required)
            .field("open_at", .string, .required)
            .field("created_at", .string, .required)
            .unique(on: "code")
            .ignoreExisting()
            .create()
    }

    func revert(on database: any Database) async throws {
        try await database.schema(Capsule.schema).delete()
    }
}
