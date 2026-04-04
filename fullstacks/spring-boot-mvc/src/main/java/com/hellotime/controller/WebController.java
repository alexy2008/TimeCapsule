package com.hellotime.controller;

import com.hellotime.dto.CapsuleResponse;
import com.hellotime.dto.CreateCapsuleRequest;
import com.hellotime.dto.PageResponse;
import com.hellotime.exception.CapsuleNotFoundException;
import com.hellotime.service.AdminService;
import com.hellotime.service.CapsuleService;
import com.hellotime.view.CreateCapsuleFormData;
import com.hellotime.view.ViewFormats;
import com.hellotime.view.ViewModelAdvice;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;

@Controller
public class WebController {

    private static final int ADMIN_PAGE_SIZE = 20;

    private final CapsuleService capsuleService;
    private final AdminService adminService;

    public WebController(CapsuleService capsuleService, AdminService adminService) {
        this.capsuleService = capsuleService;
        this.adminService = adminService;
    }

    /** 传统 MVC 页面直接返回模板名，由 Thymeleaf 完成服务端渲染。 */
    @GetMapping("/")
    public String home() {
        return "index";
    }

    @GetMapping("/about")
    public String about() {
        return "about";
    }

    @GetMapping("/create")
    public String create(Model model) {
        if (!model.containsAttribute("form")) {
            model.addAttribute("form", new CreateCapsuleFormData());
        }
        return "create";
    }

    @PostMapping("/create")
    public String createSubmit(
            @Valid @ModelAttribute("form") CreateCapsuleFormData form,
            BindingResult bindingResult,
            Model model) {
        // HTML 的 datetime-local 只保证表单字段非空，不保证业务上的“必须是未来时间”，
        // 所以这里仍要保留一层服务端校验。
        if (form.getOpenAt() == null) {
            bindingResult.rejectValue("openAt", "required", "开启时间不能为空");
        }

        if (bindingResult.hasErrors()) {
            return "create";
        }

        Instant openAt = form.getOpenAt().atZone(ZoneId.systemDefault()).toInstant();
        try {
            CapsuleResponse created = capsuleService.createCapsule(new CreateCapsuleRequest(
                    form.getTitle().trim(),
                    form.getContent().trim(),
                    form.getCreator().trim(),
                    openAt
            ));
            model.addAttribute("createdCapsule", created);
            return "create";
        } catch (IllegalArgumentException ex) {
            model.addAttribute("createError", ex.getMessage());
            return "create";
        }
    }

    @GetMapping("/open")
    public String open(@RequestParam(required = false) String code) {
        if (code != null && !code.isBlank()) {
            return "redirect:/open/" + URLEncoder.encode(code.trim(), StandardCharsets.UTF_8);
        }
        return "open";
    }

    @GetMapping("/open/{code}")
    public String openByCode(@PathVariable String code, Model model) {
        try {
            model.addAttribute("capsule", capsuleService.getCapsule(code));
        } catch (CapsuleNotFoundException ex) {
            // MVC 版本把错误直接放回模板模型，而不是像 REST 接口那样返回 JSON 错误体。
            model.addAttribute("openError", "未找到对应的时间胶囊");
            model.addAttribute("lookupCode", code);
        }
        return "open";
    }

    @GetMapping("/admin")
    public String admin(@RequestParam(defaultValue = "0") int page, HttpSession session, Model model) {
        if (isLoggedIn(session)) {
            populateAdminModel(model, capsuleService.listCapsules(Math.max(0, page), ADMIN_PAGE_SIZE));
        }
        return "admin";
    }

    @PostMapping("/admin/login")
    public String adminLogin(@RequestParam String password, HttpSession session, Model model) {
        String token = adminService.login(password);
        if (token == null) {
            model.addAttribute("adminError", "密码错误");
            return "admin";
        }
        // MVC 版本不把 JWT 暴露给页面脚本，而是退化成最容易理解的 HttpSession 登录态。
        session.setAttribute(ViewModelAdvice.ADMIN_SESSION_KEY, true);
        return "redirect:/admin";
    }

    @PostMapping("/admin/logout")
    public String adminLogout(HttpSession session) {
        session.invalidate();
        return "redirect:/admin";
    }

    @GetMapping("/admin/table")
    public String adminTable(
            @RequestParam(defaultValue = "0") int page,
            HttpSession session,
            HttpServletResponse response,
            Model model) {
        if (!isLoggedIn(session)) {
            // HTMX 片段请求无法直接走传统重定向时，用 HX-Redirect 告知前端回到登录页。
            response.setHeader("HX-Redirect", "/admin");
            return "fragments/admin-table :: tablePanel";
        }
        populateAdminModel(model, capsuleService.listCapsules(Math.max(0, page), ADMIN_PAGE_SIZE));
        return "fragments/admin-table :: tablePanel";
    }

    @PostMapping("/admin/capsules/{code}/delete")
    public String deleteCapsule(
            @PathVariable String code,
            @RequestParam(defaultValue = "0") int page,
            HttpSession session,
            HttpServletResponse response,
            Model model) {
        if (!isLoggedIn(session)) {
            response.setHeader("HX-Redirect", "/admin");
            return "fragments/admin-table :: tablePanel";
        }
        capsuleService.deleteCapsule(code);
        int targetPage = Math.max(0, page);
        PageResponse<CapsuleResponse> pageData = capsuleService.listCapsules(targetPage, ADMIN_PAGE_SIZE);
        // 删除后如果当前页已经没有数据，则回退一页，避免表格停留在空页上。
        if (targetPage > 0 && pageData.content().isEmpty()) {
            pageData = capsuleService.listCapsules(targetPage - 1, ADMIN_PAGE_SIZE);
        }
        populateAdminModel(model, pageData);
        return "fragments/admin-table :: tablePanel";
    }

    @ModelAttribute("viewFormats")
    public ViewFormats viewFormats() {
        return new ViewFormats();
    }

    @ModelAttribute("minOpenAt")
    public String minOpenAt() {
        return ViewFormats.datetimeLocal(LocalDateTime.now().plusMinutes(1).atZone(ZoneId.systemDefault()).toInstant());
    }

    private boolean isLoggedIn(HttpSession session) {
        return Boolean.TRUE.equals(session.getAttribute(ViewModelAdvice.ADMIN_SESSION_KEY));
    }

    private void populateAdminModel(Model model, PageResponse<CapsuleResponse> pageData) {
        model.addAttribute("pageData", pageData);
        model.addAttribute("capsules", pageData.content());
        model.addAttribute("currentPage", pageData.number());
        model.addAttribute("totalPages", pageData.totalPages());
    }
}
