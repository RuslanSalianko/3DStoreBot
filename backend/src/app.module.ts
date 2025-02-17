import { join } from 'path';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nModule,
} from 'nestjs-i18n';
import { DatabaseModule } from './database/database.module';
import { BotModule } from './bot/bot.module';
import { UserModule } from './user/user.module';
import { FileModule } from './file/file.module';
import { CategoryModule } from './category/category.module';
import { UtilModule } from './util/util.module';
import { AuthModule } from './auth/auth.module';
import { ImageModule } from './image/image.module';
import { SettingModule } from './setting/setting.module';
import configuration from './config/configuration';

@Module({
  imports: [
    I18nModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        fallbackLanguage: configService.get<string>('langApp'),
        loaderOptions: {
          path: join(__dirname, '/i18n/'),
          watch: true,
        },
      }),
      resolvers: [new HeaderResolver(['x-lang']), AcceptLanguageResolver],
      inject: [ConfigService],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, 'static'),
      exclude: ['/api*'],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    DatabaseModule,
    BotModule,
    UserModule,
    FileModule,
    CategoryModule,
    UtilModule,
    AuthModule,
    ImageModule,
    SettingModule,
  ],
})
export class AppModule {}
