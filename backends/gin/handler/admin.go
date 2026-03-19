// Package handler 管理员处理器
package handler

import (
	"errors"
	"net/http"
	"strconv"

	"github.com/alexhe/hellotime-gin/dto"
	"github.com/alexhe/hellotime-gin/service"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// AdminHandler 管理员路由处理器
type AdminHandler struct {
	DB *gorm.DB
}

// Login POST /api/v1/admin/login
func (h *AdminHandler) Login(c *gin.Context) {
	var req dto.AdminLoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, dto.Error(err.Error(), "VALIDATION_ERROR"))
		return
	}

	token := service.Login(req.Password)
	if token == "" {
		c.JSON(http.StatusUnauthorized, dto.Error("密码错误", "UNAUTHORIZED"))
		return
	}

	c.JSON(http.StatusOK, dto.OK(dto.AdminTokenResponse{Token: token}, "登录成功"))
}

// ListCapsules GET /api/v1/admin/capsules
func (h *AdminHandler) ListCapsules(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "0"))
	size, _ := strconv.Atoi(c.DefaultQuery("size", "20"))

	if page < 0 {
		page = 0
	}
	if size < 1 {
		size = 1
	}
	if size > 100 {
		size = 100
	}

	result, err := service.ListCapsules(h.DB, page, size)
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.Error("服务器内部错误", "INTERNAL_ERROR"))
		return
	}

	c.JSON(http.StatusOK, dto.OK(result, ""))
}

// DeleteCapsule DELETE /api/v1/admin/capsules/:code
func (h *AdminHandler) DeleteCapsule(c *gin.Context) {
	code := c.Param("code")

	err := service.DeleteCapsule(h.DB, code)
	if err != nil {
		if errors.Is(err, service.ErrCapsuleNotFound) {
			c.JSON(http.StatusNotFound, dto.Error("胶囊不存在："+code, "CAPSULE_NOT_FOUND"))
			return
		}
		c.JSON(http.StatusInternalServerError, dto.Error("服务器内部错误", "INTERNAL_ERROR"))
		return
	}

	c.JSON(http.StatusOK, dto.OK(nil, "删除成功"))
}
