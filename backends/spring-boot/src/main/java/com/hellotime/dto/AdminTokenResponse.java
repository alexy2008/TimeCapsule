package com.hellotime.dto;

public class AdminTokenResponse {
    private String token;

    public AdminTokenResponse(String token) {
        this.token = token;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
}
