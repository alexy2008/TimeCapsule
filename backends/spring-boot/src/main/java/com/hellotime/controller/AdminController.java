package com.hellotime.controller;

import com.hellotime.dto.*;
import com.hellotime.exception.UnauthorizedException;
import com.hellotime.service.AdminService;
import com.hellotime.service.CapsuleService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

/**
 * 管理员控制器
 * 处理管理员相关的 HTTP 请求
 * 基础路径：/api/v1/admin
 * 所有接口需要 Bearer Token 认证（除登录外）
 */
@RestController
@RequestMapping("/api/v1/admin")
public class AdminController {

    private final AdminService adminService;
    private final CapsuleService capsuleService;

    /**
     * 构造函数注入依赖
     */
    public AdminController(AdminService adminService, CapsuleService capsuleService) {
        this.adminService = adminService;
        this.capsuleService = capsuleService;
    }

    /**
     * 管理员登录
     * POST /api/v1/admin/login
     *
     * @param request 登录请求（包含密码）
     * @return JWT Token
     * @throws UnauthorizedException 密码错误时抛出
     */
    @PostMapping("/login")
    public ApiResponse<AdminTokenResponse> login(@Valid @RequestBody AdminLoginRequest request) {
        String token = adminService.login(request.getPassword());
        if (token == null) {
            throw new UnauthorizedException("密码错误");
        }
        return ApiResponse.ok(new AdminTokenResponse(token), "登录成功");
    }

    /**
     * 分页查询所有胶囊
     * GET /api/v1/admin/capsules?page=0&size=20
     * 需要认证
     *
     * @param page 页码（默认 0）
     * @param size 每页大小（默认 20）
     * @return 胶囊列表分页数据
     */
    @GetMapping("/capsules")
    public ApiResponse<PageResponse<CapsuleResponse>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.ok(capsuleService.listCapsules(page, size));
    }

    /**
     * 删除指定胶囊
     * DELETE /api/v1/admin/capsules/{code}
     * 需要认证
     *
     * @param code 8 位胶囊码
     * @return 删除结果
     */
    @DeleteMapping("/capsules/{code}")
    public ApiResponse<Void> delete(@PathVariable String code) {
        capsuleService.deleteCapsule(code);
        return ApiResponse.ok(null, "删除成功");
    }
}
