// HelloTime Gin Backend
// 时间胶囊应用后端服务
package main

import (
	"fmt"
	"log"

	"github.com/alexhe/hellotime-gin/config"
	"github.com/alexhe/hellotime-gin/database"
	"github.com/alexhe/hellotime-gin/router"
	"github.com/gin-gonic/gin"
)

func main() {
	// 初始化数据库
	database.Init()

	// 创建 Gin 引擎
	r := gin.Default()

	// 注册路由
	router.Setup(r, database.DB)

	// 启动服务
	addr := fmt.Sprintf("0.0.0.0:%s", config.Port)
	log.Printf("HelloTime Gin Backend 启动于 http://localhost:%s", config.Port)
	if err := r.Run(addr); err != nil {
		log.Fatalf("服务启动失败: %v", err)
	}
}
