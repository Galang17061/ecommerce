package main

import (
	"ecommerce/middleware"
	"ecommerce/models"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type Response struct {
	Message string `json:"message"`
}

type LoginRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type LoginResponse struct {
	Token string `json:"token"`
	User  struct {
		ID       uint         `json:"id"`
		Username string       `json:"username"`
		Role     models.Role  `json:"role"`
	} `json:"user"`
}

var db *gorm.DB

func init() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Fatal("Error loading .env file")
	}

	// Connect to database
	dsn := "host=" + os.Getenv("DB_HOST") + 
		" user=" + os.Getenv("DB_USER") + 
		" password=" + os.Getenv("DB_PASSWORD") + 
		" dbname=" + os.Getenv("DB_NAME") + 
		" port=" + os.Getenv("DB_PORT") + 
		" sslmode=disable"

	var err error
	db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// Auto migrate the schema
	db.AutoMigrate(&models.User{})

	// Create default admin user if not exists
	var adminUser models.User
	if err := db.Where("username = ?", "admin").First(&adminUser).Error; err != nil {
		adminUser = models.User{
			Username: "admin",
			Password: "admin123", // In production, use hashed passwords
			Role:     models.RoleAdmin,
		}
		db.Create(&adminUser)
	}
}

func main() {
	r := gin.Default()

	// Public routes
	r.POST("/api/login", handleLogin)
	r.GET("/api/health", handleHealth)

	// Protected routes
	authorized := r.Group("/api")
	authorized.Use(middleware.AuthMiddleware())
	{
		authorized.GET("/user/profile", handleUserProfile)
		authorized.GET("/admin/dashboard", middleware.RequireAdmin(), handleAdminDashboard)
	}

	log.Println("Server starting on :8080")
	if err := r.Run(":8080"); err != nil {
		log.Fatal(err)
	}
}

func handleLogin(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	var user models.User
	if err := db.Where("username = ?", req.Username).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	// In production, use proper password hashing
	if user.Password != req.Password {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	// Create JWT token
	claims := &middleware.Claims{
		UserID:   user.ID,
		Username: user.Username,
		Role:     user.Role,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: time.Now().Add(24 * time.Hour).Unix(),
			IssuedAt:  time.Now().Unix(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString([]byte(os.Getenv("JWT_SECRET")))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error creating token"})
		return
	}

	response := LoginResponse{
		Token: tokenString,
	}
	response.User.ID = user.ID
	response.User.Username = user.Username
	response.User.Role = user.Role

	c.JSON(http.StatusOK, response)
}

func handleHealth(c *gin.Context) {
	c.JSON(http.StatusOK, Response{
		Message: "Backend is healthy!",
	})
}

func handleUserProfile(c *gin.Context) {
	claims := c.MustGet("user").(*middleware.Claims)
	c.JSON(http.StatusOK, gin.H{
		"id":       claims.UserID,
		"username": claims.Username,
		"role":     claims.Role,
	})
}

func handleAdminDashboard(c *gin.Context) {
	c.JSON(http.StatusOK, Response{
		Message: "Welcome to Admin Dashboard!",
	})
} 