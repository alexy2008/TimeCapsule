package com.hellotime.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.Instant;

/**
 * 时间胶囊响应 DTO
 * 使用 Java 21 Record 实现，自动生成 getter/equals/hashCode/toString
 * 
 * @param code      8 位胶囊码
 * @param title     胶囊标题
 * @param content   胶囊内容（未开启时为 null）
 * @param creator   创建者昵称
 * @param openAt    开启时间（UTC）
 * @param createdAt 创建时间（UTC）
 * @param opened    是否已开启
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public record CapsuleResponse(
        String code,
        String title,
        String content,
        String creator,
        Instant openAt,
        Instant createdAt,
        Boolean opened
) {}