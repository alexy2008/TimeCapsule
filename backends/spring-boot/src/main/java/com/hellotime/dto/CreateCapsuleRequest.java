package com.hellotime.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.Instant;

/**
 * 创建时间胶囊请求 DTO
 * 使用 Java 21 Record 实现，支持 Jakarta Validation 注解
 * 对应 POST /api/v1/capsules 接口
 *
 * @param title   胶囊标题（最多 100 字符）
 * @param content 胶囊内容
 * @param creator 创建者昵称（最多 30 字符）
 * @param openAt  胶囊开启时间
 */
public record CreateCapsuleRequest(
        @NotBlank(message = "标题不能为空")
        @Size(max = 100, message = "标题最多 100 个字符")
        String title,

        @NotBlank(message = "内容不能为空")
        String content,

        @NotBlank(message = "发布者不能为空")
        @Size(max = 30, message = "发布者名称最多 30 个字符")
        String creator,

        @NotNull(message = "开启时间不能为空")
        Instant openAt
) {}