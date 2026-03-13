package com.hellotime.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.Instant;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class CapsuleResponse {
    private String code;
    private String title;
    private String content;
    private String creator;
    private Instant openAt;
    private Instant createdAt;
    private Boolean opened;

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
    public Boolean getOpened() { return opened; }
    public void setOpened(Boolean opened) { this.opened = opened; }
}
