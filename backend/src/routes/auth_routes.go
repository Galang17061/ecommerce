package routes

import (
	"github.com/gin-gonic/gin"

	"ecommerce/backend/src/controllers"
)

// SetupAuthRoutes configures all the authentication routes
func SetupAuthRoutes(router *gin.Engine, authController *controllers.AuthController) {
	auth := router.Group("/api/auth")
	{
		auth.POST("/register", authController.Register)
		auth.POST("/login", authController.Login)
		auth.POST("/logout", authController.Logout)
		auth.POST("/forgot-password", authController.ForgotPassword)
		auth.POST("/reset-password", authController.ResetPassword)
		auth.GET("/verify", authController.VerifyToken)
	}
} 