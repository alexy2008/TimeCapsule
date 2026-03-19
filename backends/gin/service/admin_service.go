// Package service 管理员认证服务
// JWT 令牌的生成与验证
package service

import (
	"time"

	"github.com/alexhe/hellotime-gin/config"
	"github.com/golang-jwt/jwt/v5"
)

// Login 管理员登录
// 密码正确返回 JWT token，否则返回空字符串
func Login(password string) string {
	if password != config.AdminPassword {
		return ""
	}

	now := time.Now().UTC()
	claims := jwt.MapClaims{
		"sub": "admin",
		"iat": now.Unix(),
		"exp": now.Add(time.Duration(config.JWTExpirationHours) * time.Hour).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString([]byte(config.JWTSecret))
	if err != nil {
		return ""
	}
	return tokenString
}

// ValidateToken 验证 JWT 令牌
func ValidateToken(tokenString string) bool {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, jwt.ErrSignatureInvalid
		}
		return []byte(config.JWTSecret), nil
	})
	if err != nil {
		return false
	}
	return token.Valid
}
