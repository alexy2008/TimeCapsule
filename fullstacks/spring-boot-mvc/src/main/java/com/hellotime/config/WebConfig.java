package com.hellotime.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Web MVC 配置类
 * 配置拦截器、 cors 等 Web 相关设置
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final AdminAuthInterceptor adminAuthInterceptor;

    public WebConfig(AdminAuthInterceptor adminAuthInterceptor) {
        this.adminAuthInterceptor = adminAuthInterceptor;
    }

    /**
     * 添加拦截器配置
     * 对所有 /api/v1/admin/** 路径启用管理员认证拦截
     * 但排除 /api/v1/admin/login（登录接口不需要认证）
     */
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(adminAuthInterceptor)
                .addPathPatterns("/api/v1/admin/**")      // 拦截所有管理员接口
                .excludePathPatterns("/api/v1/admin/login");  // 排除登录接口
    }
}
