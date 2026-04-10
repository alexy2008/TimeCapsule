import JWTKit
import Vapor

/// 管理员认证服务。
/// Vapor 版把签名与验签都显式写在服务和中间件里，避免把演示项目隐藏在黑盒插件之后。
struct AdminAuthService: Sendable {
    let config: AppConfig

    func login(password: String) async throws -> String {
        guard password == config.adminPassword else {
            throw AppAbortError(status: .unauthorized, reason: "密码错误", errorCode: "UNAUTHORIZED")
        }

        let now = Date()
        let payload = AdminTokenPayload(
            subject: SubjectClaim(value: "admin"),
            expiration: ExpirationClaim(value: now.addingTimeInterval(TimeInterval(config.jwtExpirationHours * 3600))),
            issuedAt: IssuedAtClaim(value: now)
        )

        let keys = try await makeKeyCollection()
        return try await keys.sign(payload)
    }

    func verify(token: String) async throws -> AdminTokenPayload {
        let keys = try await makeKeyCollection()
        return try await keys.verify(token, as: AdminTokenPayload.self)
    }

    private func makeKeyCollection() async throws -> JWTKeyCollection {
        let keys = JWTKeyCollection()
        _ = await keys.add(hmac: HMACKey(from: config.jwtSecret), digestAlgorithm: .sha256)
        return keys
    }
}

struct AdminTokenPayload: JWTPayload, Sendable {
    let subject: SubjectClaim
    let expiration: ExpirationClaim
    let issuedAt: IssuedAtClaim

    enum CodingKeys: String, CodingKey {
        case subject = "sub"
        case expiration = "exp"
        case issuedAt = "iat"
    }

    func verify(using _: some JWTAlgorithm) async throws {
        try expiration.verifyNotExpired()
        guard subject.value == "admin" else {
            throw AppAbortError(status: .unauthorized, reason: "认证令牌无效或已过期", errorCode: "UNAUTHORIZED")
        }
    }
}

struct AdminTokenMiddleware: AsyncMiddleware {
    let config: AppConfig

    func respond(to request: Request, chainingTo next: any AsyncResponder) async throws -> Response {
        guard let token = request.headers.bearerAuthorization?.token else {
            throw AppAbortError(status: .unauthorized, reason: "认证令牌无效或已过期", errorCode: "UNAUTHORIZED")
        }

        _ = try await AdminAuthService(config: config).verify(token: token)
        return try await next.respond(to: request)
    }
}
