@testable import App
import XCTest
import Vapor

final class AppTests: XCTestCase {
    override func setUp() {
        super.setUp()
        setenv("DATABASE_URL", ":memory:", 1)
        setenv("PORT", "18061", 1)
    }

    func testHealthEndpointReturnsVaporTechStack() throws {
        let app = Application(.testing)
        defer { app.shutdown() }
        try configure(app)

        let response = try performRequest(app: app, method: .GET, path: "api/v1/health")
        XCTAssertEqual(response.status, .ok)

        let payload = try response.content.decode(ApiResponse<HealthStatusResponse>.self)
        XCTAssertTrue(payload.success)
        XCTAssertEqual(payload.data?.status, "UP")
        XCTAssertEqual(payload.data?.techStack.framework, "Vapor 4")
    }

    func testHealthEndpointReflectsLocalhostOriginForCors() throws {
        let app = Application(.testing)
        defer { app.shutdown() }
        try configure(app)

        let response = try performRequest(
            app: app,
            method: .GET,
            path: "api/v1/health",
            origin: "http://localhost:5174"
        )

        XCTAssertEqual(response.status, .ok)
        XCTAssertEqual(
            response.headers.first(name: .accessControlAllowOrigin),
            "http://localhost:5174"
        )
    }

    func testCapsuleCreationRespectsLockedContentRule() throws {
        let app = Application(.testing)
        defer { app.shutdown() }
        try configure(app)

        let request = CreateCapsuleRequest(
            title: "未来的我",
            content: "保持锋利",
            creator: "Alex",
            openAt: Date(timeIntervalSinceNow: 120).helloTimeString
        )

        let createResponse = try performRequest(app: app, method: .POST, path: "api/v1/capsules", body: request)
        XCTAssertEqual(createResponse.status, .created)

        let createPayload = try createResponse.content.decode(ApiResponse<CapsuleCreatedResponse>.self)
        XCTAssertTrue(createPayload.success)
        let capsuleCode = try XCTUnwrap(createPayload.data?.code)
        XCTAssertEqual(capsuleCode.count, 8)

        let detailResponse = try performRequest(app: app, method: .GET, path: "api/v1/capsules/\(capsuleCode)")
        XCTAssertEqual(detailResponse.status, .ok)

        let detailPayload = try detailResponse.content.decode(ApiResponse<CapsuleDetailResponse>.self)
        XCTAssertNil(detailPayload.data?.content)
        XCTAssertEqual(detailPayload.data?.opened, false)
    }

    func testAdminEndpointsRequireValidJwtAndExposeContentInList() throws {
        let app = Application(.testing)
        defer { app.shutdown() }
        try configure(app)

        let createRequest = CreateCapsuleRequest(
            title: "管理员可见",
            content: "完整正文",
            creator: "Verifier",
            openAt: Date(timeIntervalSinceNow: 120).helloTimeString
        )
        _ = try performRequest(app: app, method: .POST, path: "api/v1/capsules", body: createRequest)

        let unauthorized = try performRequest(app: app, method: .GET, path: "api/v1/admin/capsules")
        XCTAssertEqual(unauthorized.status, .unauthorized)

        let loginResponse = try performRequest(
            app: app,
            method: .POST,
            path: "api/v1/admin/login",
            body: AdminLoginRequest(password: "timecapsule-admin")
        )
        XCTAssertEqual(loginResponse.status, .ok)

        let loginPayload = try loginResponse.content.decode(ApiResponse<AdminTokenResponse>.self)
        let token = try XCTUnwrap(loginPayload.data?.token)

        let listResponse = try performRequest(
            app: app,
            method: .GET,
            path: "api/v1/admin/capsules?page=0&size=20",
            bearerToken: token
        )
        XCTAssertEqual(listResponse.status, .ok)

        let listPayload = try listResponse.content.decode(ApiResponse<CapsulePageResponse>.self)
        let content = try XCTUnwrap(listPayload.data?.content.first?.content)
        XCTAssertEqual(content, "完整正文")
    }

    func testDeleteCapsuleRemovesResource() throws {
        let app = Application(.testing)
        defer { app.shutdown() }
        try configure(app)

        let createRequest = CreateCapsuleRequest(
            title: "待删除",
            content: "删除测试",
            creator: "Cleaner",
            openAt: Date(timeIntervalSinceNow: 120).helloTimeString
        )
        let createResponse = try performRequest(app: app, method: .POST, path: "api/v1/capsules", body: createRequest)
        let createPayload = try createResponse.content.decode(ApiResponse<CapsuleCreatedResponse>.self)
        let code = try XCTUnwrap(createPayload.data?.code)

        let loginResponse = try performRequest(
            app: app,
            method: .POST,
            path: "api/v1/admin/login",
            body: AdminLoginRequest(password: "timecapsule-admin")
        )
        let loginPayload = try loginResponse.content.decode(ApiResponse<AdminTokenResponse>.self)
        let token = try XCTUnwrap(loginPayload.data?.token)

        let deleteResponse = try performRequest(
            app: app,
            method: .DELETE,
            path: "api/v1/admin/capsules/\(code)",
            bearerToken: token
        )
        XCTAssertEqual(deleteResponse.status, .ok)

        let detailResponse = try performRequest(app: app, method: .GET, path: "api/v1/capsules/\(code)")
        XCTAssertEqual(detailResponse.status, .notFound)
    }

    private func performRequest(
        app: Application,
        method: HTTPMethod,
        path: String,
        bearerToken: String? = nil,
        origin: String? = nil
    ) throws -> Response {
        let request = Request(application: app, method: method, url: URI(path: path), on: app.eventLoopGroup.next())
        if let bearerToken {
            request.headers.bearerAuthorization = .init(token: bearerToken)
        }
        if let origin {
            request.headers.replaceOrAdd(name: .origin, value: origin)
        }
        return try app.responder.respond(to: request).wait()
    }

    private func performRequest<Body: Content>(
        app: Application,
        method: HTTPMethod,
        path: String,
        body: Body,
        bearerToken: String? = nil,
        origin: String? = nil
    ) throws -> Response {
        let request = Request(application: app, method: method, url: URI(path: path), on: app.eventLoopGroup.next())
        if let bearerToken {
            request.headers.bearerAuthorization = .init(token: bearerToken)
        }
        if let origin {
            request.headers.replaceOrAdd(name: .origin, value: origin)
        }
        try request.content.encode(body)
        return try app.responder.respond(to: request).wait()
    }
}
