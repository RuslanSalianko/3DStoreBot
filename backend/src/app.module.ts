import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { BotModule } from './bot/bot.module';
import { UserModule } from './user/user.module';
import { FileModule } from './file/file.module';
import { CategoryModule } from './category/category.module';
import { UtilModule } from './util/util.module';
import { AuthModule } from './auth/auth.module';
import { ImageModule } from './image/image.module';
import { join } from 'path';
import { SettingModule } from './setting/setting.module';
import configuration from './config/configuration';

@Module({
  imports: [
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
