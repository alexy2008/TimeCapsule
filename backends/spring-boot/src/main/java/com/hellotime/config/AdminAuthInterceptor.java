package com.hellotime.config;

import com.hellotime.exception.UnauthorizedException;
import com.hellotime.service.AdminService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

/**
 * 管理端接口拦截器。
 * 通过拦截器而不是在每个 Controller 中手工校验 token，能更直观地展示横切认证逻辑。
 */
@Component
public class AdminAuthInterceptor implements HandlerInterceptor {

    private final AdminService adminService;

    public AdminAuthInterceptor(AdminService adminService) {
        this.adminService = adminService;
    }

    /**
     * 在进入管理端控制器前统一执行认证。
     * 这让 Controller 可以专注业务处理，而不是重复解析请求头。
     */
    @Override
    public boolean preHandle(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull Object handler) {
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            return true;
        }

        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new UnauthorizedException("缺少认证令牌");
        }

        String token = authHeader.substring(7);
        if (!adminService.validateToken(token)) {
            throw new UnauthorizedException("认证令牌无效或已过期");
        }

        return true;
    }
}
