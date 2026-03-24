// Package router 路由注册
package router

import (
	"github.com/alexhe/hellotime-gin/handler"
	"github.com/alexhe/hellotime-gin/middleware"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// Setup 注册所有路由
func Setup(r *gin.Engine, db *gorm.DB) {
	// CORS 中间件
	r.Use(middleware.CORS())
	r.Static("/tech-logos", "./static/tech-logos")

	capsuleHandler := &handler.CapsuleHandler{DB: db}
	adminHandler := &handler.AdminHandler{DB: db}

	v1 := r.Group("/api/v1")
	{
		// 健康检查
		v1.GET("/health", handler.Health)

		// 胶囊
		capsules := v1.Group("/capsules")
		{
			capsules.POST("", capsuleHandler.Create)
			capsules.GET("/:code", capsuleHandler.Get)
		}

		// 管理员
		admin := v1.Group("/admin")
		{
			admin.POST("/login", adminHandler.Login)

			// 需要 JWT 认证的路由
			authenticated := admin.Group("")
			authenticated.Use(middleware.JWTAuth())
			{
				authenticated.GET("/capsules", adminHandler.ListCapsules)
				authenticated.DELETE("/capsules/:code", adminHandler.DeleteCapsule)
			}
		}
	}
}
