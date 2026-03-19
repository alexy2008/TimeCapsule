// Package database 数据库配置
// GORM + SQLite 连接管理和自动迁移
package database

import (
	"log"

	"github.com/alexhe/hellotime-gin/config"
	"github.com/alexhe/hellotime-gin/model"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

// DB 全局数据库实例
var DB *gorm.DB

// Init 初始化数据库连接并自动迁移
func Init() {
	InitWithPath(config.DatabasePath)
}

// InitWithPath 使用指定路径初始化数据库（方便测试使用内存数据库）
func InitWithPath(dbPath string) {
	var err error
	DB, err = gorm.Open(sqlite.Open(dbPath), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Warn),
	})
	if err != nil {
		log.Fatalf("数据库连接失败: %v", err)
	}

	// 自动迁移
	if err := DB.AutoMigrate(&model.Capsule{}); err != nil {
		log.Fatalf("数据库迁移失败: %v", err)
	}
}
