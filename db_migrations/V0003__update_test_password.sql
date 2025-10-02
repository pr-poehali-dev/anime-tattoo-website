-- Обновление пароля для тестового пользователя master@anime-tattoo.ru
-- Пароль: master123
-- Хеш (SHA256): 9c9064c59f1ffa2e174ee754d2979be80dd30db552ec03e7e327e9b1a4bd594e

UPDATE t_p57800500_anime_tattoo_website.users 
SET password_hash = '9c9064c59f1ffa2e174ee754d2979be80dd30db552ec03e7e327e9b1a4bd594e' 
WHERE email = 'master@anime-tattoo.ru';