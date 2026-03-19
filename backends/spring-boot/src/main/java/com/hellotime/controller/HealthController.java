package com.hellotime.controller;

import com.hellotime.dto.ApiResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class HealthController {

    @GetMapping("/health")
    public ApiResponse<Map<String, Object>> health() {
        return ApiResponse.ok(Map.of(
                "status", "UP",
                "timestamp", Instant.now().toString(),
                "techStack", Map.of(
                        "framework", "Spring Boot 3.2.5",
                        "language", "Java 21",
                        "database", "SQLite"
                )
        ));
    }
}
