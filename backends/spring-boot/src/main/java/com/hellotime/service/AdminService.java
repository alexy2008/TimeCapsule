package com.hellotime.service;

import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/**
 * 管理员认证服务。
 * 这个实现刻意保持轻量：只有一个固定管理员账户，主要用于演示 JWT 登录流程。
 */
@Service
public class AdminService {

    /** 管理员密码从配置读取，避免把演示凭据硬编码到源码。 */
    private final String adminPassword;
    /** 所有 JWT 都使用同一签名密钥校验。 */
    private final SecretKey signingKey;
    /** 统一过期时长，便于在不同控制器和拦截器之间复用。 */
    private final long expirationMs;

    /**
     * @param adminPassword 管理员密码（默认：timecapsule-admin）
     * @param jwtSecret JWT 签名密钥
     * @param expirationHours Token 有效期（小时），默认 2 小时
     */
    public AdminService(
            @Value("${app.admin.password}") String adminPassword,
            @Value("${app.jwt.secret}") String jwtSecret,
            @Value("${app.jwt.expiration-hours}") long expirationHours) {
        this.adminPassword = adminPassword;
        this.signingKey = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
        this.expirationMs = expirationHours * 3600 * 1000;
    }

    /**
     * 管理员登录。
     * 为了简化演示，密码错误时返回 null，而不是引入更复杂的认证对象。
     *
     * @param password 管理员密码
     * @return JWT Token（密码错误返回 null）
     */
    public String login(String password) {
        if (!adminPassword.equals(password)) {
            return null;
        }
        Date now = new Date();
        return Jwts.builder()
                .subject("admin")
                .issuedAt(now)
                .expiration(new Date(now.getTime() + expirationMs))
                .signWith(signingKey)
                .compact();
    }

    /**
     * 验证 JWT 是否有效。
     * 只要签名正确且未过期，就视为当前请求具备管理员身份。
     *
     * @param token JWT Token
     * @return true 有效，false 无效或已过期
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(signingKey)
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}
