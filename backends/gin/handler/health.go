// Package handler 健康检查处理器
package handler

import (
	"net/http"
	"time"

	"github.com/alexhe/hellotime-gin/dto"
	"github.com/gin-gonic/gin"
)

// Health GET /api/v1/health
func Health(c *gin.Context) {
	c.JSON(http.StatusOK, dto.OK(gin.H{
		"status":    "UP",
		"timestamp": time.Now().UTC().Format(time.RFC3339),
		"techStack": gin.H{
			"framework": "Gin 1.10",
			"language":  "Go 1.24",
			"database":  "SQLite",
		},
	}, ""))
}
