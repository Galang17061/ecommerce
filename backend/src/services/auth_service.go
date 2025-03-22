package services

import (
	"errors"
	"time"

	"golang.org/x/crypto/bcrypt"
	"github.com/golang-jwt/jwt/v5"

	"ecommerce/backend/src/models"
	"ecommerce/backend/src/repositories"
)

type AuthService struct {
	userRepo    *repositories.UserRepository
	jwtSecret   []byte
	tokenExpiry time.Duration
}

func NewAuthService(userRepo *repositories.UserRepository, jwtSecret string) *AuthService {
	return &AuthService{
		userRepo:    userRepo,
		jwtSecret:   []byte(jwtSecret),
		tokenExpiry: 24 * time.Hour, // Token expires in 24 hours
	}
}

func (s *AuthService) Register(username, email, password string) (*models.User, error) {
	// Check if user already exists
	exists, err := s.userRepo.ExistsByEmail(email)
	if err != nil {
		return nil, err
	}
	if exists {
		return nil, errors.New("email already registered")
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	// Create user
	user := &models.User{
		Username: username,
		Email:    email,
		Password: string(hashedPassword),
		Role:     "user",
	}

	err = s.userRepo.Create(user)
	if err != nil {
		return nil, err
	}

	return user, nil
}

func (s *AuthService) Login(email, password string) (string, error) {
	// Get user by email
	user, err := s.userRepo.FindByEmail(email)
	if err != nil {
		return "", errors.New("invalid credentials")
	}

	// Check password
	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
	if err != nil {
		return "", errors.New("invalid credentials")
	}

	// Generate JWT token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.ID,
		"email":   user.Email,
		"role":    user.Role,
		"exp":     time.Now().Add(s.tokenExpiry).Unix(),
	})

	tokenString, err := token.SignedString(s.jwtSecret)
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

func (s *AuthService) Logout(token string) error {
	// In a real application, you might want to blacklist the token
	// For now, we'll just return nil as JWT tokens are stateless
	return nil
}

func (s *AuthService) GeneratePasswordResetToken(email string) (string, error) {
	// Check if user exists
	user, err := s.userRepo.FindByEmail(email)
	if err != nil {
		return "", errors.New("user not found")
	}

	// Generate reset token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.ID,
		"email":   user.Email,
		"purpose": "password_reset",
		"exp":     time.Now().Add(1 * time.Hour).Unix(), // Reset token expires in 1 hour
	})

	tokenString, err := token.SignedString(s.jwtSecret)
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

func (s *AuthService) ResetPassword(resetToken, newPassword string) error {
	// Validate reset token
	token, err := jwt.Parse(resetToken, func(token *jwt.Token) (interface{}, error) {
		return s.jwtSecret, nil
	})

	if err != nil || !token.Valid {
		return errors.New("invalid or expired reset token")
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return errors.New("invalid token claims")
	}

	// Check if token is for password reset
	purpose, ok := claims["purpose"].(string)
	if !ok || purpose != "password_reset" {
		return errors.New("invalid token purpose")
	}

	// Get user ID from token
	userID := uint(claims["user_id"].(float64))

	// Hash new password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(newPassword), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	// Update password in database
	err = s.userRepo.UpdatePassword(userID, string(hashedPassword))
	if err != nil {
		return err
	}

	return nil
} 