import {
  Ctx,
  Hears,
  Message,
  On,
  Scene,
  SceneEnter,
  SceneLeave,
  Sender,
} from 'nestjs-telegraf';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { SCENE_ID } from 'src/bot/constants';
import { TEXT } from './text.constants';
import { Language } from 'src/bot/language';
import { BotContext } from 'src/bot/interface/bot-context.type';

@Scene(SCENE_ID.enterEmail)
export class EnterEmailScene extends Language {
  constructor(private readonly userService: UserService) {
    super(new ConfigService());
  }

  @SceneEnter()
  onSceneEnter(@Ctx() ctx: BotContext) {
    ctx.reply(TEXT[this.language].enter);
  }

  @Hears(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
  async setEmail(
    @Ctx() ctx: BotContext,
    @Sender('id') telegramId: number,
    @Message('text') email: string,
  ) {
    await this.userService.updateEmailByTelegramId(telegramId, email);
    await ctx.scene.leave();
  }

  @On('text')
  async text(@Ctx() ctx: BotContext) {
    await ctx.reply(TEXT[this.language].noEmail);
  }

  @SceneLeave()
  async onSceneLeave(@Ctx() ctx: BotContext) {
    await ctx.reply(TEXT[this.language].leave, {
      reply_markup: { remove_keyboard: true },
    });
  }
}
