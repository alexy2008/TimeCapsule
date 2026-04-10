import Foundation
import Vapor

/// 应用配置。
/// 统一在这里读取环境变量，避免业务层散落 `Environment.get(...)`。
struct AppConfig: Sendable {
    let host: String
    let port: Int
    let databaseURL: String
    let adminPassword: String
    let jwtSecret: String
    let jwtExpirationHours: Int
    let swiftRuntimeLabel: String

    static func load(from environment: Environment) -> AppConfig {
        AppConfig(
            host: Environment.get("HOST") ?? "127.0.0.1",
            port: Int(Environment.get("PORT") ?? "18060") ?? 18060,
            databaseURL: Environment.get("DATABASE_URL") ?? "../../../data/hellotime.db",
            adminPassword: Environment.get("ADMIN_PASSWORD") ?? "timecapsule-admin",
            jwtSecret: Environment.get("JWT_SECRET") ?? "hellotime-jwt-secret-key-that-is-long-enough-for-hs256",
            jwtExpirationHours: Int(Environment.get("JWT_EXPIRATION_HOURS") ?? "2") ?? 2,
            swiftRuntimeLabel: {
                if let version = environment.arguments.first(where: { $0.hasPrefix("--swift-runtime-label=") }) {
                    return String(version.dropFirst("--swift-runtime-label=".count))
                }
                return "Swift 6.2"
            }()
        )
    }
}

private struct HelloTimeConfigKey: StorageKey {
    typealias Value = AppConfig
}

extension Application {
    var helloTimeConfig: AppConfig {
        get {
            guard let config = storage[HelloTimeConfigKey.self] else {
                fatalError("AppConfig 尚未配置")
            }
            return config
        }
        set {
            storage[HelloTimeConfigKey.self] = newValue
        }
    }
}
