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
 * 
 * 使用 Java 21 switch 模式匹配合并异常处理逻辑
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * 统一处理所有异常
     * 使用 Java 21 switch 模式匹配，根据异常类型返回对应响应
     *
     * @param ex 捕获的异常
     * @return 统一格式的错误响应
     */
    @ExceptionHandler({
            CapsuleNotFoundException.class,
            UnauthorizedException.class,
            IllegalArgumentException.class,
            MethodArgumentNotValidException.class,
            Exception.class
    })
    public ResponseEntity<ApiResponse<Void>> handleException(Exception ex) {
        return switch (ex) {
            case CapsuleNotFoundException e -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage(), "CAPSULE_NOT_FOUND"));
            
            case UnauthorizedException e -> ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error(e.getMessage(), "UNAUTHORIZED"));
            
            case IllegalArgumentException e -> ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage(), "BAD_REQUEST"));
            
            case MethodArgumentNotValidException e -> ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(formatValidationErrors(e), "VALIDATION_ERROR"));
            
            case Exception e -> ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("服务器内部错误", "INTERNAL_ERROR"));
        };
    }

    /**
     * 格式化参数校验错误信息
     * 将多个字段错误合并为一条消息
     *
     * @param ex 参数校验异常
     * @return 格式化后的错误信息
     */
    private String formatValidationErrors(MethodArgumentNotValidException ex) {
        return ex.getBindingResult().getFieldErrors().stream()
                .map(e -> e.getField() + ": " + e.getDefaultMessage())
                .reduce((a, b) -> a + "; " + b)
                .orElse("参数校验失败");
    }
}