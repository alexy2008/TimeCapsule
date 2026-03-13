package com.hellotime.exception;

import com.hellotime.dto.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * 全局异常处理器
 * 使用 @RestControllerAdvice 拦截所有 Controller 抛出的异常
 * 统一返回符合 API 规范的错误响应格式
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * 处理胶囊未找到异常
     *
     * @param ex CapsuleNotFoundException
     * @return 404 NOT FOUND
     */
    @ExceptionHandler(CapsuleNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleNotFound(CapsuleNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error(ex.getMessage(), "CAPSULE_NOT_FOUND"));
    }

    /**
     * 处理未授权异常
     * Token 缺失、无效或过期时抛出
     *
     * @param ex UnauthorizedException
     * @return 401 UNAUTHORIZED
     */
    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ApiResponse<Void>> handleUnauthorized(UnauthorizedException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.error(ex.getMessage(), "UNAUTHORIZED"));
    }

    /**
     * 处理参数校验异常
     * 当 @Valid 注解校验失败时抛出
     *
     * @param ex MethodArgumentNotValidException
     * @return 400 BAD REQUEST，包含具体字段错误信息
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidation(MethodArgumentNotValidException ex) {
        // 提取所有字段错误信息，格式化为 "字段名：错误信息; 字段名：错误信息"
        String message = ex.getBindingResult().getFieldErrors().stream()
                .map(e -> e.getField() + ": " + e.getDefaultMessage())
                .reduce((a, b) -> a + "; " + b)
                .orElse("参数校验失败");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(message, "VALIDATION_ERROR"));
    }

    /**
     * 处理非法参数异常
     * 业务逻辑校验失败时抛出（如：开启时间为过去）
     *
     * @param ex IllegalArgumentException
     * @return 400 BAD REQUEST
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<Void>> handleBadRequest(IllegalArgumentException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(ex.getMessage(), "BAD_REQUEST"));
    }

    /**
     * 处理其他未捕获的异常
     * 兜底处理器，避免暴露敏感堆栈信息
     *
     * @param ex Exception
     * @return 500 INTERNAL SERVER ERROR
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleGeneral(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("服务器内部错误", "INTERNAL_ERROR"));
    }
}
