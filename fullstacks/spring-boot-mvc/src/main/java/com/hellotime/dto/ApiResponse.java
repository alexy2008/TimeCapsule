package com.hellotime.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

/**
 * 统一 API 响应包装类
 * 所有接口返回的统一格式，确保前后端数据交互一致性
 * 
 * 使用 Java 21 Record 实现，配合静态工厂方法
 * 
 * 响应格式示例：
 * 成功：{ "success": true, "data": {...}, "message": "操作成功" }
 * 失败：{ "success": false, "data": null, "message": "错误信息", "errorCode": "ERROR_CODE" }
 *
 * @param success   请求是否成功
 * @param data      响应数据（成功时包含）
 * @param message   响应消息
 * @param errorCode 错误码（失败时包含）
 * @param <T>       响应数据类型
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public record ApiResponse<T>(
        boolean success,
        T data,
        String message,
        String errorCode
) {
    /**
     * 创建成功的响应（不含消息）
     */
    public static <T> ApiResponse<T> ok(T data) {
        return new ApiResponse<>(true, data, null, null);
    }

    /**
     * 创建成功的响应（含消息）
     */
    public static <T> ApiResponse<T> ok(T data, String message) {
        return new ApiResponse<>(true, data, message, null);
    }

    /**
     * 创建失败的响应
     */
    public static <T> ApiResponse<T> error(String message, String errorCode) {
        return new ApiResponse<>(false, null, message, errorCode);
    }
}