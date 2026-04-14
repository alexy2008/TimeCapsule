package com.hellotime.model

import io.ktor.http.HttpStatusCode

class AppException(
    val statusCode: HttpStatusCode,
    override val message: String,
    val errorCode: String
) : RuntimeException(message)
