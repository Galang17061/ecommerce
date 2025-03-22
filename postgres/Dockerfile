FROM postgres:16-alpine

# Copy custom initialization scripts if needed
COPY ./init.sql /docker-entrypoint-initdb.d/

# Set environment variables
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=postgres
ENV POSTGRES_DB=ecommerce

# Expose PostgreSQL port
EXPOSE 5432 