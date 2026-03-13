package com.hellotime.dto;

import jakarta.validation.constraints.NotBlank;

public class AdminLoginRequest {

    @NotBlank(message = "密码不能为空")
    private String password;

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
