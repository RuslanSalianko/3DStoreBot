import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export class Language {
  language: 'en' | 'ru';

  constructor(private readonly configService: ConfigService) {
    const language = this.configService.get<string>('LANG_APP');

    switch (language) {
      case 'en':
        this.language = 'en';
        break;
      case 'ru':
        this.language = 'ru';
        break;
      default:
        Logger.error(`LANGUAGE not set or incorrect in env file`);
        this.language = 'en';
    }
  }
}
