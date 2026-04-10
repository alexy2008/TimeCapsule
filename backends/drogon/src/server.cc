#include "server.h"

#include <drogon/HttpAppFramework.h>
#include <drogon/HttpClient.h>
#include <drogon/HttpResponse.h>
#include <drogon/drogon.h>

#include <openssl/crypto.h>
#include <openssl/evp.h>
#include <openssl/hmac.h>
#include <sqlite3.h>

#include <array>
#include <chrono>
#include <cstdint>
#include <cstdlib>
#include <filesystem>
#include <fstream>
#include <iomanip>
#include <optional>
#include <random>
#include <regex>
#include <span>
#include <sstream>
#include <stdexcept>
#include <string_view>
#include <vector>

namespace hellotime::drogon_backend
{
namespace
{
using namespace ::drogon;

constexpr std::string_view kDefaultDatabasePath = "../../data/hellotime.db";
constexpr std::string_view kDefaultAdminPassword = "timecapsule-admin";
constexpr std::string_view kDefaultJwtSecret =
    "hellotime-jwt-secret-key-that-is-long-enough-for-hs256";
constexpr uint16_t kDefaultPort = 18080;
constexpr size_t kCodeLength = 8;
constexpr int kCodeRetryLimit = 10;
constexpr std::string_view kCodeAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

struct ParsedTime
{
    std::time_t epochSeconds{0};
    std::string normalizedUtc;
};

std::string getenvOrDefault(const char *key, std::string_view fallback)
{
    if (const char *value = std::getenv(key))
    {
        return value;
    }
    return std::string(fallback);
}

int getenvIntOrDefault(const char *key, int fallback)
{
    if (const char *value = std::getenv(key))
    {
        try
        {
            return std::stoi(value);
        }
        catch (...)
        {
            return fallback;
        }
    }
    return fallback;
}

std::string trim(std::string_view input)
{
    auto start = input.find_first_not_of(" \t\r\n");
    if (start == std::string_view::npos)
    {
        return {};
    }
    auto end = input.find_last_not_of(" \t\r\n");
    return std::string(input.substr(start, end - start + 1));
}

std::string formatUtc(std::time_t epochSeconds)
{
    std::tm tm{};
#if defined(_WIN32)
    gmtime_s(&tm, &epochSeconds);
#else
    gmtime_r(&epochSeconds, &tm);
#endif
    std::ostringstream output;
    output << std::put_time(&tm, "%Y-%m-%dT%H:%M:%SZ");
    return output.str();
}

ParsedTime parseIso8601(const std::string &value)
{
    static const std::regex pattern(
        R"(^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d+)?(Z|([+-])(\d{2}):(\d{2}))$)");

    std::smatch matches;
    if (!std::regex_match(value, matches, pattern))
    {
        throw std::runtime_error("openAt 格式错误，请使用 ISO 8601 格式");
    }

    std::tm tm{};
    tm.tm_year = std::stoi(matches[1].str()) - 1900;
    tm.tm_mon = std::stoi(matches[2].str()) - 1;
    tm.tm_mday = std::stoi(matches[3].str());
    tm.tm_hour = std::stoi(matches[4].str());
    tm.tm_min = std::stoi(matches[5].str());
    tm.tm_sec = std::stoi(matches[6].str());
    tm.tm_isdst = 0;

#if defined(_WIN32)
    auto epochSeconds = _mkgmtime(&tm);
#else
    auto epochSeconds = timegm(&tm);
#endif
    if (epochSeconds == static_cast<std::time_t>(-1))
    {
        throw std::runtime_error("openAt 格式错误，请使用 ISO 8601 格式");
    }

    if (matches[7].str() != "Z")
    {
        const int sign = matches[8].str() == "-" ? -1 : 1;
        const int offsetHours = std::stoi(matches[9].str());
        const int offsetMinutes = std::stoi(matches[10].str());
        const int offsetSeconds = sign * ((offsetHours * 60) + offsetMinutes) * 60;
        epochSeconds -= offsetSeconds;
    }

    return ParsedTime{
        .epochSeconds = epochSeconds,
        .normalizedUtc = formatUtc(epochSeconds),
    };
}

std::time_t currentEpochSeconds()
{
    return std::chrono::system_clock::to_time_t(std::chrono::system_clock::now());
}

Json::Value makeResponse(bool success,
                         const Json::Value &data,
                         const std::string &message,
                         const std::optional<std::string> &errorCode)
{
    Json::Value response(Json::objectValue);
    response["success"] = success;
    response["data"] = data;
    response["message"] = message;
    if (errorCode.has_value())
    {
        response["errorCode"] = *errorCode;
    }
    return response;
}

HttpResponsePtr makeJsonResponse(const Json::Value &json, HttpStatusCode status)
{
    auto response = HttpResponse::newHttpJsonResponse(json);
    response->setStatusCode(status);
    return response;
}

HttpResponsePtr makeErrorResponse(HttpStatusCode status,
                                  const std::string &message,
                                  const std::string &errorCode)
{
    return makeJsonResponse(makeResponse(false, Json::Value(Json::nullValue), message, errorCode), status);
}

bool isLocalhostOrigin(const std::string &origin)
{
    return origin.starts_with("http://localhost") || origin.starts_with("https://localhost");
}

void applyCorsHeaders(const HttpRequestPtr &request, const HttpResponsePtr &response)
{
    const auto origin = request->getHeader("origin");
    if (!origin.empty() && isLocalhostOrigin(origin))
    {
        response->addHeader("Access-Control-Allow-Origin", origin);
        response->addHeader("Access-Control-Allow-Credentials", "true");
    }
    response->addHeader("Access-Control-Allow-Headers", "Origin, Content-Type, Authorization, Accept");
    response->addHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
    response->addHeader("Vary", "Origin");
}

class Statement final
{
  public:
    Statement(sqlite3 *database, const char *sql)
    {
        if (sqlite3_prepare_v2(database, sql, -1, &statement_, nullptr) != SQLITE_OK)
        {
            throw std::runtime_error(sqlite3_errmsg(database));
        }
    }

