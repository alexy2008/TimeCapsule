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
 * 胶囊领域服务。
 * 这一层集中承载项目最核心的业务规则：
 * 创建胶囊、查询胶囊、分页管理，以及“未到开启时间不返回内容”。
 *
 * 在多技术栈对照阅读时，可把它视为其他后端实现中 service 层的基准版本。
 */
@Service
public class CapsuleService {

    /** 胶囊码只允许大写字母和数字，便于人工抄录和口头沟通。 */
    private static final String CODE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    /** 8 位长度在可读性和碰撞概率之间做一个简单平衡。 */
    private static final int CODE_LENGTH = 8;
    /** 演示项目不引入分布式发号器，因此采用随机码 + 有限重试。 */
    private static final int MAX_RETRIES = 10;
    /** 使用安全随机数而不是 Math.random，避免示例代码误导读者。 */
    private final SecureRandom random = new SecureRandom();

    private final CapsuleRepository capsuleRepository;

    public CapsuleService(CapsuleRepository capsuleRepository) {
        this.capsuleRepository = capsuleRepository;
    }

    /**
     * 创建时间胶囊。
     * 这里会同时完成时间校验、随机码生成和持久化，因此放在事务中处理。
     *
     * @param request 创建请求参数
     * @return 创建成功响应；为了和详情接口区分，创建响应不返回正文内容
     * @throws IllegalArgumentException 当开启时间不是未来时间时抛出
     */
    @Transactional
    public CapsuleResponse createCapsule(CreateCapsuleRequest request) {
        if (request.openAt().isBefore(Instant.now())) {
            throw new IllegalArgumentException("开启时间必须在未来");
        }

        String code = generateUniqueCode();
        Capsule capsule = new Capsule();
        capsule.setCode(code);
        capsule.setTitle(request.title());
        capsule.setContent(request.content());
        capsule.setCreator(request.creator());
        capsule.setOpenAt(request.openAt());

        capsule = capsuleRepository.save(capsule);
        return toCreatedResponse(capsule);
    }

    /**
     * 查询单个胶囊详情。
     * 项目的核心规则在这里兑现：普通访客在开启时间之前看不到正文内容。
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
     * 分页查询所有胶囊。
     * 管理视图按创建时间倒序展示，便于优先看到最近创建的数据。
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
     * 删除胶囊。
     * 这里先检查存在性，是为了让“删除不存在资源”返回明确的业务异常。
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
     * 生成唯一胶囊码。
     * 这个实现故意保持简单，便于初学者理解“随机码 + 唯一性检查”的基本模式。
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
     * 生成随机胶囊码。
     */
    private String generateCode() {
        StringBuilder sb = new StringBuilder(CODE_LENGTH);
        for (int i = 0; i < CODE_LENGTH; i++) {
            sb.append(CODE_CHARS.charAt(random.nextInt(CODE_CHARS.length())));
        }
        return sb.toString();
    }

    /**
     * 创建成功响应与详情响应不同：
     * 前者用于提示用户保存胶囊码，不负责回显正文和开启状态。
     */
    private CapsuleResponse toCreatedResponse(Capsule capsule) {
        return new CapsuleResponse(
                capsule.getCode(),
                capsule.getTitle(),
                null,
                capsule.getCreator(),
                capsule.getOpenAt(),
                capsule.getCreatedAt(),
                null
        );
    }

    /**
     * 普通详情接口只在胶囊到期后返回正文内容。
     * 这条规则是前后端各实现都需要保持一致的业务约束。
     */
    private CapsuleResponse toDetailResponse(Capsule capsule) {
        boolean opened = Instant.now().isAfter(capsule.getOpenAt());
        return new CapsuleResponse(
                capsule.getCode(),
                capsule.getTitle(),
                opened ? capsule.getContent() : null,
                capsule.getCreator(),
                capsule.getOpenAt(),
                capsule.getCreatedAt(),
                opened
        );
    }

    /**
     * 管理端始终返回正文内容，方便执行审核和删除操作。
     * 这也是它与公开详情接口最重要的差异之一。
     */
    private CapsuleResponse toAdminResponse(Capsule capsule) {
        boolean opened = Instant.now().isAfter(capsule.getOpenAt());
        return new CapsuleResponse(
                capsule.getCode(),
                capsule.getTitle(),
                capsule.getContent(),
                capsule.getCreator(),
                capsule.getOpenAt(),
                capsule.getCreatedAt(),
                opened
        );
    }
}
