package com.hellotime.repository;

import com.hellotime.entity.Capsule;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * 胶囊数据访问层
 * 继承 JpaRepository，自动获得 CRUD 和分页排序功能
 * Spring Data JPA 会根据方法名自动生成查询语句
 */
public interface CapsuleRepository extends JpaRepository<Capsule, Long> {

    /**
     * 根据胶囊码查询胶囊
     *
     * @param code 8 位胶囊码
     * @return Optional 包装的胶囊对象（可能为空）
     */
    Optional<Capsule> findByCode(String code);

    /**
     * 判断指定胶囊码是否存在
     *
     * @param code 8 位胶囊码
     * @return true 存在，false 不存在
     */
    boolean existsByCode(String code);

    /**
     * 分页查询所有胶囊，按创建时间倒序
     *
     * @param pageable 分页参数（页码、大小）
     * @return 胶囊分页结果
     */
    Page<Capsule> findAllByOrderByCreatedAtDesc(Pageable pageable);

    /**
     * 根据胶囊码删除胶囊
     *
     * @param code 8 位胶囊码
     */
    void deleteByCode(String code);
}
