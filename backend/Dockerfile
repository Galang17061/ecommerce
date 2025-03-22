# Build stage
FROM golang:1.22-alpine AS builder

WORKDIR /app

# Initialize Go module
RUN go mod init ecommerce

# Copy the source code
COPY . .

# Download all dependencies
RUN go mod tidy

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -o main .

# Final stage
FROM alpine:latest

WORKDIR /app

# Copy the binary from builder
COPY --from=builder /app/main .

# Expose port 8080
EXPOSE 8080

# Command to run the executable
CMD ["./main"] 