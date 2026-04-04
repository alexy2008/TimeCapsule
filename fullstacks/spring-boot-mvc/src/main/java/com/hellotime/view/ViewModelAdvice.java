package com.hellotime.view;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ModelAttribute;

import java.util.List;

@ControllerAdvice
public class ViewModelAdvice {

    /** MVC 版本直接用 session 标记管理员登录态，避免页面脚本接触 JWT。 */
    public static final String ADMIN_SESSION_KEY = "mvc_admin_logged_in";

    /** 全栈 MVC 版本不依赖外部 health 接口，技术栈展示数据在服务端直接准备。 */
    private static final List<TechStackItem> TECH_STACK = List.of(
            new TechStackItem("/stack-logos/spring-boot.svg", "Spring Boot Logo", "Spring Boot", "Spring Boot 3"),
            new TechStackItem("/stack-logos/java.svg", "Java Logo", "Java", "Java 21"),
            new TechStackItem("/stack-logos/thymeleaf.svg", "Thymeleaf Logo", "Thymeleaf", "Thymeleaf 3"),
            new TechStackItem("/stack-logos/htmx.svg", "HTMX Logo", "HTMX", "HTMX 2"),
            new TechStackItem("/stack-logos/sqlite.svg", "SQLite Logo", "SQLite", "SQLite")
    );

    @ModelAttribute("techItems")
    public List<TechStackItem> techItems() {
        return TECH_STACK;
    }

    @ModelAttribute("techSummary")
    public String techSummary() {
        // 提供给标题、副标题等轻量展示场景，避免模板里重复拼接。
        return String.join(" · ", TECH_STACK.stream().map(TechStackItem::label).toList());
    }

    @ModelAttribute("currentPath")
    public String currentPath(HttpServletRequest request) {
        return request.getRequestURI();
    }

    @ModelAttribute("mvcAdminLoggedIn")
    public boolean mvcAdminLoggedIn(HttpSession session) {
        return Boolean.TRUE.equals(session.getAttribute(ADMIN_SESSION_KEY));
    }
}
