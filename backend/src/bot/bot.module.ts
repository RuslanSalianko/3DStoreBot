import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TelegrafModule } from 'nestjs-telegraf';
import { session } from 'telegraf';
import { BotUpdate } from './bot.update';
import { UserModule } from 'src/user/user.module';
import { scenes } from './scenes';
import { BotService } from './bot.service';
import { CreateMessageService } from './create-message.service';
import { MessageService } from './message.service';
import { FileModule } from 'src/file/file.module';
import { keyboard } from './menu/keyboard';

@Global()
@Module({
  imports: [
    TelegrafModule.forRootAsync({
      imports: [],
      useFactory: (configService: ConfigService) => ({
        token: configService.get<string>('TELEGRAM_BOT_TOKEN'),
        middlewares: [session()],
        launchOptions: {
          webhook: {
            domain: configService.get<string>('TELEGRAM_BOT_WEBHOOK_DOMAIN'),
            hookPath: configService.get<string>('TELEGRAM_BOT_WEBHOOK_PATH'),
          },
        },
      }),
      inject: [ConfigService],
    }),
    UserModule,
    FileModule,
  ],
  providers: [
    BotUpdate,
    BotService,
    CreateMessageService,
    MessageService,
    ...scenes,
    ...keyboard,
  ],
  exports: [CreateMessageService],
})
export class BotModule {}
