// Package service 胶囊业务逻辑
// 封装创建、查询、列表、删除等核心操作
package service

import (
	"crypto/rand"
	"errors"
	"fmt"
	"math"
	"math/big"
	"strings"
	"time"

	"github.com/alexhe/hellotime-gin/dto"
	"github.com/alexhe/hellotime-gin/model"
	"gorm.io/gorm"
)

const (
	codeChars  = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	codeLength = 8
	maxRetries = 10
)

var (
	ErrCapsuleNotFound = errors.New("胶囊不存在")
	ErrInvalidOpenAt   = errors.New("开启时间必须在未来")
	ErrCodeGeneration  = errors.New("无法生成唯一的胶囊码")
)

// generateCode 生成 8 位仅含大写字母和数字的随机码
func generateCode() (string, error) {
	var sb strings.Builder
	max := big.NewInt(int64(len(codeChars)))
	for i := 0; i < codeLength; i++ {
		n, err := rand.Int(rand.Reader, max)
		if err != nil {
			return "", err
		}
		sb.WriteByte(codeChars[n.Int64()])
	}
	return sb.String(), nil
}

// generateUniqueCode 生成唯一的胶囊码，最多重试 maxRetries 次
func generateUniqueCode(db *gorm.DB) (string, error) {
	for i := 0; i < maxRetries; i++ {
		code, err := generateCode()
		if err != nil {
			return "", err
		}
		var count int64
		db.Model(&model.Capsule{}).Where("code = ?", code).Count(&count)
		if count == 0 {
			return code, nil
		}
	}
	return "", ErrCodeGeneration
}

// formatTimeISO 格式化时间为 ISO 8601 字符串
func formatTimeISO(t time.Time) string {
	return t.UTC().Format("2006-01-02T15:04:05Z")
}

func parseStoredTime(value string) (time.Time, error) {
	normalized := strings.TrimSpace(strings.ReplaceAll(value, " ", "T"))
	if !strings.HasSuffix(normalized, "Z") && !strings.Contains(normalized[10:], "+") && !strings.Contains(normalized[10:], "-") {
		normalized += "Z"
	}
	return time.Parse(time.RFC3339Nano, normalized)
}

// toResponse 将 Capsule 实体转换为响应 DTO
func toResponse(capsule *model.Capsule, includeContent bool) dto.CapsuleResponse {
	now := time.Now().UTC()
	openAt, err := parseStoredTime(capsule.OpenAt)
	if err != nil {
		openAt = now
	}
	createdAt, err := parseStoredTime(capsule.CreatedAt)
	if err != nil {
		createdAt = now
	}
	openAt = openAt.UTC()
	createdAt = createdAt.UTC()
	opened := now.After(openAt)

	openAtStr := formatTimeISO(openAt)
	createdAtStr := formatTimeISO(createdAt)

	resp := dto.CapsuleResponse{
		Code:      capsule.Code,
		Title:     capsule.Title,
		Creator:   capsule.Creator,
		OpenAt:    openAtStr,
		CreatedAt: &createdAtStr,
		Opened:    &opened,
	}

	if includeContent {
		resp.Content = &capsule.Content
	} else if opened {
		resp.Content = &capsule.Content
	}
	// 未到时间且不强制包含 content 时，Content 为 nil

	return resp
}

// CreateCapsule 创建时间胶囊
func CreateCapsule(db *gorm.DB, req dto.CreateCapsuleRequest) (*dto.CapsuleResponse, error) {
	openAt, err := time.Parse(time.RFC3339, req.OpenAt)
	if err != nil {
		return nil, fmt.Errorf("openAt 格式错误，请使用 ISO 8601 格式: %w", err)
	}

	now := time.Now().UTC()
	if !openAt.After(now) {
		return nil, ErrInvalidOpenAt
	}

	code, err := generateUniqueCode(db)
	if err != nil {
		return nil, err
	}

	capsule := model.Capsule{
		Code:      code,
		Title:     req.Title,
		Content:   req.Content,
		Creator:   req.Creator,
		OpenAt:    formatTimeISO(openAt.UTC()),
		CreatedAt: formatTimeISO(now),
	}

	if err := db.Create(&capsule).Error; err != nil {
		return nil, err
	}

	resp := toResponse(&capsule, false)
	// 创建响应不含 opened 和 content
	resp.Opened = nil
	resp.Content = nil
	return &resp, nil
}

// GetCapsule 查询胶囊详情
func GetCapsule(db *gorm.DB, code string) (*dto.CapsuleResponse, error) {
	var capsule model.Capsule
	if err := db.Where("code = ?", code).First(&capsule).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrCapsuleNotFound
		}
		return nil, err
	}

	resp := toResponse(&capsule, false)
	return &resp, nil
}

// ListCapsules 分页查询胶囊列表（管理员用）
func ListCapsules(db *gorm.DB, page, size int) (*dto.PageResponse, error) {
	var total int64
	db.Model(&model.Capsule{}).Count(&total)

	totalPages := int(math.Max(1, math.Ceil(float64(total)/float64(size))))

	var capsules []model.Capsule
	db.Order("created_at DESC").Offset(page * size).Limit(size).Find(&capsules)

	content := make([]dto.CapsuleResponse, len(capsules))
	for i, c := range capsules {
		content[i] = toResponse(&c, true)
	}

	return &dto.PageResponse{
		Content:       content,
		TotalElements: total,
		TotalPages:    totalPages,
		Number:        page,
		Size:          size,
	}, nil
}

// DeleteCapsule 删除胶囊
func DeleteCapsule(db *gorm.DB, code string) error {
	result := db.Where("code = ?", code).Delete(&model.Capsule{})
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return ErrCapsuleNotFound
	}
	return nil
}
