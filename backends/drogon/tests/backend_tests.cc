#include "server.h"

#include <drogon/HttpClient.h>
#include <drogon/drogon.h>

#include <chrono>
#include <cstdlib>
#include <filesystem>
#include <future>
#include <iostream>
#include <stdexcept>
#include <string>
#include <thread>

using namespace hellotime::drogon_backend;

namespace
{
using namespace drogon;

void expect(bool condition, const std::string &message)
{
    if (!condition)
    {
        throw std::runtime_error(message);
    }
}

std::pair<HttpStatusCode, Json::Value> sendJsonRequest(const HttpClientPtr &client,
                                                       HttpMethod method,
                                                       const std::string &path,
                                                       const Json::Value *json = nullptr,
                                                       const std::optional<std::string> &token =
                                                           std::nullopt)
{
    auto request = HttpRequest::newHttpRequest();
    request->setMethod(method);
    request->setPath(path);
    if (json != nullptr)
    {
        request->setContentTypeCode(CT_APPLICATION_JSON);
        request->setBody(json->toStyledString());
    }
    if (token.has_value())
    {
        request->addHeader("Authorization", "Bearer " + *token);
    }

    std::promise<std::pair<HttpStatusCode, Json::Value>> promise;
    auto future = promise.get_future();
    client->sendRequest(
        request,
        [&promise](ReqResult result, const HttpResponsePtr &response) {
            if (result != ReqResult::Ok)
            {
                promise.set_exception(
                    std::make_exception_ptr(std::runtime_error("request failed")));
                return;
            }
            Json::Value body;
            const auto json = response->jsonObject();
            if (json != nullptr)
            {
                body = *json;
            }
            promise.set_value({response->statusCode(), body});
        });
    return future.get();
}

void waitForReady()
{
    auto client = HttpClient::newHttpClient("http://127.0.0.1:18980");
    for (int attempt = 0; attempt < 50; ++attempt)
    {
        try
        {
            const auto [status, body] = sendJsonRequest(client, Get, "/api/v1/health");
            if (status == k200OK && body["data"]["status"].asString() == "UP")
            {
                return;
            }
        }
        catch (...)
        {
        }
        std::this_thread::sleep_for(std::chrono::milliseconds(100));
    }
    throw std::runtime_error("server did not become ready");
}
}  // namespace

int main()
{
    const auto tempDir =
        std::filesystem::temp_directory_path() / "hellotime-drogon-tests";
    std::filesystem::create_directories(tempDir);
    const auto databasePath = tempDir / "hellotime-drogon-test.db";
    std::filesystem::remove(databasePath);

    AppConfig config;
    config.databasePath = databasePath.string();
    config.adminPassword = "timecapsule-admin";
    config.jwtSecret = "test-jwt-secret-key-that-is-long-enough";
    config.jwtExpirationHours = 2;
    config.host = "127.0.0.1";
    config.port = 18980;
    config.staticDir = std::filesystem::current_path() / "static" / "tech-logos";

    auto state = configureApp(config);
    (void)state;

    std::thread serverThread([]() {
        app().run();
    });

    try
    {
        waitForReady();
        auto client = HttpClient::newHttpClient("http://127.0.0.1:18980");

        {
            const auto [status, body] = sendJsonRequest(client, Get, "/api/v1/health");
            expect(status == k200OK, "health status");
            expect(body["data"]["status"].asString() == "UP", "health body");
            expect(body["data"]["techStack"]["framework"].asString() == "Drogon 1.9",
                   "health framework");
        }

        Json::Value createPayload(Json::objectValue);
        createPayload["title"] = "Drogon 测试";
        createPayload["content"] = "未来再看";
        createPayload["creator"] = "测试者";
        createPayload["openAt"] = "2030-01-01T00:00:00Z";
        const auto [createStatus, createBody] =
            sendJsonRequest(client, Post, "/api/v1/capsules", &createPayload);
        expect(createStatus == k201Created, "create status");
        const auto code = createBody["data"]["code"].asString();
        expect(code.size() == 8, "code length");

        {
            const auto [status, body] =
                sendJsonRequest(client, Get, "/api/v1/capsules/" + code);
            expect(status == k200OK, "get status");
            expect(body["data"]["opened"].asBool() == false, "locked capsule");
            expect(body["data"]["content"].isNull(), "locked content hidden");
        }

        {
            Json::Value invalidPayload(Json::objectValue);
            invalidPayload["title"] = "非法时间";
            invalidPayload["content"] = "内容";
            invalidPayload["creator"] = "测试者";
            invalidPayload["openAt"] = "not-a-date";
            const auto [status, body] =
                sendJsonRequest(client, Post, "/api/v1/capsules", &invalidPayload);
            expect(status == k400BadRequest, "invalid time status");
            expect(body["errorCode"].asString() == "BAD_REQUEST", "invalid time code");
        }

        std::string token;
        {
            Json::Value loginPayload(Json::objectValue);
            loginPayload["password"] = "timecapsule-admin";
            const auto [status, body] =
                sendJsonRequest(client, Post, "/api/v1/admin/login", &loginPayload);
            expect(status == k200OK, "login status");
            token = body["data"]["token"].asString();
            expect(!token.empty(), "login token");
        }

        {
            const auto [status, body] = sendJsonRequest(
                client, Get, "/api/v1/admin/capsules?page=0&size=20", nullptr, token);
            expect(status == k200OK, "admin list status");
            expect(body["data"]["content"][0]["content"].asString() == "未来再看",
                   "admin content visible");
        }

        {
            const auto [status, body] = sendJsonRequest(
                client, Delete, "/api/v1/admin/capsules/" + code, nullptr, token);
            expect(status == k200OK, "delete status");
            expect(body["success"].asBool(), "delete success");
        }

        app().quit();
        serverThread.join();
        std::filesystem::remove(databasePath);
        std::cout << "All Drogon backend tests passed\n";
        return 0;
    }
    catch (...)
    {
        app().quit();
        if (serverThread.joinable())
        {
            serverThread.join();
        }
        std::filesystem::remove(databasePath);
        throw;
    }
}
