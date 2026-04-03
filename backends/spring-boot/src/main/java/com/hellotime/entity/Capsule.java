package com.hellotime.entity;

import com.hellotime.config.InstantStringConverter;
import jakarta.persistence.*;
import java.time.Instant;

/**
 * 时间胶囊实体类
 * 对应数据库 capsules 表，存储用户创建的时间胶囊信息
 */
@Entity
@Table(name = "capsules")
public class Capsule {

    /**
     * 主键 ID，自增
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 8 位胶囊码，唯一标识一个胶囊（大写字母 + 数字：A-Z0-9）
     */
    @Column(nullable = false, unique = true, length = 8)
    private String code;

    /**
     * 胶囊标题，最多 100 字符
     */
    @Column(nullable = false, length = 100)
    private String title;

    /**
     * 胶囊内容，TEXT 类型存储长文本
     * 注意：API 返回时，未到开启时间的胶囊不返回此字段
     */
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    /**
     * 创建者昵称，最多 30 字符
     */
    @Column(nullable = false, length = 30)
    private String creator;

    /**
     * 胶囊开启时间（UTC 时间戳）
     * 只有到达此时间后，用户才能查看胶囊内容
     */
    @Convert(converter = InstantStringConverter.class)
    @Column(name = "open_at", nullable = false, columnDefinition = "TEXT")
    private Instant openAt;

    /**
     * 胶囊创建时间（UTC 时间戳）
     */
    @Convert(converter = InstantStringConverter.class)
    @Column(name = "created_at", nullable = false, columnDefinition = "TEXT")
    private Instant createdAt;

    /**
     * 持久化前的回调方法，自动设置创建时间
     */
    @PrePersist
    protected void onCreate() {
        this.createdAt = Instant.now();
    }

    // ==================== Getter 和 Setter 方法 ====================

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getCreator() { return creator; }
    public void setCreator(String creator) { this.creator = creator; }

    public Instant getOpenAt() { return openAt; }
    public void setOpenAt(Instant openAt) { this.openAt = openAt; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
