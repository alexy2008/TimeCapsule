package com.hellotime.service

import com.hellotime.model.AdminCapsuleItem
import com.hellotime.model.AdminTokenResponse
import com.hellotime.model.AppException
import com.hellotime.model.CapsuleCreatedResponse
import com.hellotime.model.CapsuleDetailResponse
import com.hellotime.model.CapsulePageResponse
import com.hellotime.model.CreateCapsuleRequest
import io.ktor.http.HttpStatusCode
import java.security.SecureRandom
import java.time.Instant

class CapsuleService(
    private val repository: CapsuleRepository,
    private val authService: AuthService,
    private val nowProvider: () -> Instant = { Instant.now() }
) {
    private val random = SecureRandom()
    private val alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

    fun createCapsule(request: CreateCapsuleRequest): CapsuleCreatedResponse {
        val title = request.title.trim()
        val creator = request.creator.trim()
        val content = request.content
        val openAt = parseOpenAt(request.openAt)
        val now = nowProvider()

        if (title.isEmpty() || title.length > 100) {
            throw AppException(HttpStatusCode.BadRequest, "标题长度必须在 1-100 之间", "INVALID_TITLE")
        }
        if (creator.isEmpty() || creator.length > 30) {
            throw AppException(HttpStatusCode.BadRequest, "署名长度必须在 1-30 之间", "INVALID_CREATOR")
        }
        if (!openAt.isAfter(now)) {
            throw AppException(HttpStatusCode.BadRequest, "开启时间必须晚于当前时间", "INVALID_OPEN_AT")
        }

        val createdAt = now
        repeat(10) {
            val code = generateCode()
            val inserted = repository.insert(
                CapsuleRecord(
                    code = code,
                    title = title,
                    content = content,
                    creator = creator,
                    openAt = openAt,
                    createdAt = createdAt
                )
            )
            if (inserted) {
                return CapsuleCreatedResponse(code, title, creator, openAt.toString(), createdAt.toString())
            }
        }

        throw AppException(HttpStatusCode.InternalServerError, "胶囊码生成失败，请重试", "CODE_GENERATION_FAILED")
    }

    fun getCapsule(code: String): CapsuleDetailResponse {
        val record = repository.findByCode(code)
            ?: throw AppException(HttpStatusCode.NotFound, "胶囊不存在", "CAPSULE_NOT_FOUND")
        val now = nowProvider()
        val opened = !record.openAt.isAfter(now)
        return CapsuleDetailResponse(
            code = record.code,
            title = record.title,
            content = if (opened) record.content else null,
            creator = record.creator,
            openAt = record.openAt.toString(),
            createdAt = record.createdAt.toString(),
            opened = opened
        )
    }

    fun adminLogin(password: String): AdminTokenResponse {
        if (!authService.verifyPassword(password)) {
            throw AppException(HttpStatusCode.Unauthorized, "管理员密码错误", "UNAUTHORIZED")
        }
        return AdminTokenResponse(
            token = authService.generateToken(nowProvider()),
            expiresIn = authService.expiresInSeconds()
        )
    }

    fun listCapsules(page: Int, size: Int): CapsulePageResponse {
        if (page < 0) {
            throw AppException(HttpStatusCode.BadRequest, "页码不能小于 0", "INVALID_PAGE")
        }
        if (size !in 1..100) {
            throw AppException(HttpStatusCode.BadRequest, "每页数量必须在 1-100 之间", "INVALID_SIZE")
        }

        val totalElements = repository.count()
        val items = repository.list(page, size).map { record ->
            AdminCapsuleItem(
                code = record.code,
                title = record.title,
                content = record.content,
                creator = record.creator,
                openAt = record.openAt.toString(),
                createdAt = record.createdAt.toString(),
                opened = !record.openAt.isAfter(nowProvider())
            )
        }
        val totalPages = if (totalElements == 0L) 0 else ((totalElements + size - 1) / size).toInt()
        return CapsulePageResponse(items, number = page, size, totalElements, totalPages)
    }

    fun deleteCapsule(code: String) {
        if (!repository.delete(code)) {
            throw AppException(HttpStatusCode.NotFound, "胶囊不存在", "CAPSULE_NOT_FOUND")
        }
    }

    private fun parseOpenAt(value: String): Instant = try {
        Instant.parse(value)
    } catch (_: Exception) {
        throw AppException(HttpStatusCode.BadRequest, "开启时间必须是 ISO 8601 格式", "INVALID_OPEN_AT")
    }

    private fun generateCode(): String = buildString(8) {
        repeat(8) {
            append(alphabet[random.nextInt(alphabet.length)])
        }
    }
}
