package com.hellotime

import com.auth0.jwt.interfaces.Payload
import com.hellotime.config.AppConfig
import com.hellotime.model.AdminLoginRequest
import com.hellotime.model.ApiResponse
import com.hellotime.model.AppException
import com.hellotime.model.HealthData
import com.hellotime.model.TechStack
import com.hellotime.service.AuthService
import com.hellotime.service.CapsuleRepository
import com.hellotime.service.CapsuleService
import io.ktor.http.HttpStatusCode
import io.ktor.serialization.kotlinx.json.json
import io.ktor.server.application.Application
import io.ktor.server.application.call
import io.ktor.server.application.install
import io.ktor.server.auth.authenticate
import io.ktor.server.auth.jwt.JWTPrincipal
import io.ktor.server.auth.jwt.jwt
import io.ktor.server.engine.embeddedServer
import io.ktor.server.netty.Netty
import io.ktor.server.plugins.autohead.AutoHeadResponse
import io.ktor.server.plugins.callloging.CallLogging
import io.ktor.server.plugins.contentnegotiation.ContentNegotiation
import io.ktor.server.plugins.cors.routing.CORS
import io.ktor.server.plugins.defaultheaders.DefaultHeaders
import io.ktor.server.plugins.statuspages.StatusPages
import io.ktor.server.request.receive
import io.ktor.server.response.respond
import io.ktor.server.routing.delete
import io.ktor.server.routing.get
import io.ktor.server.routing.post
import io.ktor.server.routing.route
import io.ktor.server.routing.routing
import io.ktor.server.http.content.staticResources
import kotlinx.serialization.json.Json
import java.nio.file.Path
import java.nio.file.Paths
import java.time.Instant

fun main() {
    val config = AppConfig.fromEnv()
    embeddedServer(Netty, host = "0.0.0.0", port = config.port) {
        helloTimeModule(config)
    }.start(wait = true)
}

fun Application.helloTimeModule(
    config: AppConfig = AppConfig.fromEnv(),
    nowProvider: () -> Instant = { Instant.now() }
) {
    val authService = AuthService(config)
    val repository = CapsuleRepository(resolveDatabasePath(config.databasePath))
    val capsuleService = CapsuleService(repository, authService, nowProvider)

    install(DefaultHeaders)
    install(CallLogging)
    install(AutoHeadResponse)
    install(ContentNegotiation) {
        json(Json {
            prettyPrint = false
            explicitNulls = true
            ignoreUnknownKeys = true
        })
    }
    install(CORS) {
        anyHost()
        allowHeader("Content-Type")
        allowHeader("Authorization")
        allowMethod(io.ktor.http.HttpMethod.Get)
        allowMethod(io.ktor.http.HttpMethod.Post)
        allowMethod(io.ktor.http.HttpMethod.Delete)
    }
    install(StatusPages) {
        exception<AppException> { call, cause ->
            call.respond(
                cause.statusCode,
                ApiResponse<Nothing?>(
                    success = false,
                    data = null,
                    message = cause.message,
                    errorCode = cause.errorCode
                )
            )
        }
        exception<Throwable> { call, _ ->
            call.respond(
                HttpStatusCode.InternalServerError,
                ApiResponse<Nothing?>(
                    success = false,
                    data = null,
                    message = "服务器内部错误",
                    errorCode = "INTERNAL_ERROR"
                )
            )
        }
    }
    install(io.ktor.server.auth.Authentication) {
        jwt("admin-auth") {
            verifier(authService.verifier())
            validate { credential ->
                if (credential.payload.isAdmin()) JWTPrincipal(credential.payload) else null
            }
            challenge { _, _ ->
                call.respond(
                    HttpStatusCode.Unauthorized,
                    ApiResponse<Nothing?>(
                        success = false,
                        data = null,
                        message = "未授权",
                        errorCode = "UNAUTHORIZED"
                    )
                )
            }
        }
    }

    routing {
        staticResources("/tech-logos", "static/tech-logos")

        route("/api/v1") {
            get("/health") {
                call.respond(
                    ApiResponse(
                        success = true,
                        data = HealthData(
                            status = "UP",
                            timestamp = nowProvider().toString(),
                            techStack = TechStack(
                                framework = "Ktor 2.3",
                                language = "Kotlin/JVM",
                                database = "SQLite"
                            )
                        ),
                        message = null,
                        errorCode = null
                    )
                )
            }

            post("/capsules") {
                val request = call.receive<com.hellotime.model.CreateCapsuleRequest>()
                call.respond(
                    HttpStatusCode.Created,
                    ApiResponse(
                        success = true,
                        data = capsuleService.createCapsule(request),
                        message = "胶囊创建成功",
                        errorCode = null
                    )
                )
            }

            get("/capsules/{code}") {
                val code = call.parameters["code"] ?: ""
                call.respond(
                    ApiResponse(
                        success = true,
                        data = capsuleService.getCapsule(code),
                        message = null,
                        errorCode = null
                    )
                )
            }

            post("/admin/login") {
                val request = call.receive<AdminLoginRequest>()
                call.respond(
                    ApiResponse(
                        success = true,
                        data = capsuleService.adminLogin(request.password),
                        message = "登录成功",
                        errorCode = null
                    )
                )
            }

            authenticate("admin-auth") {
                get("/admin/capsules") {
                    val page = call.request.queryParameters["page"]?.toIntOrNull() ?: 0
                    val size = call.request.queryParameters["size"]?.toIntOrNull() ?: 20
                    call.respond(
                        ApiResponse(
                            success = true,
                            data = capsuleService.listCapsules(page, size),
                            message = null,
                            errorCode = null
                        )
                    )
                }

                delete("/admin/capsules/{code}") {
                    val code = call.parameters["code"] ?: ""
                    capsuleService.deleteCapsule(code)
                    call.respond(
                        ApiResponse<String?>(
                            success = true,
                            data = null,
                            message = "胶囊删除成功",
                            errorCode = null
                        )
                    )
                }
            }
        }
    }
}

private fun Payload.isAdmin(): Boolean = getClaim("role").asString() == "admin"

private fun resolveDatabasePath(rawPath: String): Path {
    val path = Paths.get(rawPath)
    return if (path.isAbsolute) path else Paths.get(System.getProperty("user.dir")).resolve(path).normalize()
}
