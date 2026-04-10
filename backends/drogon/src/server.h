#pragma once

#include <filesystem>
#include <memory>
#include <mutex>
#include <optional>
#include <string>

struct sqlite3;

namespace hellotime::drogon_backend
{
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

struct CapsuleRecord
{
    std::string code;
    std::string title;
    std::string content;
    std::string creator;
    std::string openAt;
    std::string createdAt;
};

struct AppState
{
    explicit AppState(AppConfig cfg);
    ~AppState();

    AppConfig config;
    sqlite3 *database{nullptr};
    std::mutex databaseMutex;
};

std::shared_ptr<AppState> configureApp(const AppConfig &config);
int runServer(const AppConfig &config);
}  // namespace hellotime::drogon_backend
