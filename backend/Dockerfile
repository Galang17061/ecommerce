# Build stage
FROM golang:1.22-alpine AS builder

WORKDIR /app

# Copy the source code first
COPY . .

# Initialize Go module and download dependencies
RUN go mod init ecommerce && \
    go mod tidy

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -o main .

# Final stage
FROM alpine:latest

WORKDIR /app

# Copy the binary from builder and make it executable
COPY --from=builder /app/main .
RUN chmod +x main

# Expose port 8080
EXPOSE 8080

# Command to run the executable
CMD ["./main"] 