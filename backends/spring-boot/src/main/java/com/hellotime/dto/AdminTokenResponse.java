package com.hellotime.dto;

/**
 * 管理员登录成功响应 DTO
 * 使用 Java 21 Record 实现
 *
 * @param token JWT Token
 */
public record AdminTokenResponse(String token) {}