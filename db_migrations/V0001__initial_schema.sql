
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'client',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS portfolio (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url VARCHAR(500) NOT NULL,
  category VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS services (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price_from INTEGER,
  price_to INTEGER,
  duration VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  client_name VARCHAR(255) NOT NULL,
  rating INTEGER NOT NULL,
  comment TEXT,
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  service_id INTEGER REFERENCES services(id),
  booking_date TIMESTAMP NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  sender_id INTEGER REFERENCES users(id),
  receiver_id INTEGER REFERENCES users(id),
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS promo_codes (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  discount_percent INTEGER NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO portfolio (title, description, image_url, category) VALUES
('Дракон с сакурой', 'Традиционная японская татуировка с драконом и цветущей сакурой', '/img/725041ac-2268-49ad-acb4-58517d3167ef.jpg', 'Японский стиль'),
('Киберпанк персонаж', 'Современная аниме татуировка в киберпанк стиле с неоновыми акцентами', '/img/566df6a1-53df-418a-858e-1f0d8bd1aee9.jpg', 'Киберпанк'),
('Карп кои с волнами', 'Классическая японская татуировка с рыбой кои на фоне волн', '/img/ada6edb8-4fbf-48fb-b596-7f9b69b6ba11.jpg', 'Японский стиль');

INSERT INTO services (name, description, price_from, price_to, duration) VALUES
('Маленькая татуировка', 'Небольшие работы до 5см', 3000, 8000, '1-2 часа'),
('Средняя татуировка', 'Работы размером 5-15см', 8000, 20000, '2-4 часа'),
('Большая татуировка', 'Крупные работы от 15см', 20000, 50000, '4-8 часов'),
('Полный рукав', 'Полное покрытие руки', 50000, 100000, 'Несколько сеансов');

INSERT INTO reviews (client_name, rating, comment) VALUES
('Анна К.', 5, 'Потрясающая работа! Мой персонаж из аниме получился невероятно детализированным'),
('Дмитрий С.', 5, 'Профессионал своего дела. Сделал мне дракона - все в восторге!'),
('Мария В.', 5, 'Лучший тату-мастер! Рисунок держится отлично, все зажило идеально');

INSERT INTO users (email, password_hash, name, role) VALUES
('master@anime-tattoo.ru', 'hashed_password_here', 'Мастер Юки', 'master');
