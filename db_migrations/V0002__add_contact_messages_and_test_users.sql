-- Add contact_messages table for form submissions
CREATE TABLE IF NOT EXISTS t_p57800500_anime_tattoo_website.contact_messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Update users table: add actual password hashes for test users
UPDATE t_p57800500_anime_tattoo_website.users 
SET password_hash = '9af15b336e6a9619928537df30b2e6a2376569fcf9d7e773eccede65606529a0' 
WHERE email = 'master@anime-tattoo.ru';

-- Insert test client user
INSERT INTO t_p57800500_anime_tattoo_website.users (email, password_hash, name, role)
VALUES ('client@test.com', '9af15b336e6a9619928537df30b2e6a2376569fcf9d7e773eccede65606529a0', 'Анна Клиент', 'client')
ON CONFLICT (email) DO NOTHING;