    ~Statement()
    {
        if (statement_ != nullptr)
        {
            sqlite3_finalize(statement_);
        }
    }

    sqlite3_stmt *get() const
    {
        return statement_;
    }

  private:
    sqlite3_stmt *statement_{nullptr};
};

void initializeDatabase(sqlite3 *database)
{
    const char *sql = R"SQL(
        CREATE TABLE IF NOT EXISTS capsules (
            code TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            creator TEXT NOT NULL,
            open_at TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
    )SQL";

    char *errorMessage = nullptr;
    if (sqlite3_exec(database, sql, nullptr, nullptr, &errorMessage) != SQLITE_OK)
    {
        std::string message = errorMessage != nullptr ? errorMessage : "数据库初始化失败";
        sqlite3_free(errorMessage);
        throw std::runtime_error(message);
    }
}

std::string generateCode()
{
    thread_local std::random_device device;
    thread_local std::mt19937 generator(device());
    std::uniform_int_distribution<size_t> distribution(0, kCodeAlphabet.size() - 1);

    std::string code;
    code.reserve(kCodeLength);
    for (size_t index = 0; index < kCodeLength; ++index)
    {
        code.push_back(kCodeAlphabet[distribution(generator)]);
    }
    return code;
}

bool codeExists(sqlite3 *database, const std::string &code)
{
    Statement statement(database, "SELECT 1 FROM capsules WHERE code = ?1 LIMIT 1");
    sqlite3_bind_text(statement.get(), 1, code.c_str(), -1, SQLITE_TRANSIENT);
    const int step = sqlite3_step(statement.get());
    return step == SQLITE_ROW;
}

std::string generateUniqueCode(sqlite3 *database)
{
    for (int attempt = 0; attempt < kCodeRetryLimit; ++attempt)
    {
        const auto code = generateCode();
        if (!codeExists(database, code))
        {
            return code;
        }
    }
    throw std::runtime_error("无法生成唯一的胶囊码");
}

Json::Value capsuleToJson(const CapsuleRecord &capsule, bool includeContent)
{
    const auto openAt = parseIso8601(capsule.openAt);
    const auto createdAt = parseIso8601(capsule.createdAt);
    const bool opened = currentEpochSeconds() >= openAt.epochSeconds;

    Json::Value json(Json::objectValue);
    json["code"] = capsule.code;
    json["title"] = capsule.title;
    json["creator"] = capsule.creator;
    json["openAt"] = openAt.normalizedUtc;
    json["createdAt"] = createdAt.normalizedUtc;
    json["opened"] = opened;
    if (includeContent || opened)
    {
        json["content"] = capsule.content;
    }
    else
    {
        json["content"] = Json::Value(Json::nullValue);
    }
    return json;
}

std::optional<CapsuleRecord> findCapsule(sqlite3 *database, const std::string &code)
{
    Statement statement(
        database,
        "SELECT code, title, content, creator, open_at, created_at FROM capsules WHERE code = ?1");
    sqlite3_bind_text(statement.get(), 1, code.c_str(), -1, SQLITE_TRANSIENT);
    if (sqlite3_step(statement.get()) != SQLITE_ROW)
    {
        return std::nullopt;
    }

    CapsuleRecord record;
    record.code = reinterpret_cast<const char *>(sqlite3_column_text(statement.get(), 0));
    record.title = reinterpret_cast<const char *>(sqlite3_column_text(statement.get(), 1));
    record.content = reinterpret_cast<const char *>(sqlite3_column_text(statement.get(), 2));
    record.creator = reinterpret_cast<const char *>(sqlite3_column_text(statement.get(), 3));
    record.openAt = reinterpret_cast<const char *>(sqlite3_column_text(statement.get(), 4));
    record.createdAt = reinterpret_cast<const char *>(sqlite3_column_text(statement.get(), 5));
    return record;
}

std::string base64UrlEncode(std::span<const unsigned char> input)
{
    if (input.empty())
    {
        return {};
    }
    std::string output(((input.size() + 2) / 3) * 4, '\0');
    const int length =
        EVP_EncodeBlock(reinterpret_cast<unsigned char *>(output.data()), input.data(), static_cast<int>(input.size()));
    output.resize(length);
    for (char &character : output)
    {
        if (character == '+')
        {
            character = '-';
        }
        else if (character == '/')
        {
            character = '_';
        }
    }
    while (!output.empty() && output.back() == '=')
    {
        output.pop_back();
    }
    return output;
}

std::string base64UrlEncode(std::string_view input)
{
    return base64UrlEncode(std::span<const unsigned char>(
        reinterpret_cast<const unsigned char *>(input.data()), input.size()));
}

std::vector<unsigned char> base64UrlDecode(std::string value)
{
    for (char &character : value)
    {
        if (character == '-')
        {
            character = '+';
        }
        else if (character == '_')
        {
            character = '/';
        }
    }

    while (value.size() % 4 != 0)
    {
        value.push_back('=');
    }

    std::vector<unsigned char> output((value.size() / 4) * 3);
    const int length = EVP_DecodeBlock(output.data(),
                                       reinterpret_cast<const unsigned char *>(value.data()),
                                       static_cast<int>(value.size()));
    if (length < 0)
    {
        throw std::runtime_error("认证令牌无效或已过期");
    }

    size_t padding = 0;
    if (!value.empty() && value.back() == '=')
    {
        padding += 1;
    }
    if (value.size() > 1 && value[value.size() - 2] == '=')
    {
        padding += 1;
    }
    output.resize(static_cast<size_t>(length) - padding);
    return output;
}

std::string computeHmacSha256(std::string_view data, std::string_view secret)
{
    unsigned int length = EVP_MAX_MD_SIZE;
    std::array<unsigned char, EVP_MAX_MD_SIZE> digest{};
    HMAC(EVP_sha256(),
         secret.data(),
         static_cast<int>(secret.size()),
         reinterpret_cast<const unsigned char *>(data.data()),
         data.size(),
         digest.data(),
         &length);
    return base64UrlEncode(std::span<const unsigned char>(digest.data(), length));
}

bool constantTimeEquals(const std::string &left, const std::string &right)
{
    if (left.size() != right.size())
    {
        return false;
    }
    return CRYPTO_memcmp(left.data(), right.data(), left.size()) == 0;
}

std::string createAdminToken(const AppConfig &config)
{
    Json::Value header(Json::objectValue);
    header["alg"] = "HS256";
    header["typ"] = "JWT";

    const auto now = currentEpochSeconds();
    Json::Value payload(Json::objectValue);
    payload["sub"] = "admin";
    payload["iat"] = Json::Int64(now);
    payload["exp"] = Json::Int64(now + config.jwtExpirationHours * 3600LL);

    Json::StreamWriterBuilder builder;
    builder["indentation"] = "";

    const auto headerPart = base64UrlEncode(Json::writeString(builder, header));
    const auto payloadPart = base64UrlEncode(Json::writeString(builder, payload));
    const auto signingInput = headerPart + "." + payloadPart;
    const auto signature = computeHmacSha256(signingInput, config.jwtSecret);
    return signingInput + "." + signature;
}

bool verifyAdminToken(const AppConfig &config, const std::string &token)
{
    const auto firstDot = token.find('.');
    if (firstDot == std::string::npos)
    {
        return false;
    }
    const auto secondDot = token.find('.', firstDot + 1);
    if (secondDot == std::string::npos)
    {
        return false;
    }

    const auto headerPart = token.substr(0, firstDot);
    const auto payloadPart = token.substr(firstDot + 1, secondDot - firstDot - 1);
    const auto signaturePart = token.substr(secondDot + 1);
    const auto signingInput = headerPart + "." + payloadPart;
    if (!constantTimeEquals(signaturePart, computeHmacSha256(signingInput, config.jwtSecret)))
    {
        return false;
    }

    auto payloadBytes = base64UrlDecode(payloadPart);
    Json::Value payloadJson;
    Json::CharReaderBuilder readerBuilder;
    std::string errors;
    const std::string payloadString(payloadBytes.begin(), payloadBytes.end());
    std::istringstream stream(payloadString);
    if (!Json::parseFromStream(readerBuilder, stream, &payloadJson, &errors))
    {
        return false;
    }

    if (payloadJson["sub"].asString() != "admin")
    {
        return false;
    }
    return payloadJson["exp"].asInt64() > currentEpochSeconds();
}

std::optional<std::string> extractBearerToken(const HttpRequestPtr &request)
{
    const auto authorization = request->getHeader("authorization");
    const std::string prefix = "Bearer ";
    if (!authorization.starts_with(prefix))
    {
        return std::nullopt;
    }
    return authorization.substr(prefix.size());
}

void requireAuthorized(const AppState &state, const HttpRequestPtr &request)
{
    const auto token = extractBearerToken(request);
    if (!token.has_value() || !verifyAdminToken(state.config, *token))
    {
        throw std::runtime_error("UNAUTHORIZED");
    }
}

void validateCode(const std::string &code)
{
    if (code.size() != kCodeLength)
    {
        throw std::runtime_error("CAPSULE_NOT_FOUND");
    }
    for (const char character : code)
    {
        if (!std::isalnum(static_cast<unsigned char>(character)))
        {
            throw std::runtime_error("CAPSULE_NOT_FOUND");
        }
    }
}

std::string guessContentType(const std::filesystem::path &path)
{
    const auto extension = path.extension().string();
    if (extension == ".svg")
    {
        return "image/svg+xml; charset=utf-8";
    }
    if (extension == ".png")
    {
        return "image/png";
    }
    return "application/octet-stream";
}

Json::Value createHealthData()
{
    Json::Value techStack(Json::objectValue);
    techStack["framework"] = "Drogon 1.9";
    techStack["language"] = "C++20";
    techStack["database"] = "SQLite";

    Json::Value data(Json::objectValue);
    data["status"] = "UP";
    data["timestamp"] = formatUtc(currentEpochSeconds());
    data["techStack"] = techStack;
    return data;
}

std::optional<std::string> queryText(const HttpRequestPtr &request, const std::string &name)
{
    const auto value = request->getParameter(name);
    if (value.empty())
    {
        return std::nullopt;
    }
    return value;
}

int parseQueryInt(const HttpRequestPtr &request, const std::string &name, int fallback)
{
    if (const auto value = queryText(request, name))
    {
        try
        {
            return std::stoi(*value);
        }
        catch (...)
        {
            return fallback;
        }
    }
    return fallback;
}

void registerRoutes(const std::shared_ptr<AppState> &state)
{
    app().registerHandler(
        "/api/v1/health",
        [state](const HttpRequestPtr &request,
                std::function<void(const HttpResponsePtr &)> &&callback) {
            auto response = makeJsonResponse(
                makeResponse(true, createHealthData(), "服务运行正常", std::nullopt),
                k200OK);
            applyCorsHeaders(request, response);
            callback(response);
        },
        {Get});

    app().registerHandler(
        "/api/v1/capsules",
        [state](const HttpRequestPtr &request,
                std::function<void(const HttpResponsePtr &)> &&callback) {
            try
            {
                const auto json = request->getJsonObject();
                if (json == nullptr)
                {
                    auto response =
                        makeErrorResponse(k400BadRequest, "参数校验失败", "VALIDATION_ERROR");
                    applyCorsHeaders(request, response);
                    callback(response);
                    return;
                }

                const auto title = trim((*json).get("title", "").asString());
                const auto content = trim((*json).get("content", "").asString());
                const auto creator = trim((*json).get("creator", "").asString());
                const auto openAtInput = trim((*json).get("openAt", "").asString());

                if (title.empty())
                {
                    auto response =
                        makeErrorResponse(k400BadRequest, "title 不能为空", "VALIDATION_ERROR");
                    applyCorsHeaders(request, response);
                    callback(response);
                    return;
                }
                if (title.size() > 100)
                {
                    auto response = makeErrorResponse(k400BadRequest,
                                                      "title 长度不能超过 100",
                                                      "VALIDATION_ERROR");
                    applyCorsHeaders(request, response);
                    callback(response);
                    return;
                }
                if (content.empty())
                {
                    auto response =
                        makeErrorResponse(k400BadRequest, "content 不能为空", "VALIDATION_ERROR");
                    applyCorsHeaders(request, response);
                    callback(response);
                    return;
                }
                if (creator.empty())
                {
                    auto response =
                        makeErrorResponse(k400BadRequest, "creator 不能为空", "VALIDATION_ERROR");
                    applyCorsHeaders(request, response);
                    callback(response);
                    return;
                }
                if (creator.size() > 30)
                {
                    auto response = makeErrorResponse(k400BadRequest,
                                                      "creator 长度不能超过 30",
                                                      "VALIDATION_ERROR");
                    applyCorsHeaders(request, response);
                    callback(response);
                    return;
                }
                if (openAtInput.empty())
                {
                    auto response =
                        makeErrorResponse(k400BadRequest, "openAt 不能为空", "VALIDATION_ERROR");
                    applyCorsHeaders(request, response);
                    callback(response);
                    return;
                }

                const auto openAt = parseIso8601(openAtInput);
                if (openAt.epochSeconds <= currentEpochSeconds())
                {
                    auto response =
                        makeErrorResponse(k400BadRequest, "开启时间必须在未来", "BAD_REQUEST");
                    applyCorsHeaders(request, response);
                    callback(response);
                    return;
                }

                Json::Value data(Json::objectValue);
                {
                    std::lock_guard lock(state->databaseMutex);
                    const auto code = generateUniqueCode(state->database);
                    const auto createdAt = formatUtc(currentEpochSeconds());
                    Statement statement(
                        state->database,
                        "INSERT INTO capsules (code, title, content, creator, open_at, created_at) "
                        "VALUES (?1, ?2, ?3, ?4, ?5, ?6)");
                    sqlite3_bind_text(statement.get(), 1, code.c_str(), -1, SQLITE_TRANSIENT);
                    sqlite3_bind_text(statement.get(), 2, title.c_str(), -1, SQLITE_TRANSIENT);
                    sqlite3_bind_text(statement.get(), 3, content.c_str(), -1, SQLITE_TRANSIENT);
                    sqlite3_bind_text(statement.get(), 4, creator.c_str(), -1, SQLITE_TRANSIENT);
                    sqlite3_bind_text(
                        statement.get(), 5, openAt.normalizedUtc.c_str(), -1, SQLITE_TRANSIENT);
                    sqlite3_bind_text(
                        statement.get(), 6, createdAt.c_str(), -1, SQLITE_TRANSIENT);
                    if (sqlite3_step(statement.get()) != SQLITE_DONE)
                    {
                        throw std::runtime_error(sqlite3_errmsg(state->database));
                    }

                    data["code"] = code;
                    data["title"] = title;
                    data["creator"] = creator;
                    data["openAt"] = openAt.normalizedUtc;
                    data["createdAt"] = createdAt;
                    data["content"] = Json::Value(Json::nullValue);
                }

                auto response = makeJsonResponse(
                    makeResponse(true, data, "胶囊创建成功", std::nullopt), k201Created);
                applyCorsHeaders(request, response);
                callback(response);
            }
            catch (const std::runtime_error &exception)
            {
                auto response =
                    makeErrorResponse(k400BadRequest, exception.what(), "BAD_REQUEST");
                applyCorsHeaders(request, response);
                callback(response);
            }
        },
        {Post});

    app().registerHandler(
        "/api/v1/capsules/{1}",
        [state](const HttpRequestPtr &request,
                std::function<void(const HttpResponsePtr &)> &&callback,
                const std::string &code) {
            try
            {
                validateCode(code);
                std::optional<CapsuleRecord> capsule;
                {
                    std::lock_guard lock(state->databaseMutex);
                    capsule = findCapsule(state->database, code);
                }
                if (!capsule.has_value())
                {
                    auto response = makeErrorResponse(
                        k404NotFound, "胶囊不存在", "CAPSULE_NOT_FOUND");
                    applyCorsHeaders(request, response);
                    callback(response);
                    return;
                }

                auto response = makeJsonResponse(
                    makeResponse(true, capsuleToJson(*capsule, false), "查询成功", std::nullopt),
                    k200OK);
                applyCorsHeaders(request, response);
                callback(response);
            }
            catch (...)
            {
                auto response =
                    makeErrorResponse(k404NotFound, "胶囊不存在", "CAPSULE_NOT_FOUND");
                applyCorsHeaders(request, response);
                callback(response);
            }
        },
        {Get});

    app().registerHandler(
        "/api/v1/admin/login",
        [state](const HttpRequestPtr &request,
                std::function<void(const HttpResponsePtr &)> &&callback) {
            const auto json = request->getJsonObject();
            if (json == nullptr)
            {
                auto response =
                    makeErrorResponse(k400BadRequest, "参数校验失败", "VALIDATION_ERROR");
                applyCorsHeaders(request, response);
                callback(response);
                return;
            }

            const auto password = trim((*json).get("password", "").asString());
            if (password.empty())
            {
                auto response =
                    makeErrorResponse(k400BadRequest, "password 不能为空", "VALIDATION_ERROR");
                applyCorsHeaders(request, response);
                callback(response);
                return;
            }

            if (password != state->config.adminPassword)
            {
                auto response =
                    makeErrorResponse(k401Unauthorized, "管理员密码错误", "UNAUTHORIZED");
                applyCorsHeaders(request, response);
                callback(response);
                return;
            }

            Json::Value data(Json::objectValue);
            data["token"] = createAdminToken(state->config);
            auto response =
                makeJsonResponse(makeResponse(true, data, "登录成功", std::nullopt), k200OK);
            applyCorsHeaders(request, response);
            callback(response);
        },
        {Post});

    app().registerHandler(
        "/api/v1/admin/capsules",
        [state](const HttpRequestPtr &request,
                std::function<void(const HttpResponsePtr &)> &&callback) {
            try
            {
                requireAuthorized(*state, request);

                const int page = std::max(0, parseQueryInt(request, "page", 0));
                const int size = std::clamp(parseQueryInt(request, "size", 20), 1, 100);

                Json::Value content(Json::arrayValue);
                Json::Value data(Json::objectValue);

                {
                    std::lock_guard lock(state->databaseMutex);
                    Statement countStatement(state->database, "SELECT COUNT(*) FROM capsules");
                    if (sqlite3_step(countStatement.get()) != SQLITE_ROW)
                    {
                        throw std::runtime_error("统计胶囊失败");
                    }
                    const auto total = sqlite3_column_int64(countStatement.get(), 0);

                    Statement listStatement(
                        state->database,
                        "SELECT code, title, content, creator, open_at, created_at "
                        "FROM capsules ORDER BY created_at DESC LIMIT ?1 OFFSET ?2");
                    sqlite3_bind_int(listStatement.get(), 1, size);
                    sqlite3_bind_int(listStatement.get(), 2, page * size);

                    while (sqlite3_step(listStatement.get()) == SQLITE_ROW)
                    {
                        CapsuleRecord record;
                        record.code =
                            reinterpret_cast<const char *>(sqlite3_column_text(listStatement.get(), 0));
                        record.title =
                            reinterpret_cast<const char *>(sqlite3_column_text(listStatement.get(), 1));
                        record.content =
                            reinterpret_cast<const char *>(sqlite3_column_text(listStatement.get(), 2));
                        record.creator =
                            reinterpret_cast<const char *>(sqlite3_column_text(listStatement.get(), 3));
                        record.openAt =
                            reinterpret_cast<const char *>(sqlite3_column_text(listStatement.get(), 4));
                        record.createdAt =
                            reinterpret_cast<const char *>(sqlite3_column_text(listStatement.get(), 5));
                        content.append(capsuleToJson(record, true));
                    }

                    data["content"] = content;
                    data["totalElements"] = Json::Int64(total);
                    data["totalPages"] = Json::Int64(std::max<int64_t>(1, (total + size - 1) / size));
                    data["number"] = page;
                    data["size"] = size;
                }

                auto response =
                    makeJsonResponse(makeResponse(true, data, "查询成功", std::nullopt), k200OK);
                applyCorsHeaders(request, response);
                callback(response);
            }
            catch (...)
            {
                auto response = makeErrorResponse(
                    k401Unauthorized, "认证令牌无效或已过期", "UNAUTHORIZED");
                applyCorsHeaders(request, response);
                callback(response);
            }
        },
        {Get});

    app().registerHandler(
        "/api/v1/admin/capsules/{1}",
        [state](const HttpRequestPtr &request,
                std::function<void(const HttpResponsePtr &)> &&callback,
                const std::string &code) {
            try
            {
                requireAuthorized(*state, request);
                validateCode(code);

                {
                    std::lock_guard lock(state->databaseMutex);
                    Statement statement(state->database, "DELETE FROM capsules WHERE code = ?1");
                    sqlite3_bind_text(statement.get(), 1, code.c_str(), -1, SQLITE_TRANSIENT);
                    if (sqlite3_step(statement.get()) != SQLITE_DONE)
                    {
                        throw std::runtime_error(sqlite3_errmsg(state->database));
                    }
                    if (sqlite3_changes(state->database) == 0)
                    {
                        auto response = makeErrorResponse(
                            k404NotFound, "胶囊不存在", "CAPSULE_NOT_FOUND");
                        applyCorsHeaders(request, response);
                        callback(response);
                        return;
                    }
                }

                auto response = makeJsonResponse(
                    makeResponse(true,
                                 Json::Value(Json::nullValue),
                                 "删除成功",
                                 std::nullopt),
                    k200OK);
                applyCorsHeaders(request, response);
                callback(response);
            }
            catch (const std::runtime_error &exception)
            {
                const std::string message = exception.what();
                if (message == "UNAUTHORIZED")
                {
                    auto response = makeErrorResponse(
                        k401Unauthorized, "认证令牌无效或已过期", "UNAUTHORIZED");
                    applyCorsHeaders(request, response);
                    callback(response);
                    return;
                }
                auto response =
                    makeErrorResponse(k404NotFound, "胶囊不存在", "CAPSULE_NOT_FOUND");
                applyCorsHeaders(request, response);
                callback(response);
            }
        },
        {Delete});

    app().registerHandler(
        "/tech-logos/{1}",
        [state](const HttpRequestPtr &request,
                std::function<void(const HttpResponsePtr &)> &&callback,
                const std::string &fileName) {
            const auto path = state->config.staticDir / fileName;
            if (!std::filesystem::exists(path))
            {
                auto response = HttpResponse::newNotFoundResponse();
                applyCorsHeaders(request, response);
                callback(response);
                return;
            }

            std::ifstream file(path, std::ios::binary);
            std::ostringstream buffer;
            buffer << file.rdbuf();

            auto response = HttpResponse::newHttpResponse();
            response->setBody(buffer.str());
            response->setStatusCode(k200OK);
            response->setContentTypeCode(CT_CUSTOM);
            response->setContentTypeString(guessContentType(path));
            applyCorsHeaders(request, response);
            callback(response);
        },
        {Get});
}
}  // namespace

AppConfig AppConfig::fromEnv()
{
    AppConfig config;
    config.databasePath = getenvOrDefault("DATABASE_URL", kDefaultDatabasePath);
    config.adminPassword = getenvOrDefault("ADMIN_PASSWORD", kDefaultAdminPassword);
    config.jwtSecret = getenvOrDefault("JWT_SECRET", kDefaultJwtSecret);
    config.jwtExpirationHours = getenvIntOrDefault("JWT_EXPIRATION_HOURS", 2);
    config.host = getenvOrDefault("HOST", "127.0.0.1");
    config.port = static_cast<uint16_t>(getenvIntOrDefault("PORT", kDefaultPort));
    config.staticDir = std::filesystem::current_path() / "static" / "tech-logos";
    return config;
}

AppState::AppState(AppConfig cfg) : config(std::move(cfg))
{
    if (sqlite3_open(config.databasePath.c_str(), &database) != SQLITE_OK)
    {
        const std::string message = database != nullptr ? sqlite3_errmsg(database) : "数据库打开失败";
        if (database != nullptr)
        {
            sqlite3_close(database);
            database = nullptr;
        }
        throw std::runtime_error(message);
    }
    initializeDatabase(database);
}

AppState::~AppState()
{
    if (database != nullptr)
    {
        sqlite3_close(database);
        database = nullptr;
    }
}

std::shared_ptr<AppState> configureApp(const AppConfig &config)
{
    static bool configured = false;
    if (configured)
    {
        throw std::runtime_error("Drogon app 已在当前进程中配置");
    }

    auto state = std::make_shared<AppState>(config);
    app().setLogLevel(trantor::Logger::kWarn);
    app().setThreadNum(1);
    app().disableSession();
    app().addListener(config.host, config.port);

    app().registerPreRoutingAdvice(
        [](const HttpRequestPtr &request,
           AdviceCallback &&callback,
           AdviceChainCallback &&chainCallback) {
            if (request->method() == Options)
            {
                auto response = HttpResponse::newHttpResponse();
                response->setStatusCode(k200OK);
                applyCorsHeaders(request, response);
                callback(response);
                return;
            }
            chainCallback();
        });

    app().registerPostHandlingAdvice(
        [](const HttpRequestPtr &request, const HttpResponsePtr &response) {
            applyCorsHeaders(request, response);
        });

    registerRoutes(state);
    configured = true;
    return state;
}

int runServer(const AppConfig &config)
{
    configureApp(config);
    app().run();
    return 0;
}
}  // namespace hellotime::drogon_backend
