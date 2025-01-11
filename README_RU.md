# 3DStoreBot

## 📅 Описание

Данный проект является решением для управления и хранения файлов для 3D-печати, которые можно сохранять с помощью Telegram-бота.

## 🔧 Технологии

- **Backend**: NestJS
- **Frontend**: React + Vite
- **ORM**: Prisma
- **Database**: SQLite
- **Containerization**: Docker, Docker Compose

## 📦 Установка

1. Клонируйте репозиторий:

   ```bash
   git clone https://github.com/RuslanSalianko/3DStoreBot
   cd 3DStoreBot

   ```

2. Переменуйте файл настроек backend .env.example в .env и заполните:

   ```bash
   cd backend
   mv .env.example .env
   ```

   ```env
   PORT=5000
   LANG_APP=ru или en
   DATABASE_URL="file:../db/sqlite.db"

   TELEGRAM_BOT_TOKEN=token
   TELEGRAM_BOT_WEBHOOK_DOMAIN=htpps://example.com
   TELEGRAM_BOT_WEBHOOK_PATH=path

   UPLOAD_DIR='./public/files'

   JWT_ACCESS_SECRET=jwt-secret-key
   JWT_REFRESH_SECRET=jwt-refresh-secret-key
   JWT_ACCESS_EXPIRATION=1d
   JWT_REFRESH_EXPIRATION=30d
   ```

   TELEGRAM_BOT_WEBHOOK_DOMAIN, JWT_ACCESS_SECRET, JWT_REFRESH_SECRET можно сгерировать с помощью команды

   ```bash
   openssl rand -base64 32
   ```

3. Переменуйте файл настроек frontend .env.production.example в .env.production и заполните:

   ```bash
   cd ../frontend
   mv .env.production.example .env.production
   ```

   ```env
   VITE_API_URL=https://example.com/api
   ```

4. Пропешите volumes в docker-compose.yml:

   ```bash
   cd ..
   nano docker-compose.yml
   ```

5. Запустите проект:

   ```bash
   docker compose up -d
   ```

6. Перейдите в telegram бот и запустите команду /start
7. После чего бот запросит электроную почту(можно любую даже несуществующую в формате mail@example.com), она будет использоваться для входа в web панель

## 📂 Использование

Для сохранения файлов из Telegram-каналов используется следующий алгоритм:

1. Сначала пересылается пост с фотографиями и описанием файла.
2. Затем пересылается архив с файлами для печати.

## ⚠️ Ограничения

1. Архив не более 20 МБ
2. Первый пост только фотаграфии

## 🚀 Планы

- [ ] Обработка ахивов более 20 МБ
- [ ] Обработка первого поста с gif, video
- [ ] Внедрение мультиязычности с помощью i18next
- [ ] Сохранение файлов если единичный пост содержит фото и архив
- [ ] Сохранение фалов с сайтов printables.com, thingiverse.com, thangs.com и др

📜 Лицензия
[MIT](https://github.com/RuslanSalianko/3DStoreBot/blob/master/LICENSE)
