/// HelloTime Drogon 后端 — 头文件（公开声明）
///
/// 定义应用配置、数据记录和应用状态结构体。
/// Drogon 定位为 C++20 轻量路由与底层细节显式掌控，
/// 不使用 ORM，手写 SQLite3 C API 和 JWT 实现。
///
/// 对应其他技术栈：
/// - Spring Boot: application.properties + Entity + Service
/// - Gin: model + service + config
/// - Axum: lib.rs 中的 AppConfig + AppState + CapsuleRecord
#pragma once

#include <filesystem>
#include <memory>
#include <mutex>
#include <optional>
#include <string>

struct sqlite3;

namespace hellotime::drogon_backend
{
/// 应用配置 — 从环境变量读取，提供硬编码默认值
///
/// 演示项目硬编码默认密码和 JWT 密钥，
/// 生产环境应通过环境变量覆盖（不使用 fallback）。
struct AppConfig
{
    std::string databasePath;
    std::string adminPassword;
    std::string jwtSecret;
    int jwtExpirationHours{2};
    std::string host{"127.0.0.1"};
    uint16_t port{18080};
    std::filesystem::path staticDir;

    static AppConfig fromEnv();
};

/// 胶囊数据记录 — 纯数据结构，无业务逻辑
///
/// 对应数据库 capsules 表的字段，时间以 UTC ISO 8601 文本存储。
struct CapsuleRecord
{
    std::string code;
    std::string title;
    std::string content;
    std::string creator;
    std::string openAt;
    std::string createdAt;
};

/// 应用状态 — RAII 管理 SQLite 连接
///
/// 构造函数打开数据库并初始化表结构，
/// 析构函数负责关闭数据库连接。
/// databaseMutex 保护并发写入（Drogon 是多线程框架）。
struct AppState
{
    explicit AppState(AppConfig cfg);
    ~AppState();

    AppConfig config;
    sqlite3 *database{nullptr};
    std::mutex databaseMutex;
};

/// 配置 Drogon 应用 — 设置 CORS、路由、中间件
/// configureApp 和 runServer 的分工：
/// configureApp 可用于测试（不启动事件循环），
/// runServer 启动完整服务（阻塞直到进程退出）。
std::shared_ptr<AppState> configureApp(const AppConfig &config);
int runServer(const AppConfig &config);
}  // namespace hellotime::drogon_backend
