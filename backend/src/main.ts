import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { getBotToken } from 'nestjs-telegraf';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const bot = app.get(getBotToken());

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3000);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  app.use(
    bot.webhookCallback(configService.get<string>('TELEGRAM_BOT_WEBHOOK_PATH')),
  );
  app.use(cookieParser());
  const originUrl =
    process.env.NODE_ENV === 'production'
      ? configService.get<string>('TELEGRAM_BOT_WEBHOOK_DOMAIN')
      : 'http://localhost:5173';

  app.enableCors({
    origin: originUrl,
    credentials: true,
  });

  await app.listen(port);
  Logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
