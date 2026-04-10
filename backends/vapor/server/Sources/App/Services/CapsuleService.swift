import Fluent
import Vapor

/// 胶囊业务服务。
/// 公开详情和管理员列表共用同一模型，但通过 `includeContent` 控制正文暴露策略。
struct CapsuleService: Sendable {
    private let db: any Database

    private let codeAlphabet = Array("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789")
    private let maxCodeRetries = 10

    init(db: any Database) {
        self.db = db
    }

    func create(_ input: CreateCapsuleRequest) async throws -> CapsuleCreatedResponse {
        guard let openAt = Date.parseHelloTime(input.openAt) else {
            throw AppAbortError(status: .badRequest, reason: "openAt 格式错误，请使用 ISO 8601 格式", errorCode: "VALIDATION_ERROR")
        }

        let now = Date()
        guard openAt > now else {
            throw AppAbortError(status: .badRequest, reason: "开启时间必须在未来", errorCode: "BAD_REQUEST")
        }

        let code = try await generateUniqueCode()
        let capsule = Capsule(
            code: code,
            title: input.title,
            content: input.content,
            creator: input.creator,
            openAt: openAt,
            createdAt: now
        )

        try await capsule.save(on: db)

        return CapsuleCreatedResponse(
            code: code,
            title: capsule.title,
            creator: capsule.creator,
            openAt: capsule.openAt,
            createdAt: capsule.createdAt
        )
    }

    func get(code: String) async throws -> CapsuleDetailResponse {
        guard let capsule = try await Capsule.query(on: db).filter(\.$code == code).first() else {
            throw AppAbortError(status: .notFound, reason: "胶囊不存在：\(code)", errorCode: "CAPSULE_NOT_FOUND")
        }

        return toDetailResponse(from: capsule, includeContent: false)
    }

    func list(page: Int, size: Int) async throws -> CapsulePageResponse {
        let safePage = max(page, 0)
        let safeSize = min(max(size, 1), 100)

        let totalElements = try await Capsule.query(on: db).count()
        let totalPages = max(1, Int(ceil(Double(totalElements) / Double(safeSize))))
        let capsules = try await Capsule.query(on: db)
            .sort(\.$createdAt, .descending)
            .range(safePage * safeSize..<(safePage * safeSize + safeSize))
            .all()

        return CapsulePageResponse(
            content: capsules.map { toDetailResponse(from: $0, includeContent: true) },
            totalElements: totalElements,
            totalPages: totalPages,
            number: safePage,
            size: safeSize
        )
    }

    func delete(code: String) async throws {
        guard let capsule = try await Capsule.query(on: db).filter(\.$code == code).first() else {
            throw AppAbortError(status: .notFound, reason: "胶囊不存在：\(code)", errorCode: "CAPSULE_NOT_FOUND")
        }

        try await capsule.delete(on: db)
    }

    private func toDetailResponse(from capsule: Capsule, includeContent: Bool) -> CapsuleDetailResponse {
        let openAtDate = Date.parseHelloTime(capsule.openAt) ?? .distantPast
        let opened = Date() > openAtDate
        return CapsuleDetailResponse(
            code: capsule.code,
            title: capsule.title,
            content: includeContent || opened ? capsule.content : nil,
            creator: capsule.creator,
            openAt: capsule.openAt,
            createdAt: capsule.createdAt,
            opened: opened
        )
    }

    private func generateUniqueCode() async throws -> String {
        for _ in 0..<maxCodeRetries {
            let code = String((0..<8).map { _ in codeAlphabet.randomElement()! })
            let existing = try await Capsule.query(on: db).filter(\.$code == code).first()
            if existing == nil {
                return code
            }
        }

        throw AppAbortError(status: .internalServerError, reason: "无法生成唯一的胶囊码", errorCode: "INTERNAL_ERROR")
    }
}
