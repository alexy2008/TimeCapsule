// Package middleware JWT 认证中间件
package middleware

import (
	"net/http"
	"strings"

	"github.com/alexhe/hellotime-gin/dto"
	"github.com/alexhe/hellotime-gin/service"
	"github.com/gin-gonic/gin"
)

// JWTAuth JWT 认证中间件
// 从 Authorization: Bearer {token} 头提取并验证 JWT
func JWTAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, dto.Error("缺少认证令牌", "UNAUTHORIZED"))
			return
		}

		if !strings.HasPrefix(authHeader, "Bearer ") {
			c.AbortWithStatusJSON(http.StatusUnauthorized, dto.Error("缺少认证令牌", "UNAUTHORIZED"))
			return
		}

		token := authHeader[7:] // 去掉 "Bearer " 前缀
		if !service.ValidateToken(token) {
			c.AbortWithStatusJSON(http.StatusUnauthorized, dto.Error("认证令牌无效或已过期", "UNAUTHORIZED"))
			return
		}

		c.Next()
	}
}
