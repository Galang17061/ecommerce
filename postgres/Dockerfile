FROM postgres:16-alpine

# Create directory for custom initialization scripts
RUN mkdir -p /docker-entrypoint-initdb.d

# Copy custom initialization scripts
COPY init.sql /docker-entrypoint-initdb.d/

# Create directory for data and set permissions
RUN mkdir -p /var/lib/postgresql/data && \
    chown -R postgres:postgres /var/lib/postgresql/data && \
    chmod 700 /var/lib/postgresql/data

# Expose PostgreSQL port
EXPOSE 5432 