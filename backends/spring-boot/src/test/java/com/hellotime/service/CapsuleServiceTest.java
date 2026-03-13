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

@SpringBootTest
@Transactional
class CapsuleServiceTest {

    @Autowired
    private CapsuleService capsuleService;

    @Autowired
    private CapsuleRepository capsuleRepository;

    @Test
    void createCapsule_shouldReturnCodeAndTitle() {
        CreateCapsuleRequest request = new CreateCapsuleRequest();
        request.setTitle("测试胶囊");
        request.setContent("这是内容");
        request.setCreator("测试者");
        request.setOpenAt(Instant.now().plus(1, ChronoUnit.DAYS));

        CapsuleResponse response = capsuleService.createCapsule(request);

        assertNotNull(response.getCode());
        assertEquals(8, response.getCode().length());
        assertEquals("测试胶囊", response.getTitle());
        assertEquals("测试者", response.getCreator());
        assertNotNull(response.getCreatedAt());
    }

    @Test
    void createCapsule_withPastOpenAt_shouldThrow() {
        CreateCapsuleRequest request = new CreateCapsuleRequest();
        request.setTitle("测试");
        request.setContent("内容");
        request.setCreator("测试者");
        request.setOpenAt(Instant.now().minus(1, ChronoUnit.DAYS));

        assertThrows(IllegalArgumentException.class, () -> capsuleService.createCapsule(request));
    }

    @Test
    void getCapsule_notOpened_shouldHideContent() {
        CreateCapsuleRequest request = new CreateCapsuleRequest();
        request.setTitle("未来胶囊");
        request.setContent("秘密内容");
        request.setCreator("测试者");
        request.setOpenAt(Instant.now().plus(365, ChronoUnit.DAYS));

        CapsuleResponse created = capsuleService.createCapsule(request);
        CapsuleResponse fetched = capsuleService.getCapsule(created.getCode());

        assertEquals("未来胶囊", fetched.getTitle());
        assertNull(fetched.getContent());
        assertFalse(fetched.getOpened());
    }

    @Test
    void getCapsule_nonExistent_shouldThrow() {
        assertThrows(CapsuleNotFoundException.class, () -> capsuleService.getCapsule("NONEXIST"));
    }

    @Test
    void deleteCapsule_shouldRemoveFromDb() {
        CreateCapsuleRequest request = new CreateCapsuleRequest();
        request.setTitle("待删除");
        request.setContent("内容");
        request.setCreator("测试者");
        request.setOpenAt(Instant.now().plus(1, ChronoUnit.DAYS));

        CapsuleResponse created = capsuleService.createCapsule(request);
        capsuleService.deleteCapsule(created.getCode());

        assertThrows(CapsuleNotFoundException.class, () -> capsuleService.getCapsule(created.getCode()));
    }

    @Test
    void deleteCapsule_nonExistent_shouldThrow() {
        assertThrows(CapsuleNotFoundException.class, () -> capsuleService.deleteCapsule("NONEXIST"));
    }
}
