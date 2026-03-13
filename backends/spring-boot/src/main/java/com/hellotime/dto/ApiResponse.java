package com.hellotime.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

/**
 * 统一 API 响应包装类
 * 所有接口返回的统一格式，确保前后端数据交互一致性
 *
 * @param <T> 响应数据类型
 *
 * 响应格式示例：
 * 成功：{ "success": true, "data": {...}, "message": "操作成功" }
 * 失败：{ "success": false, "data": null, "message": "错误信息", "errorCode": "ERROR_CODE" }
 */
@JsonInclude(JsonInclude.Include.NON_NULL)  // 序列化时忽略 null 字段，减少响应体积
public class ApiResponse<T> {

    /** 请求是否成功 */
    private boolean success;
    /** 响应数据（成功时包含） */
    private T data;
    /** 响应消息（如：操作成功、错误信息） */
    private String message;
    /** 错误码（失败时包含，如：CAPSULE_NOT_FOUND） */
    private String errorCode;

    /**
     * 创建成功的响应（不含消息）
     */
    public static <T> ApiResponse<T> ok(T data) {
        ApiResponse<T> response = new ApiResponse<>();
        response.success = true;
        response.data = data;
        return response;
    }

    /**
     * 创建成功的响应（含消息）
     */
    public static <T> ApiResponse<T> ok(T data, String message) {
        ApiResponse<T> response = ok(data);
        response.message = message;
        return response;
    }

    /**
     * 创建失败的响应
     */
    public static <T> ApiResponse<T> error(String message, String errorCode) {
        ApiResponse<T> response = new ApiResponse<>();
        response.success = false;
        response.message = message;
        response.errorCode = errorCode;
        return response;
    }

    // ==================== Getter 和 Setter 方法 ====================

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }
    public T getData() { return data; }
    public void setData(T data) { this.data = data; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getErrorCode() { return errorCode; }
    public void setErrorCode(String errorCode) { this.errorCode = errorCode; }
}
