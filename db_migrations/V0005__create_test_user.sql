-- Создание тестового пользователя для авт тестов
-- email: test@test.com  
-- пароль: test123
-- хеш (SHA256 от "test123"): ecd71870d1963316a97e3ac3408c9835ad8cf0f3c1bc703527c30265534f75ae

INSERT INTO t_p57800500_anime_tattoo_website.users (email, password_hash, name, role)
VALUES ('test@test.com', 'ecd71870d1963316a97e3ac3408c9835ad8cf0f3c1bc703527c30265534f75ae', 'Test User', 'client');