# Use Go as the base image
FROM golang:1.22-alpine

WORKDIR /app

# Install git and build dependencies
RUN apk add --no-cache git gcc musl-dev

# Copy go mod and sum files
COPY go.mod go.sum ./

# Download all dependencies
RUN go mod download

# Copy the source code
COPY . .

# Expose port 8080
EXPOSE 8080

# Command to run the application
CMD ["go", "run", "main.go"] 