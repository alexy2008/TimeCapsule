package com.hellotime.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hellotime.dto.AdminLoginRequest;
import com.hellotime.dto.CreateCapsuleRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class AdminControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private String loginAndGetToken() throws Exception {
        AdminLoginRequest loginRequest = new AdminLoginRequest();
        loginRequest.setPassword("test-password");

        String response = mockMvc.perform(post("/api/v1/admin/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andReturn().getResponse().getContentAsString();

        return objectMapper.readTree(response).path("data").path("token").asText();
    }

    @Test
    void login_withCorrectPassword_shouldReturnToken() throws Exception {
        AdminLoginRequest request = new AdminLoginRequest();
        request.setPassword("test-password");

        mockMvc.perform(post("/api/v1/admin/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.token").isString());
    }

    @Test
    void login_withWrongPassword_shouldReturn401() throws Exception {
        AdminLoginRequest request = new AdminLoginRequest();
        request.setPassword("wrong");

        mockMvc.perform(post("/api/v1/admin/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void listCapsules_withoutToken_shouldReturn401() throws Exception {
        mockMvc.perform(get("/api/v1/admin/capsules"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void listCapsules_withToken_shouldReturn200() throws Exception {
        String token = loginAndGetToken();

        mockMvc.perform(get("/api/v1/admin/capsules")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.content").isArray());
    }

    @Test
    void deleteCapsule_withToken_shouldWork() throws Exception {
        String token = loginAndGetToken();

        // Create a capsule first
        CreateCapsuleRequest capsuleReq = new CreateCapsuleRequest();
        capsuleReq.setTitle("待删除");
        capsuleReq.setContent("内容");
        capsuleReq.setCreator("测试者");
        capsuleReq.setOpenAt(Instant.now().plus(1, ChronoUnit.DAYS));

        String createResponse = mockMvc.perform(post("/api/v1/capsules")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(capsuleReq)))
                .andReturn().getResponse().getContentAsString();

        String code = objectMapper.readTree(createResponse).path("data").path("code").asText();

        mockMvc.perform(delete("/api/v1/admin/capsules/" + code)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        // Verify it's gone
        mockMvc.perform(get("/api/v1/capsules/" + code))
                .andExpect(status().isNotFound());
    }
}
