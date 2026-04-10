import Fluent
import Vapor

/// Fluent 模型。
/// Vapor/Fluent 版直接用类型安全字段映射数据库列，而不是手写 SQL 或 DTO 结构体持久化。
final class Capsule: Model, @unchecked Sendable {
    static let schema = "capsules"

    @ID(custom: .id, generatedBy: .database)
    var id: Int?

    @Field(key: "code")
    var code: String

    @Field(key: "title")
    var title: String

    @Field(key: "content")
    var content: String

    @Field(key: "creator")
    var creator: String

    @Field(key: "open_at")
    var openAt: String

    @Field(key: "created_at")
    var createdAt: String

    init() {}

    init(code: String, title: String, content: String, creator: String, openAt: Date, createdAt: Date) {
        self.code = code
        self.title = title
        self.content = content
        self.creator = creator
        self.openAt = openAt.helloTimeString
        self.createdAt = createdAt.helloTimeString
    }
}
