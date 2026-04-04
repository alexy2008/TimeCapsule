package com.hellotime.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
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

/**
 * 胶囊控制器测试类
 * 使用 Java 21 Record 创建测试数据
 */
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class CapsuleControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void health_shouldReturn200() throws Exception {
        mockMvc.perform(get("/api/v1/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("UP"))
                .andExpect(jsonPath("$.data.techStack.framework").value("Spring Boot 3.2.5"))
                .andExpect(jsonPath("$.data.techStack.language").value("Java 21"))
                .andExpect(jsonPath("$.data.techStack.database").value("SQLite"));
    }

    @Test
    void createCapsule_shouldReturn201() throws Exception {
        CreateCapsuleRequest request = new CreateCapsuleRequest(
                "测试胶囊",
                "这是内容",
                "测试者",
                Instant.now().plus(1, ChronoUnit.DAYS)
        );

        mockMvc.perform(post("/api/v1/capsules")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.code").isString())
                .andExpect(jsonPath("$.data.title").value("测试胶囊"));
    }

    @Test
    void createCapsule_withMissingFields_shouldReturn400() throws Exception {
        mockMvc.perform(post("/api/v1/capsules")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.errorCode").value("VALIDATION_ERROR"));
    }

    @Test
    void getCapsule_notFound_shouldReturn404() throws Exception {
        mockMvc.perform(get("/api/v1/capsules/NONEXIST"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.errorCode").value("CAPSULE_NOT_FOUND"));
    }

    @Test
    void getCapsule_notOpened_shouldHideContent() throws Exception {
        CreateCapsuleRequest request = new CreateCapsuleRequest(
                "未来胶囊",
                "秘密内容",
                "测试者",
                Instant.now().plus(365, ChronoUnit.DAYS)
        );

        String responseBody = mockMvc.perform(post("/api/v1/capsules")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andReturn().getResponse().getContentAsString();

        String code = objectMapper.readTree(responseBody).path("data").path("code").asText();

        mockMvc.perform(get("/api/v1/capsules/" + code))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.opened").value(false))
                .andExpect(jsonPath("$.data.content").doesNotExist());
    }
}
