package com.hellotime.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * 管理员登录请求 DTO
 * 使用 Java 21 Record 实现，支持 Jakarta Validation 注解
 *
 * @param password 管理员密码
 */
public record AdminLoginRequest(
        @NotBlank(message = "密码不能为空")
        String password
) {}