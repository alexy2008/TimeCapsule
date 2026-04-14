package com.hellotime.model

import kotlinx.serialization.Serializable

@Serializable
data class ApiResponse<T>(
    val success: Boolean,
    val data: T? = null,
    val message: String? = null,
    val errorCode: String? = null
)

@Serializable
data class TechStack(
    val framework: String,
    val language: String,
    val database: String
)

@Serializable
data class HealthData(
    val status: String,
    val timestamp: String,
    val techStack: TechStack
)

@Serializable
data class CreateCapsuleRequest(
    val title: String,
    val content: String,
    val creator: String,
    val openAt: String
)

@Serializable
data class CapsuleCreatedResponse(
    val code: String,
    val title: String,
    val creator: String,
    val openAt: String,
    val createdAt: String
)

@Serializable
data class CapsuleDetailResponse(
    val code: String,
    val title: String,
    val content: String? = null,
    val creator: String,
    val openAt: String,
    val createdAt: String,
    val opened: Boolean
)

@Serializable
data class AdminLoginRequest(val password: String)

@Serializable
data class AdminTokenResponse(
    val token: String,
    val expiresIn: Long
)

@Serializable
data class AdminCapsuleItem(
    val code: String,
    val title: String,
    val content: String,
    val creator: String,
    val openAt: String,
    val createdAt: String,
    val opened: Boolean
)

@Serializable
data class CapsulePageResponse(
    val content: List<AdminCapsuleItem>,
    val number: Int,
    val size: Int,
    val totalElements: Long,
    val totalPages: Int
)
