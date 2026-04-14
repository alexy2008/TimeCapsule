package com.hellotime

import com.hellotime.config.AppConfig
import io.ktor.client.call.body
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.client.request.delete
import io.ktor.client.request.get
import io.ktor.client.request.header
import io.ktor.client.request.post
import io.ktor.client.request.setBody
import io.ktor.http.ContentType
import io.ktor.http.HttpHeaders
import io.ktor.http.HttpStatusCode
import io.ktor.http.contentType
import io.ktor.serialization.kotlinx.json.json
import io.ktor.server.testing.testApplication
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.jsonObject
import kotlinx.serialization.json.jsonPrimitive
import kotlin.io.path.createTempDirectory
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertNotNull
import kotlin.test.assertTrue
import java.time.Instant

class ApplicationTest {
    private val json = Json { ignoreUnknownKeys = true }

    @Test
    fun healthReturnsUp() = withApp { client ->
        val response = client.get("/api/v1/health")
        assertEquals(HttpStatusCode.OK, response.status)
        val body = json.parseToJsonElement(response.body<String>()).jsonObject
        assertEquals("UP", body["data"]!!.jsonObject["status"]!!.jsonPrimitive.content)
        assertEquals("Ktor 2.3", body["data"]!!.jsonObject["techStack"]!!.jsonObject["framework"]!!.jsonPrimitive.content)
    }

    @Test
    fun createAndFetchLockedCapsule() = withApp { client ->
        val createResponse = client.post("/api/v1/capsules") {
            contentType(ContentType.Application.Json)
            setBody(
                """
                {"title":"Future","content":"hello","creator":"alex","openAt":"2026-04-14T00:00:00Z"}
                """.trimIndent()
            )
        }
        assertEquals(HttpStatusCode.Created, createResponse.status)
        val code = json.parseToJsonElement(createResponse.body<String>()).jsonObject["data"]!!
            .jsonObject["code"]!!.jsonPrimitive.content

        val fetchResponse = client.get("/api/v1/capsules/$code")
        assertEquals(HttpStatusCode.OK, fetchResponse.status)
        val body = json.parseToJsonElement(fetchResponse.body<String>()).jsonObject["data"]!!.jsonObject
        assertEquals("null", body["content"].toString())
        assertEquals("false", body["opened"]!!.jsonPrimitive.content)
    }

    @Test
    fun invalidTimeFormatReturns400() = withApp { client ->
        val response = client.post("/api/v1/capsules") {
            contentType(ContentType.Application.Json)
            setBody("""{"title":"x","content":"y","creator":"z","openAt":"bad-date"}""")
        }
        assertEquals(HttpStatusCode.BadRequest, response.status)
    }

    @Test
    fun adminCanListAndDeleteCapsules() = withApp { client ->
        val createResponse = client.post("/api/v1/capsules") {
            contentType(ContentType.Application.Json)
            setBody("""{"title":"Now","content":"hello","creator":"alex","openAt":"2026-04-14T00:00:00Z"}""")
        }
        assertEquals(HttpStatusCode.Created, createResponse.status)
        val code = json.parseToJsonElement(createResponse.body<String>()).jsonObject["data"]!!
            .jsonObject["code"]!!.jsonPrimitive.content

        val loginResponse = client.post("/api/v1/admin/login") {
            contentType(ContentType.Application.Json)
            setBody("""{"password":"timecapsule-admin"}""")
        }
        val token = json.parseToJsonElement(loginResponse.body<String>()).jsonObject["data"]!!
            .jsonObject["token"]!!.jsonPrimitive.content
        assertNotNull(token)

        val listResponse = client.get("/api/v1/admin/capsules") {
            header(HttpHeaders.Authorization, "Bearer $token")
        }
        assertEquals(HttpStatusCode.OK, listResponse.status)
        assertTrue(listResponse.body<String>().contains(code))

        val deleteResponse = client.delete("/api/v1/admin/capsules/$code") {
            header(HttpHeaders.Authorization, "Bearer $token")
        }
        assertEquals(HttpStatusCode.OK, deleteResponse.status)
    }

    private fun withApp(block: suspend (io.ktor.client.HttpClient) -> Unit) {
        val databaseDir = createTempDirectory("ktor-backend-test")
        testApplication {
            application {
                helloTimeModule(
                    config = AppConfig(
                        port = 18090,
                        databasePath = databaseDir.resolve("test.db").toString(),
                        adminPassword = "timecapsule-admin",
                        jwtSecret = "ktor-test-secret",
                        jwtIssuer = "hellotime-admin",
                        jwtExpirationHours = 2
                    ),
                    nowProvider = { Instant.parse("2026-04-13T00:00:00Z") }
                )
            }

            val client = createClient {
                install(ContentNegotiation) {
                    json()
                }
            }
            kotlinx.coroutines.runBlocking { block(client) }
        }
    }
}
