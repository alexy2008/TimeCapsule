package com.hellotime.controller;

import com.hellotime.dto.ApiResponse;
import com.hellotime.dto.CapsuleResponse;
import com.hellotime.dto.CreateCapsuleRequest;
import com.hellotime.service.CapsuleService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * 时间胶囊控制器
 * 处理与时间胶囊相关的 HTTP 请求
 * 基础路径：/api/v1/capsules
 */
@RestController
@RequestMapping("/api/v1/capsules")
public class CapsuleController {

    private final CapsuleService capsuleService;

    /**
     * 构造函数注入依赖
     */
    public CapsuleController(CapsuleService capsuleService) {
        this.capsuleService = capsuleService;
    }

    /**
     * 创建时间胶囊
     * POST /api/v1/capsules
     *
     * @param request 创建请求体（@Valid 自动校验参数）
     * @return 201 创建成功，返回胶囊信息（不含 content）
     */
    @PostMapping
    public ResponseEntity<ApiResponse<CapsuleResponse>> create(@Valid @RequestBody CreateCapsuleRequest request) {
        CapsuleResponse capsule = capsuleService.createCapsule(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(capsule, "胶囊创建成功"));
    }

    /**
     * 查询时间胶囊详情
     * GET /api/v1/capsules/{code}
     *
     * @param code 8 位胶囊码
     * @return 胶囊信息（时间未到时 content 为 null）
     */
    @GetMapping("/{code}")
    public ApiResponse<CapsuleResponse> get(@PathVariable String code) {
        CapsuleResponse capsule = capsuleService.getCapsule(code);
        return ApiResponse.ok(capsule);
    }
}
