package com.hellotime.config;

import com.hellotime.exception.UnauthorizedException;
import com.hellotime.service.AdminService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

/**
 * 管理员认证拦截器
 * 拦截需要管理员认证的请求，验证 JWT Token 的有效性
 * 配置在 WebConfig 中，对 /api/v1/admin/** 路径生效
 */
@Component
public class AdminAuthInterceptor implements HandlerInterceptor {

    private final AdminService adminService;

    public AdminAuthInterceptor(AdminService adminService) {
        this.adminService = adminService;
    }

    /**
     * 请求预处理方法
     * 在目标 Controller 方法执行前调用
     *
     * @param request HTTP 请求对象
     * @param response HTTP 响应对象
     * @param handler 被拦截的处理器
     * @return true 放行，false 阻断请求
     * @throws UnauthorizedException 当 Token 缺失、无效或过期时抛出
     */
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        // 放行 OPTIONS 请求（CORS 预检请求）
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            return true;
        }

        // 获取 Authorization 请求头
        String authHeader = request.getHeader("Authorization");
        // 校验：必须包含 Bearer Token
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new UnauthorizedException("缺少认证令牌");
        }

        // 提取 Token 部分（去掉 "Bearer " 前缀）
        String token = authHeader.substring(7);
        // 校验：Token 必须有效且未过期
        if (!adminService.validateToken(token)) {
            throw new UnauthorizedException("认证令牌无效或已过期");
        }

        // 认证通过，放行
        return true;
    }
}
