# 3DStoreBot

[RU](./README_RU.md)

## 📅 Description

This project is a solution for managing and storing 3D printing files that can be saved using a Telegram bot.

## 🔧 Technologies

- **Backend**: NestJS
- **Frontend**: React + Vite
- **ORM**: Prisma
- **Database**: SQLite
- **Containerization**: Docker, Docker Compose

## 📦 Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/RuslanSalianko/3DStoreBot
   cd 3DStoreBot
   ```

2. Rename the backend .env.example file to .env and fill it out:

   ```bash
   cd backend
   mv .env.example .env
   ```

   ```env
   PORT=5000
   LANG_APP=en
   DATABASE_URL="file:../db/sqlite.db"

   TELEGRAM_BOT_TOKEN=token
   TELEGRAM_BOT_WEBHOOK_DOMAIN=https://example.com
   TELEGRAM_BOT_WEBHOOK_PATH=path

   UPLOAD_DIR='./public/files'

   JWT_ACCESS_SECRET=jwt-secret-key
   JWT_REFRESH_SECRET=jwt-refresh-secret-key
   JWT_ACCESS_EXPIRATION=1d
   JWT_REFRESH_EXPIRATION=30d
   ```

   TELEGRAM_BOT_WEBHOOK_DOMAIN, JWT_ACCESS_SECRET, JWT_REFRESH_SECRET can be generated using the command:

   ```bash
   openssl rand -base64 32
   ```

3. Rename the frontend .env.production.example file to .env.production and fill it out:

   ```bash
   cd ../frontend
   mv .env.production.example .env.production
   ```

   ```env
   VITE_API_URL=https://example.com/api
   ```

4. Specify volumes in docker-compose.yml:

   ```bash
   cd ..
   nano docker-compose.yml
   ```

5. Start the project:

   ```bash
   docker compose up -d
   ```

6. Go to the Telegram bot and run the **/start** command
7. The bot will then request an email (can be any email, even a non-existent one in the format mail@example.com), which will be used to log in to the web panel

## 📂 Usage

To save files from Telegram channels, use the following algorithm:

1. First, forward a post with photos and file description.
2. Then send the archive with the files for printing.

## ⚠️ Limitations

1. Archive no larger than 20 MB
2. First post must only contain photos

## 🚀 Future Plans

- [ ] Handling archives larger than 20 MB
- [ ] Processing of the first post with gif, video
- [ ] Implementing multilingualism using i18next
- [ ] Saving files if a single post contains both photo and archive
- [ ] Saving files from sites like printables.com, thingiverse.com, thangs.com, etc.

📜 License
[MIT](https://github.com/RuslanSalianko/3DStoreBot/blob/master/LICENSE)

