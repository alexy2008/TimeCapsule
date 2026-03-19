// Package config 应用配置
// 从环境变量读取配置，提供默认值
package config

import (
	"os"
	"strconv"
)

var (
	// DatabasePath SQLite 数据库文件路径
	DatabasePath string

	// AdminPassword 管理员登录密码
	AdminPassword string

	// JWTSecret JWT 签名密钥
	JWTSecret string

	// JWTExpirationHours JWT 过期时间（小时）
	JWTExpirationHours int

	// Port 服务端口
	Port string
)

func init() {
	Load()
}

// Load 从环境变量加载配置
func Load() {
	DatabasePath = getEnv("DATABASE_URL", "../../data/hellotime.db")
	AdminPassword = getEnv("ADMIN_PASSWORD", "timecapsule-admin")
	JWTSecret = getEnv("JWT_SECRET", "hellotime-jwt-secret-key-that-is-long-enough-for-hs256")
	Port = getEnv("PORT", "8080")

	hours, err := strconv.Atoi(getEnv("JWT_EXPIRATION_HOURS", "2"))
	if err != nil {
		hours = 2
	}
	JWTExpirationHours = hours
}

func getEnv(key, defaultVal string) string {
	if val := os.Getenv(key); val != "" {
		return val
	}
	return defaultVal
}
