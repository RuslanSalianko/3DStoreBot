import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Language } from './language';
import { TEXT } from './constants';
import { User } from '@prisma/client';

@Injectable()
export class CreateMessageService extends Language {
  constructor() {
    super(new ConfigService());
  }

  emojiYesOrNo(b: boolean): string {
    return b ? '✅' : '❌';
  }

  buildUserResponse(user: User): string {
    switch (this.language) {
      case 'en':
        return (
          `├ ID: ${user.telegramId}\n` +
          `├ Name: ${user.firstName}\n` +
          `├ UserName: ${user.username}\n` +
          `├ Activated: ${this.emojiYesOrNo(user.isActive)}\n`
        );
      case 'ru':
        return (
          `├ 🆔: ${user.telegramId}\n` +
          `├ Имя: ${user.firstName}\n` +
          `├ UserName: ${user.username}\n` +
          `├ Активирован: ${this.emojiYesOrNo(user.isActive)}\n`
        );
    }
  }

  sendPassword(password: string): string {
    return `🔑 \`${password}\`\n${TEXT[this.language].sendPassword}`;
  }
}
