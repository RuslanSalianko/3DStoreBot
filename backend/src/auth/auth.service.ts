import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { I18nService } from 'nestjs-i18n';
import { PrismaService } from 'src/database/prisma.service';
import { UserService } from 'src/user/user.service';
import { CreateMessageService } from 'src/bot/create-message.service';
import { TokenService } from './token.service';
import { BotContext } from 'src/bot/interface/bot-context.type';
import { Password, User } from '@prisma/client';
import { UserDto } from 'src/user/dto/user.dto';
import { I18nTranslations } from 'src/language/type/i18n.generated';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    @InjectBot()
    private readonly bot: Telegraf<BotContext>,
    private readonly createMessage: CreateMessageService,
    private readonly tokenService: TokenService,
    private readonly i18n: I18nService<I18nTranslations>,
  ) {}

  async generatePassword(email: string): Promise<Password> {
    const user = await this.userService.findByEmail(email);

    const newPassword = Math.random().toFixed(36).slice(-4);

    this.bot.telegram.sendMessage(
      Number(user.telegramId),
      this.createMessage.sendPassword(newPassword),
      { parse_mode: 'Markdown' },
    );

    return this.prisma.password.upsert({
      where: {
        userId: user.id,
      },
      update: {
        password: newPassword,
      },
      create: {
        userId: user.id,
        password: newPassword,
      },
    });
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findByEmail(email);
    const curroffDate = new Date();
    curroffDate.setHours(curroffDate.getHours() - 1);

    const userPassword = await this.prisma.password.findUnique({
      where: {
        userId: user.id,
        updatedAt: {
          gte: curroffDate,
        },
      },
    });

    if (userPassword.password !== password) {
      throw new UnauthorizedException(this.i18n.t('exception.invalidPassword'));
    }

    if (!user.isActive) {
      throw new UnauthorizedException(this.i18n.t('exception.useNotActivate'));
    }

    return user;
  }

  async login(user: UserDto) {
    const token = this.tokenService.generateToken({ ...user });
    await this.tokenService.saveRefreshToken(user.id, token.refreshToken);

    return {
      ...token,
      user,
    };
  }

  async logout(refreshToken: string): Promise<void> {
    await this.tokenService.deleteToken(refreshToken);
  }
}
