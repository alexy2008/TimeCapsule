package com.hellotime.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/**
 * 管理员服务类
 * 负责管理员登录认证和 JWT Token 的生成与验证
 */
@Service
public class AdminService {

    /** 管理员密码（从配置文件读取） */
    private final String adminPassword;
    /** JWT 签名密钥（HMAC-SHA 算法） */
    private final SecretKey signingKey;
    /** Token 过期时间（毫秒） */
    private final long expirationMs;

    /**
     * 构造函数注入配置参数
     *
     * @param adminPassword 管理员密码（默认：timecapsule-admin）
     * @param jwtSecret JWT 签名密钥
     * @param expirationHours Token 有效期（小时），默认 2 小时
     */
    public AdminService(
            @Value("${app.admin.password}") String adminPassword,
            @Value("${app.jwt.secret}") String jwtSecret,
            @Value("${app.jwt.expiration-hours}") long expirationHours) {
        this.adminPassword = adminPassword;
        // 使用 HMAC-SHA256 算法，将密钥字符串转换为 SecretKey
        this.signingKey = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
        // 小时转换为毫秒
        this.expirationMs = expirationHours * 3600 * 1000;
    }

    /**
     * 管理员登录
     * 密码验证通过后生成 JWT Token
     *
     * @param password 管理员密码
     * @return JWT Token（密码错误返回 null）
     */
    public String login(String password) {
        // 密码校验失败返回 null
        if (!adminPassword.equals(password)) {
            return null;
        }
        Date now = new Date();
        // 使用 JJWT 库构建 Token
        return Jwts.builder()
                .subject("admin")                          // 主题：admin
                .issuedAt(now)                             // 签发时间
                .expiration(new Date(now.getTime() + expirationMs))  // 过期时间
                .signWith(signingKey)                      // 签名
                .compact();
    }

    /**
     * 验证 JWT Token 是否有效
     * 检查签名和过期时间
     *
     * @param token JWT Token
     * @return true 有效，false 无效或已过期
     */
    public boolean validateToken(String token) {
        try {
            // 验证签名并解析 Token
            Jwts.parser()
                    .verifyWith(signingKey)  // 使用签名密钥验证
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            // 签名无效、Token 过期或格式错误都返回 false
            return false;
        }
    }
}
