package com.hellotime.service;

import com.hellotime.dto.CapsuleResponse;
import com.hellotime.dto.CreateCapsuleRequest;
import com.hellotime.dto.PageResponse;
import com.hellotime.entity.Capsule;
import com.hellotime.exception.CapsuleNotFoundException;
import com.hellotime.repository.CapsuleRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.List;

/**
 * 胶囊服务类
 * 负责时间胶囊的核心业务逻辑：创建、查询、删除、分页列表
 */
@Service
public class CapsuleService {

    /** 胶囊码字符集：62 个字符（大小写字母 + 数字） */
    private static final String CODE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    /** 胶囊码长度：8 位 */
    private static final int CODE_LENGTH = 8;
    /** 生成唯一码的最大重试次数 */
    private static final int MAX_RETRIES = 10;
    /** 安全随机数生成器，用于生成随机胶囊码 */
    private final SecureRandom random = new SecureRandom();

    private final CapsuleRepository capsuleRepository;

    public CapsuleService(CapsuleRepository capsuleRepository) {
        this.capsuleRepository = capsuleRepository;
    }

    /**
     * 创建时间胶囊
     * 事务方法，确保创建过程的原子性
     *
     * @param request 创建请求参数
     * @return 创建成功的胶囊响应（不含内容）
     * @throws IllegalArgumentException 当开启时间是过去时间时抛出
     */
    @Transactional
    public CapsuleResponse createCapsule(CreateCapsuleRequest request) {
        // 校验：开启时间必须在未来
        if (request.getOpenAt().isBefore(Instant.now())) {
            throw new IllegalArgumentException("开启时间必须在未来");
        }

        // 生成唯一的 8 位胶囊码
        String code = generateUniqueCode();

        // 构建胶囊实体
        Capsule capsule = new Capsule();
        capsule.setCode(code);
        capsule.setTitle(request.getTitle());
        capsule.setContent(request.getContent());
        capsule.setCreator(request.getCreator());
        capsule.setOpenAt(request.getOpenAt());

        // 保存到数据库
        capsule = capsuleRepository.save(capsule);
        return toCreatedResponse(capsule);
    }

    /**
     * 查询单个胶囊详情
     * 核心业务逻辑：时间未到时，不返回内容
     *
     * @param code 8 位胶囊码
     * @return 胶囊响应对象
     * @throws CapsuleNotFoundException 当胶囊不存在时抛出
     */
    public CapsuleResponse getCapsule(String code) {
        Capsule capsule = capsuleRepository.findByCode(code)
                .orElseThrow(() -> new CapsuleNotFoundException(code));
        return toDetailResponse(capsule);
    }

    /**
     * 分页查询所有胶囊（管理员功能）
     * 按创建时间倒序排列
     *
     * @param page 页码（从 0 开始）
     * @param size 每页大小
     * @return 分页响应对象
     */
    public PageResponse<CapsuleResponse> listCapsules(int page, int size) {
        Page<Capsule> capsulePage = capsuleRepository.findAllByOrderByCreatedAtDesc(PageRequest.of(page, size));
        List<CapsuleResponse> content = capsulePage.getContent().stream()
                .map(this::toAdminResponse)
                .toList();
        return new PageResponse<>(content, capsulePage.getTotalElements(),
                capsulePage.getTotalPages(), capsulePage.getNumber(), capsulePage.getSize());
    }

    /**
     * 删除胶囊（管理员功能）
     * 事务方法，确保删除操作的原子性
     *
     * @param code 8 位胶囊码
     * @throws CapsuleNotFoundException 当胶囊不存在时抛出
     */
    @Transactional
    public void deleteCapsule(String code) {
        if (!capsuleRepository.existsByCode(code)) {
            throw new CapsuleNotFoundException(code);
        }
        capsuleRepository.deleteByCode(code);
    }

    /**
     * 生成唯一的胶囊码
     * 通过循环重试确保唯一性，超过最大重试次数抛出异常
     */
    private String generateUniqueCode() {
        for (int i = 0; i < MAX_RETRIES; i++) {
            String code = generateCode();
            if (!capsuleRepository.existsByCode(code)) {
                return code;
            }
        }
        throw new RuntimeException("无法生成唯一胶囊码");
    }

    /**
     * 生成随机 8 位胶囊码
     * 使用 SecureRandom 确保随机性
     */
    private String generateCode() {
        StringBuilder sb = new StringBuilder(CODE_LENGTH);
        for (int i = 0; i < CODE_LENGTH; i++) {
            sb.append(CODE_CHARS.charAt(random.nextInt(CODE_CHARS.length())));
        }
        return sb.toString();
    }

    /**
     * 转换为创建成功响应对象
     * 不包含 content 字段
     */
    private CapsuleResponse toCreatedResponse(Capsule capsule) {
        CapsuleResponse response = new CapsuleResponse();
        response.setCode(capsule.getCode());
        response.setTitle(capsule.getTitle());
        response.setCreator(capsule.getCreator());
        response.setOpenAt(capsule.getOpenAt());
        response.setCreatedAt(capsule.getCreatedAt());
        return response;
    }

    /**
     * 转换为详情页响应对象
     * 核心逻辑：判断是否已到开启时间，未到则不返回 content
     */
    private CapsuleResponse toDetailResponse(Capsule capsule) {
        CapsuleResponse response = new CapsuleResponse();
        response.setCode(capsule.getCode());
        response.setTitle(capsule.getTitle());
        response.setCreator(capsule.getCreator());
        response.setOpenAt(capsule.getOpenAt());
        response.setCreatedAt(capsule.getCreatedAt());

        // 判断是否已到开启时间
        boolean opened = Instant.now().isAfter(capsule.getOpenAt());
        response.setOpened(opened);
        // 只有到开启时间后才返回内容
        if (opened) {
            response.setContent(capsule.getContent());
        }
        return response;
    }

    /**
     * 转换为管理员视图响应对象
     * 管理员可以看到所有内容，无论是否开启
     */
    private CapsuleResponse toAdminResponse(Capsule capsule) {
        CapsuleResponse response = new CapsuleResponse();
        response.setCode(capsule.getCode());
        response.setTitle(capsule.getTitle());
        response.setContent(capsule.getContent());
        response.setCreator(capsule.getCreator());
        response.setOpenAt(capsule.getOpenAt());
        response.setCreatedAt(capsule.getCreatedAt());
        response.setOpened(Instant.now().isAfter(capsule.getOpenAt()));
        return response;
    }
}
