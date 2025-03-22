-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on username for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Insert sample users
INSERT INTO users (username, email, password, role) VALUES
    ('admin', 'admin@example.com', 'admin123', 'admin'),
    ('john_doe', 'john@example.com', 'password123', 'user'),
    ('jane_smith', 'jane@example.com', 'password123', 'user'),
    ('bob_wilson', 'bob@example.com', 'password123', 'user'),
    ('alice_brown', 'alice@example.com', 'password123', 'user'),
    ('charlie_davis', 'charlie@example.com', 'password123', 'user'),
    ('emma_wilson', 'emma@example.com', 'password123', 'user'),
    ('david_miller', 'david@example.com', 'password123', 'user'),
    ('sophia_lee', 'sophia@example.com', 'password123', 'user'),
    ('michael_taylor', 'michael@example.com', 'password123', 'user')
ON CONFLICT (username) DO NOTHING; 