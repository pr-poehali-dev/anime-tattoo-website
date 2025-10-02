-- Обновление пароля для тестового пользователя master@anime-tattoo.ru  
-- Пароль: master123
-- Правильный хеш (SHA256): e3afed0047b08059d0fada10f400c1e5903e9d8d50d56e2f0e12efec2d5f3e9d

UPDATE t_p57800500_anime_tattoo_website.users 
SET password_hash = 'e3afed0047b08059d0fada10f400c1e5903e9d8d50d56e2f0e12efec2d5f3e9d' 
WHERE email = 'master@anime-tattoo.ru';