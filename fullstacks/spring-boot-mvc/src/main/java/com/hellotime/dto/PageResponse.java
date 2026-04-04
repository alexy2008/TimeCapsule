package com.hellotime.dto;

import java.util.List;

/**
 * 分页响应 DTO
 * 使用 Java 21 Record 实现
 *
 * @param content       当前页数据列表
 * @param totalElements 总记录数
 * @param totalPages    总页数
 * @param number        当前页码（从 0 开始）
 * @param size          每页大小
 * @param <T>           数据类型
 */
public record PageResponse<T>(
        List<T> content,
        long totalElements,
        int totalPages,
        int number,
        int size
) {}