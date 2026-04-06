import Foundation

// MARK: - Unified API envelope (mirrors ApiResponse<T> from TypeScript types)
struct APIEnvelope<T: Decodable>: Decodable {
    let success: Bool
    let data: T?
    let message: String?
    let errorCode: String?
}

// MARK: - Core domain models

struct Capsule: Codable, Identifiable, Sendable {
    let code: String
    let title: String
    let content: String?
    let creator: String
    let openAt: Date
    let createdAt: Date
    let opened: Bool?

    var id: String { code }
    var isUnlocked: Bool { opened ?? (openAt <= Date()) }
}

struct CreateCapsuleRequest: Codable, Sendable {
    let title: String
    let content: String
    let creator: String
    let openAt: Date
}

struct AdminLoginRequest: Codable, Sendable {
    let password: String
}

struct AdminToken: Codable, Sendable {
    let token: String
}

struct TechStack: Codable, Sendable {
    let framework: String
    let language: String
    let database: String
}

struct HealthInfo: Codable, Sendable {
    let status: String
    let timestamp: Date
    let techStack: TechStack
}

struct PageData<T: Codable & Sendable>: Codable, Sendable {
    let content: [T]
    let totalElements: Int
    let totalPages: Int
    let number: Int
    let size: Int
}

// MARK: - Empty response sentinel (for DELETE 204)
struct EmptyResponse: Codable, Sendable {}
