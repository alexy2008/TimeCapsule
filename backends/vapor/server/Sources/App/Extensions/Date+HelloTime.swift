import Foundation

extension Date {
    /// 统一输出 UTC ISO 8601 字符串，避免不同系统区域设置影响响应内容。
    var helloTimeString: String {
        Self.makeOutputFormatter().string(from: self)
    }

    static func parseHelloTime(_ rawValue: String) -> Date? {
        if let parsed = makePreciseInputFormatter().date(from: rawValue) {
            return parsed
        }

        return makeFallbackInputFormatter().date(from: rawValue)
    }

    private static func makeOutputFormatter() -> ISO8601DateFormatter {
        let formatter = ISO8601DateFormatter()
        formatter.timeZone = TimeZone(secondsFromGMT: 0)
        formatter.formatOptions = [.withInternetDateTime]
        return formatter
    }

    private static func makePreciseInputFormatter() -> ISO8601DateFormatter {
        let formatter = ISO8601DateFormatter()
        formatter.timeZone = TimeZone(secondsFromGMT: 0)
        formatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        return formatter
    }

    private static func makeFallbackInputFormatter() -> ISO8601DateFormatter {
        let formatter = ISO8601DateFormatter()
        formatter.timeZone = TimeZone(secondsFromGMT: 0)
        formatter.formatOptions = [.withInternetDateTime]
        return formatter
    }
}
