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
import { TelegramService } from './telegram.service';
import { SettingModule } from 'src/setting/setting.module';

@Global()
@Module({
  imports: [
    TelegrafModule.forRootAsync({
      imports: [],
      useFactory: (configService: ConfigService) => ({
        token: configService.get<string>('telegram.bot.token'),
        middlewares: [session()],
        launchOptions: {
          webhook: {
            domain: configService.get<string>('telegram.bot.webhookDomain'),
            hookPath: configService.get<string>('telegram.bot.webhookPath'),
          },
        },
      }),
      inject: [ConfigService],
    }),
    UserModule,
    FileModule,
    SettingModule,
  ],
  providers: [
    BotUpdate,
    BotService,
    CreateMessageService,
    MessageService,
    TelegramService,
    ...scenes,
    ...keyboard,
  ],
  exports: [CreateMessageService],
})
export class BotModule {}
