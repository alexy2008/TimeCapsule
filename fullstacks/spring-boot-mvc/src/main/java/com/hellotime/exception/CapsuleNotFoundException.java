package com.hellotime.exception;

/**
 * 胶囊未找到异常
 * 当查询的胶囊码不存在时抛出此异常
 * 会被 GlobalExceptionHandler 捕获并返回 404 响应
 */
public class CapsuleNotFoundException extends RuntimeException {

    /**
     * 构造方法
     *
     * @param code 未找到的 8 位胶囊码
     */
    public CapsuleNotFoundException(String code) {
        super("胶囊不存在：" + code);
    }
}
