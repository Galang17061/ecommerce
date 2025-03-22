# Use Go as the base image
FROM golang:1.22-alpine

WORKDIR /app

# Expose port 8080
EXPOSE 8080

# Command to run the application
CMD ["sh", "-c", "go mod init ecommerce && go mod tidy && go run main.go"] 