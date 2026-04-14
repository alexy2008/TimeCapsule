import Foundation

// MARK: - API errors

enum APIError: LocalizedError {
    case invalidBaseURL
    case invalidResponse
    case server(message: String)
    case missingData

    var errorDescription: String? {
        switch self {
        case .invalidBaseURL:
            return "服务地址无效，请检查 API 地址配置。"
        case .invalidResponse:
            return "服务返回了无法识别的响应。"
        case .server(let message):
            return message
        case .missingData:
            return "服务响应缺少业务数据。"
        }
    }
}

// MARK: - HTTP client (mirrors TypeScript api/index.ts)
//
// 这是与 Web 端通用的核心网络层 API：
// 职责是对齐各前端项目中的 `api/index.ts` 结构，提供强类型网络交互。
// 为了在不同语言间做到无缝衔接，这里强制要求响应始终解包为 APIEnvelope 层结构，
// 并把所有框架内或远程服务的异常集中抛出为 APIError 类型。

struct APIClient: Sendable {
    let baseURL: URL

    private static let decoder: JSONDecoder = {
        let d = JSONDecoder()
        // Support both ISO8601 with and without fractional seconds
        let formatter = ISO8601DateFormatter()
        formatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        let formatterNoFrac = ISO8601DateFormatter()
        formatterNoFrac.formatOptions = [.withInternetDateTime]
        d.dateDecodingStrategy = .custom { decoder in
            let container = try decoder.singleValueContainer()
            let str = try container.decode(String.self)
            if let date = formatter.date(from: str) { return date }
            if let date = formatterNoFrac.date(from: str) { return date }
            throw DecodingError.dataCorruptedError(in: container, debugDescription: "Invalid date: \(str)")
        }
        return d
    }()

    private static let encoder: JSONEncoder = {
        let e = JSONEncoder()
        e.dateEncodingStrategy = .iso8601
        return e
    }()

    // MARK: Public API surface

    func health() async throws -> HealthInfo {
        try await request(path: "health", method: "GET", body: nil as String?)
    }

    func createCapsule(_ payload: CreateCapsuleRequest) async throws -> Capsule {
        try await request(path: "capsules", method: "POST", body: payload, expectedStatus: 201)
    }

    func getCapsule(code: String) async throws -> Capsule {
        try await request(path: "capsules/\(code)", method: "GET", body: nil as String?)
    }

    func adminLogin(password: String) async throws -> AdminToken {
        try await request(path: "admin/login", method: "POST", body: AdminLoginRequest(password: password))
    }

    func adminCapsules(token: String, page: Int = 0, size: Int = 20) async throws -> PageData<Capsule> {
        try await request(
            path: "admin/capsules",
            method: "GET",
            body: nil as String?,
            queryItems: [
                URLQueryItem(name: "page", value: "\(page)"),
                URLQueryItem(name: "size", value: "\(size)"),
            ],
            token: token
        )
    }

    func deleteCapsule(token: String, code: String) async throws {
        let _: EmptyResponse = try await request(
            path: "admin/capsules/\(code)",
            method: "DELETE",
            body: nil as String?,
            token: token
        )
    }

    // MARK: Generic request

    private func request<T: Decodable, Body: Encodable>(
        path: String,
        method: String,
        body: Body?,
        expectedStatus: Int? = nil,
        queryItems: [URLQueryItem] = [],
        token: String? = nil
    ) async throws -> T {
        let url = try makeURL(path: path, queryItems: queryItems)
        var req = URLRequest(url: url)
        req.httpMethod = method
        req.setValue("application/json", forHTTPHeaderField: "Content-Type")
        req.setValue("application/json", forHTTPHeaderField: "Accept")
        if let token { req.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization") }
        if let body { req.httpBody = try Self.encoder.encode(body) }

        let (data, response) = try await URLSession.shared.data(for: req)
        guard let http = response as? HTTPURLResponse else { throw APIError.invalidResponse }

        // Check status
        let targetStatus = expectedStatus
        if let target = targetStatus, http.statusCode != target {
            throw try parseFailure(data: data, status: http.statusCode)
        }
        if !(200...299).contains(http.statusCode) {
            throw try parseFailure(data: data, status: http.statusCode)
        }

        // 204 No Content
        if data.isEmpty {
            if T.self == EmptyResponse.self { return EmptyResponse() as! T }
            throw APIError.missingData
        }

        let envelope = try Self.decoder.decode(APIEnvelope<T>.self, from: data)
        if !envelope.success { throw APIError.server(message: envelope.message ?? "请求失败") }
        guard let payload = envelope.data else {
            if T.self == EmptyResponse.self { return EmptyResponse() as! T }
            throw APIError.missingData
        }
        return payload
    }

    private func makeURL(path: String, queryItems: [URLQueryItem]) throws -> URL {
        guard var comps = URLComponents(url: baseURL, resolvingAgainstBaseURL: false) else {
            throw APIError.invalidBaseURL
        }
        let base = comps.path.trimmingCharacters(in: .init(charactersIn: "/"))
        let tail = path.trimmingCharacters(in: .init(charactersIn: "/"))
        comps.path = "/" + [base, tail].filter { !$0.isEmpty }.joined(separator: "/")
        comps.queryItems = queryItems.isEmpty ? nil : queryItems
        guard let url = comps.url else { throw APIError.invalidBaseURL }
        return url
    }

    private func parseFailure(data: Data, status: Int) throws -> APIError {
        if let env = try? Self.decoder.decode(APIEnvelope<EmptyResponse>.self, from: data),
           let msg = env.message {
            return .server(message: msg)
        }
        return .server(message: "请求失败 (\(status))")
    }
}
