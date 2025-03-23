package services

import (
	"errors"
	"strings"
	"sync"
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
	blacklist   map[string]time.Time
	mutex       sync.RWMutex
}

func NewAuthService(userRepo *repositories.UserRepository, jwtSecret string) *AuthService {
	return &AuthService{
		userRepo:    userRepo,
		jwtSecret:   []byte(jwtSecret),
		tokenExpiry: 24 * time.Hour, // Token expires in 24 hours
		blacklist:   make(map[string]time.Time),
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

func (s *AuthService) Logout(tokenString string) error {
	// Remove "Bearer " prefix if present
	tokenString = strings.TrimPrefix(tokenString, "Bearer ")

	// Parse the token to verify it's valid and get the expiration time
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return s.jwtSecret, nil
	})

	if err != nil {
		return errors.New("invalid token")
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return errors.New("invalid token claims")
	}

	// Get token expiration time
	exp, ok := claims["exp"].(float64)
	if !ok {
		return errors.New("invalid token expiration")
	}

	// Add token to blacklist
	s.mutex.Lock()
	s.blacklist[tokenString] = time.Unix(int64(exp), 0)
	s.mutex.Unlock()

	// Start cleanup goroutine
	go s.cleanupBlacklist()

	return nil
}

func (s *AuthService) cleanupBlacklist() {
	s.mutex.Lock()
	defer s.mutex.Unlock()

	now := time.Now()
	for token, expiry := range s.blacklist {
		if now.After(expiry) {
			delete(s.blacklist, token)
		}
	}
}

func (s *AuthService) isTokenBlacklisted(tokenString string) bool {
	s.mutex.RLock()
	defer s.mutex.RUnlock()

	_, blacklisted := s.blacklist[tokenString]
	return blacklisted
}

func (s *AuthService) VerifyToken(tokenString string) (bool, error) {
	// Remove "Bearer " prefix if present
	tokenString = strings.TrimPrefix(tokenString, "Bearer ")

	// Check if token is blacklisted
	if s.isTokenBlacklisted(tokenString) {
		return false, errors.New("token has been revoked")
	}

	// Parse and validate the token
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("invalid signing method")
		}
		return s.jwtSecret, nil
	})

	if err != nil {
		return false, err
	}

	if !token.Valid {
		return false, errors.New("invalid token")
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return false, errors.New("invalid token claims")
	}

	// Check if token is expired
	exp, ok := claims["exp"].(float64)
	if !ok {
		return false, errors.New("invalid token expiration")
	}

	if float64(time.Now().Unix()) > exp {
		return false, errors.New("token has expired")
	}

	// Check if user still exists
	userID := uint(claims["user_id"].(float64))
	exists, err := s.userRepo.ExistsById(userID)
	if err != nil {
		return false, err
	}
	if !exists {
		return false, errors.New("user not found")
	}

	return true, nil
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