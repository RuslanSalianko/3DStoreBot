import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MENU } from 'src/bot/constants/menu.constants';
import { Language } from 'src/bot/language';
import { Markup } from 'telegraf';
import { ReplyKeyboardMarkup } from 'telegraf/typings/core/types/typegram';

@Injectable()
export class KeyboardMenu extends Language {
  constructor() {
    super(new ConfigService());
  }
  enterEmail(): Markup.Markup<ReplyKeyboardMarkup> {
    const menu = [[MENU.keyboard.enterEmail[this.language]]];
    return Markup.keyboard(menu).resize();
  }
}
