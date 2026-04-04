package com.hellotime.view;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;

public class CreateCapsuleFormData {

    @NotBlank(message = "标题不能为空")
    @Size(max = 100, message = "标题不能超过 100 个字符")
    private String title = "";

    @NotBlank(message = "内容不能为空")
    @Size(max = 5000, message = "内容不能超过 5000 个字符")
    private String content = "";

    @NotBlank(message = "发布者不能为空")
    @Size(max = 30, message = "发布者不能超过 30 个字符")
    private String creator = "";

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime openAt;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getCreator() {
        return creator;
    }

    public void setCreator(String creator) {
        this.creator = creator;
    }

    public LocalDateTime getOpenAt() {
        return openAt;
    }

    public void setOpenAt(LocalDateTime openAt) {
        this.openAt = openAt;
    }
}
