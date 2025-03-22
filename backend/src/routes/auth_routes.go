package routes

import (
	"github.com/gin-gonic/gin"

	"ecommerce/src/controllers"
)

func SetupAuthRoutes(router *gin.Engine, authController *controllers.AuthController) {
	auth := router.Group("/api/auth")
	{
		auth.POST("/register", authController.Register)
		auth.POST("/login", authController.Login)
		auth.POST("/logout", authController.Logout)
		auth.POST("/forgot-password", authController.ForgotPassword)
		auth.POST("/reset-password", authController.ResetPassword)
	}
} 