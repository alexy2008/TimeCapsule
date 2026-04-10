import Vapor

/// 统一 API 响应结构。
/// 为了和仓库其他实现保持一致，这里显式保证 `data` 字段始终存在，即使值为 null。
struct ApiResponse<T: Content>: Content {
    let success: Bool
    let data: T?
    let message: String?
    let errorCode: String?

    init(success: Bool, data: T?, message: String? = nil, errorCode: String? = nil) {
        self.success = success
        self.data = data
        self.message = message
        self.errorCode = errorCode
    }

    private enum CodingKeys: String, CodingKey {
        case success
        case data
        case message
        case errorCode
    }

    func encode(to encoder: any Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try container.encode(success, forKey: .success)

        if let data {
            try container.encode(data, forKey: .data)
        } else {
            try container.encodeNil(forKey: .data)
        }

        try container.encodeIfPresent(message, forKey: .message)
        try container.encodeIfPresent(errorCode, forKey: .errorCode)
    }

    static func ok(_ data: T? = nil, message: String? = nil) -> ApiResponse<T> {
        .init(success: true, data: data, message: message, errorCode: nil)
    }

    static func error(_ message: String, errorCode: String) -> ApiResponse<T> {
        .init(success: false, data: nil, message: message, errorCode: errorCode)
    }
}

struct EmptyPayload: Content {}
