export default () => ({
  langApp: process.env.LANG_APP || 'en',
  databaseUrl: process.env.DATABASE_URL || 'file:../db/sqlite.db',
  telegram: {
    bot: {
      token: process.env.TELEGRAM_BOT_TOKEN,
      webhookDomain: process.env.TELEGRAM_BOT_WEBHOOK_DOMAIN,
      webhookPath: process.env.TELEGRAM_BOT_WEBHOOK_PATH,
    },
    apiId: parseInt(process.env.TELEGRAM_APP_API_ID),
    apiHash: process.env.TELEGRAM_APP_API_HASH,
  },
  uploadDir: process.env.UPLOAD_DIR || './public/files',
  jwt: {
    accessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET,
    refreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET,
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '1d',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '20d',
  },
});
