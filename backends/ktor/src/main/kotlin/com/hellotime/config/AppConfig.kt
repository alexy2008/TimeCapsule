package com.hellotime.config

data class AppConfig(
    val port: Int,
    val databasePath: String,
    val adminPassword: String,
    val jwtSecret: String,
    val jwtIssuer: String,
    val jwtExpirationHours: Long
) {
    companion object {
        fun fromEnv(): AppConfig = AppConfig(
            port = System.getenv("PORT")?.toIntOrNull() ?: 8080,
            databasePath = System.getenv("DATABASE_PATH") ?: "data/hellotime.db",
            adminPassword = System.getenv("ADMIN_PASSWORD") ?: "timecapsule-admin",
            jwtSecret = System.getenv("JWT_SECRET") ?: "hellotime-ktor-secret-key",
            jwtIssuer = System.getenv("JWT_ISSUER") ?: "hellotime-admin",
            jwtExpirationHours = System.getenv("JWT_EXPIRATION_HOURS")?.toLongOrNull() ?: 2L
        )
    }
}
