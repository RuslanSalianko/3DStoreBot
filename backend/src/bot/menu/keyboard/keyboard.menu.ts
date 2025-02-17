import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { Markup } from 'telegraf';
import { ReplyKeyboardMarkup } from 'telegraf/typings/core/types/typegram';

@Injectable()
export class KeyboardMenu {
  constructor(private readonly i18n: I18nService) {}
  enterEmail(): Markup.Markup<ReplyKeyboardMarkup> {
    const menu = [[this.i18n.t('bot.menu.keyboard.enterEmail')]];
    return Markup.keyboard(menu).resize();
  }
}
