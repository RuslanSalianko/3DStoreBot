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

3. Specify volumes in docker-compose.yml:

   ```bash
   cd ..
   nano docker-compose.yml
   ```

4. Start the project:

   ```bash
   docker compose up -d
   ```

5. Go to the Telegram bot and run the **/start** command
6. The bot will then request an email (can be any email, even a non-existent one in the format mail@example.com), which will be used to log in to the web panel

## 📂 Usage

To save files from Telegram channels, use the following algorithm:

1. First, forward a post with photos and file description.
2. Then send the archive with the files for printing.

## ⚠️ Limitations

1. First post must only contain photos

## 🚀 Future Plans

- [x] Handling archives larger than 20 MB
- [ ] Processing of the first post with gif, video
- [x] Implementing multilingualism(backend) using i18next
- [ ] Implementing multilingualism(frontend) using i18next
- [ ] Saving files if a single post contains both photo and archive
- [ ] Saving files from sites like printables.com, thingiverse.com, thangs.com, etc.

📜 License
[MIT](https://github.com/RuslanSalianko/3DStoreBot/blob/master/LICENSE)
