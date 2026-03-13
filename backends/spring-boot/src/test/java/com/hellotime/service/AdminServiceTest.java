package com.hellotime.service;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class AdminServiceTest {

    @Autowired
    private AdminService adminService;

    @Test
    void login_withCorrectPassword_shouldReturnToken() {
        String token = adminService.login("test-password");
        assertNotNull(token);
        assertTrue(token.length() > 0);
    }

    @Test
    void login_withWrongPassword_shouldReturnNull() {
        String token = adminService.login("wrong-password");
        assertNull(token);
    }

    @Test
    void validateToken_withValidToken_shouldReturnTrue() {
        String token = adminService.login("test-password");
        assertTrue(adminService.validateToken(token));
    }

    @Test
    void validateToken_withInvalidToken_shouldReturnFalse() {
        assertFalse(adminService.validateToken("invalid-token"));
    }
}
