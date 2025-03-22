FROM postgres:16-alpine

# Create directory for custom initialization scripts
RUN mkdir -p /docker-entrypoint-initdb.d

# Copy custom initialization scripts
COPY init.sql /docker-entrypoint-initdb.d/

# Create directory for data
RUN mkdir -p /var/lib/postgresql/data

# Create a script to set permissions
RUN echo '#!/bin/sh\n\
if [ -n "$UID" ] && [ -n "$GID" ]; then\n\
    chown -R $UID:$GID /var/lib/postgresql/data\n\
    chmod 700 /var/lib/postgresql/data\n\
fi\n\
exec /usr/local/bin/docker-entrypoint.sh postgres' > /usr/local/bin/custom-entrypoint.sh && \
    chmod +x /usr/local/bin/custom-entrypoint.sh

# Set the entrypoint
ENTRYPOINT ["/usr/local/bin/custom-entrypoint.sh"]

# Expose PostgreSQL port
EXPOSE 5432 