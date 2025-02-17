import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { User } from '@prisma/client';

@Injectable()
export class CreateMessageService {
  constructor(private readonly i18n: I18nService) {}

  emojiYesOrNo(b: boolean): string {
    return b ? '✅' : '❌';
  }

  buildUserResponse(user: User): string {
    return (
      `├ 🆔: ${user.telegramId}\n` +
      `├ ${this.i18n.t('bot.name')}: ${user.firstName}\n` +
      `├ UserName: ${user.username}\n` +
      `├ ${this.i18n.t('bot.activated')}: ${this.emojiYesOrNo(user.isActive)}\n`
    );
  }

  sendPassword(password: string): string {
    return `🔑 \`${password}\`\n${this.i18n.t('bot.sendPassword')}`;
  }
}
