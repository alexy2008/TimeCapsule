package com.hellotime.exception;

/**
 * 未授权异常
 * 当用户未提供 Token、Token 无效或已过期时抛出此异常
 * 会被 GlobalExceptionHandler 捕获并返回 401 响应
 */
public class UnauthorizedException extends RuntimeException {

    /**
     * 构造方法
     *
     * @param message 错误消息
     */
    public UnauthorizedException(String message) {
        super(message);
    }
}
