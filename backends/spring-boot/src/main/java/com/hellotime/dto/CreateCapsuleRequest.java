package com.hellotime.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.Instant;

/**
 * 创建时间胶囊请求 DTO
 * 对应 POST /api/v1/capsules 接口
 * 使用 Jakarta Validation 注解进行参数校验
 */
public class CreateCapsuleRequest {

    /**
     * 胶囊标题
     * 校验规则：不能为空，最多 100 字符
     */
    @NotBlank(message = "标题不能为空")
    @Size(max = 100, message = "标题最多 100 个字符")
    private String title;

    /**
     * 胶囊内容
     * 校验规则：不能为空
     */
    @NotBlank(message = "内容不能为空")
    private String content;

    /**
     * 创建者昵称
     * 校验规则：不能为空，最多 30 字符
     */
    @NotBlank(message = "发布者不能为空")
    @Size(max = 30, message = "发布者名称最多 30 个字符")
    private String creator;

    /**
     * 胶囊开启时间
     * 校验规则：不能为空（业务逻辑还会检查必须是未来时间）
     */
    @NotNull(message = "开启时间不能为空")
    private Instant openAt;

    // ==================== Getter 和 Setter 方法 ====================

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public String getCreator() { return creator; }
    public void setCreator(String creator) { this.creator = creator; }
    public Instant getOpenAt() { return openAt; }
    public void setOpenAt(Instant openAt) { this.openAt = openAt; }
}
