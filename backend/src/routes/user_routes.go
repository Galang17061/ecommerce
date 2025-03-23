package routes

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"ecommerce/backend/src/repositories"
)

func SetupUserRoutes(router *gin.Engine, userRepo *repositories.UserRepository) {
	router.GET("/user", func(c *gin.Context) {
		users, err := userRepo.List(10, 0) // Get first 10 users
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"users": users})
	})
} 