import { Controller, Get } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';

@Controller()
export class AppController {
  constructor(private readonly i18n: I18nService) {}

  @Get()
  getHello(): string {
    return this.i18n.t('bot.welcome');
  }
}
