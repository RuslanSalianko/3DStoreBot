import { Injectable } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { UserService } from 'src/user/user.service';
import { BotContext } from './interface/bot-context.type';

@Injectable()
export class MessageService {
  constructor(
    @InjectBot()
    private readonly bot: Telegraf<BotContext>,
    private readonly userService: UserService,
  ) {}

  async admins(message: string): Promise<void> {
    const users = await this.userService.findAllByisAdmin(true);

    for (const user of users) {
      await this.bot.telegram.sendMessage(Number(user.telegramId), message);
    }
  }
}
