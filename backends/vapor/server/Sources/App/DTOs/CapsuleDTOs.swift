import Vapor

struct CreateCapsuleRequest: Content, Validatable {
    let title: String
    let content: String
    let creator: String
    let openAt: String

    static func validations(_ validations: inout Validations) {
        validations.add("title", as: String.self, is: .count(1...100), required: true)
        validations.add("content", as: String.self, is: !.empty, required: true)
        validations.add("creator", as: String.self, is: .count(1...30), required: true)
        validations.add("openAt", as: String.self, is: !.empty, required: true)
    }
}

struct CapsuleCreatedResponse: Content {
    let code: String
    let title: String
    let creator: String
    let openAt: String
    let createdAt: String
}

struct CapsuleDetailResponse: Content {
    let code: String
    let title: String
    let content: String?
    let creator: String
    let openAt: String
    let createdAt: String
    let opened: Bool
}

struct CapsulePageResponse: Content {
    let content: [CapsuleDetailResponse]
    let totalElements: Int
    let totalPages: Int
    let number: Int
    let size: Int
}

struct HealthStatusResponse: Content {
    let status: String
    let timestamp: String
    let techStack: TechStackResponse
}

struct TechStackResponse: Content {
    let framework: String
    let language: String
    let database: String
}
