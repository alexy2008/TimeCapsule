package com.hellotime.service;

import com.hellotime.dto.CapsuleResponse;
import com.hellotime.dto.CreateCapsuleRequest;
import com.hellotime.exception.CapsuleNotFoundException;
import com.hellotime.repository.CapsuleRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

import static org.junit.jupiter.api.Assertions.*;

/**
 * 胶囊服务测试类
 * 使用 Java 21 Record 创建测试数据
 */
@SpringBootTest
@Transactional
class CapsuleServiceTest {

    @Autowired
    private CapsuleService capsuleService;

    @Autowired
    private CapsuleRepository capsuleRepository;

    @Test
    void createCapsule_shouldReturnCodeAndTitle() {
        CreateCapsuleRequest request = new CreateCapsuleRequest(
                "测试胶囊",
                "这是内容",
                "测试者",
                Instant.now().plus(1, ChronoUnit.DAYS)
        );

        CapsuleResponse response = capsuleService.createCapsule(request);

        assertNotNull(response.code());
        assertEquals(8, response.code().length());
        assertEquals("测试胶囊", response.title());
        assertEquals("测试者", response.creator());
        assertNotNull(response.createdAt());
    }

    @Test
    void createCapsule_withPastOpenAt_shouldThrow() {
        CreateCapsuleRequest request = new CreateCapsuleRequest(
                "测试",
                "内容",
                "测试者",
                Instant.now().minus(1, ChronoUnit.DAYS)
        );

        assertThrows(IllegalArgumentException.class, () -> capsuleService.createCapsule(request));
    }

    @Test
    void getCapsule_notOpened_shouldHideContent() {
        CreateCapsuleRequest request = new CreateCapsuleRequest(
                "未来胶囊",
                "秘密内容",
                "测试者",
                Instant.now().plus(365, ChronoUnit.DAYS)
        );

        CapsuleResponse created = capsuleService.createCapsule(request);
        CapsuleResponse fetched = capsuleService.getCapsule(created.code());

        assertEquals("未来胶囊", fetched.title());
        assertNull(fetched.content());
        assertFalse(fetched.opened());
    }

    @Test
    void getCapsule_nonExistent_shouldThrow() {
        assertThrows(CapsuleNotFoundException.class, () -> capsuleService.getCapsule("NONEXIST"));
    }

    @Test
    void deleteCapsule_shouldRemoveFromDb() {
        CreateCapsuleRequest request = new CreateCapsuleRequest(
                "待删除",
                "内容",
                "测试者",
                Instant.now().plus(1, ChronoUnit.DAYS)
        );

        CapsuleResponse created = capsuleService.createCapsule(request);
        capsuleService.deleteCapsule(created.code());

        assertThrows(CapsuleNotFoundException.class, () -> capsuleService.getCapsule(created.code()));
    }

    @Test
    void deleteCapsule_nonExistent_shouldThrow() {
        assertThrows(CapsuleNotFoundException.class, () -> capsuleService.deleteCapsule("NONEXIST"));
    }
}