-- Создание таблицы заказов
CREATE TABLE t_p57800500_anime_tattoo_website.orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES t_p57800500_anime_tattoo_website.users(id),
    service_type VARCHAR(100) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    price DECIMAL(10, 2),
    payment_method VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы сообщений в заказах
CREATE TABLE t_p57800500_anime_tattoo_website.order_messages (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES t_p57800500_anime_tattoo_website.orders(id),
    sender_id INTEGER NOT NULL REFERENCES t_p57800500_anime_tattoo_website.users(id),
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для быстрого поиска
CREATE INDEX idx_orders_user_id ON t_p57800500_anime_tattoo_website.orders(user_id);
CREATE INDEX idx_orders_status ON t_p57800500_anime_tattoo_website.orders(status);
CREATE INDEX idx_order_messages_order_id ON t_p57800500_anime_tattoo_website.order_messages(order_id);

-- Комментарии к таблицам
COMMENT ON TABLE t_p57800500_anime_tattoo_website.orders IS 'Заказы клиентов';
COMMENT ON TABLE t_p57800500_anime_tattoo_website.order_messages IS 'Сообщения в рамках заказа между клиентом и мастером';

-- Комментарии к полям
COMMENT ON COLUMN t_p57800500_anime_tattoo_website.orders.status IS 'Статусы: pending (новый), discussing (обсуждение), priced (цена выставлена), paid (оплачен), completed (завершен), cancelled (отменен)';
COMMENT ON COLUMN t_p57800500_anime_tattoo_website.orders.payment_method IS 'Способ оплаты: online (онлайн), cash (наличными)';
COMMENT ON COLUMN t_p57800500_anime_tattoo_website.orders.price IS 'Цена которую выставляет мастер после обсуждения';