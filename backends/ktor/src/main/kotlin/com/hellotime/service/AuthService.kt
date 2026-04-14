package com.hellotime.service

import com.auth0.jwt.JWT
import com.auth0.jwt.JWTVerifier
import com.auth0.jwt.algorithms.Algorithm
import com.hellotime.config.AppConfig
import java.security.MessageDigest
import java.time.Instant
import java.util.Date

class AuthService(private val config: AppConfig) {
    private val algorithm = Algorithm.HMAC256(config.jwtSecret)

    fun verifyPassword(password: String): Boolean = MessageDigest.isEqual(
        password.toByteArray(Charsets.UTF_8),
        config.adminPassword.toByteArray(Charsets.UTF_8)
    )

    fun generateToken(now: Instant): String {
        val expiresAt = now.plusSeconds(config.jwtExpirationHours * 3600)
        return JWT.create()
            .withIssuer(config.jwtIssuer)
            .withClaim("role", "admin")
            .withExpiresAt(Date.from(expiresAt))
            .sign(algorithm)
    }

    fun expiresInSeconds(): Long = config.jwtExpirationHours * 3600

    fun verifier(): JWTVerifier = JWT.require(algorithm)
        .withIssuer(config.jwtIssuer)
        .build()
}
