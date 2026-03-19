// Package handler 胶囊处理器
package handler

import (
	"errors"
	"net/http"

	"github.com/alexhe/hellotime-gin/dto"
	"github.com/alexhe/hellotime-gin/service"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// CapsuleHandler 胶囊路由处理器
type CapsuleHandler struct {
	DB *gorm.DB
}

// Create POST /api/v1/capsules
func (h *CapsuleHandler) Create(c *gin.Context) {
	var req dto.CreateCapsuleRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, dto.Error(err.Error(), "VALIDATION_ERROR"))
		return
	}

	capsule, err := service.CreateCapsule(h.DB, req)
	if err != nil {
		if errors.Is(err, service.ErrInvalidOpenAt) {
			c.JSON(http.StatusBadRequest, dto.Error(err.Error(), "BAD_REQUEST"))
			return
		}
		c.JSON(http.StatusInternalServerError, dto.Error("服务器内部错误", "INTERNAL_ERROR"))
		return
	}

	c.JSON(http.StatusCreated, dto.OK(capsule, "胶囊创建成功"))
}

// Get GET /api/v1/capsules/:code
func (h *CapsuleHandler) Get(c *gin.Context) {
	code := c.Param("code")

	capsule, err := service.GetCapsule(h.DB, code)
	if err != nil {
		if errors.Is(err, service.ErrCapsuleNotFound) {
			c.JSON(http.StatusNotFound, dto.Error("胶囊不存在："+code, "CAPSULE_NOT_FOUND"))
			return
		}
		c.JSON(http.StatusInternalServerError, dto.Error("服务器内部错误", "INTERNAL_ERROR"))
		return
	}

	c.JSON(http.StatusOK, dto.OK(capsule, ""))
}
