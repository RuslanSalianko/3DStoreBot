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
import { I18nService } from 'nestjs-i18n';
import { UserService } from 'src/user/user.service';
import { SCENE_ID } from 'src/bot/constants';
import { BotContext } from 'src/bot/interface/bot-context.type';

@Scene(SCENE_ID.enterEmail)
export class EnterEmailScene {
  constructor(
    private readonly userService: UserService,
    private readonly i18n: I18nService,
  ) {}

  @SceneEnter()
  onSceneEnter(@Ctx() ctx: BotContext) {
    ctx.reply(this.i18n.t('scenes.enterEmail.enter'));
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
    await ctx.reply(this.i18n.t('scenes.enterEmail.noEmail'));
  }

  @SceneLeave()
  async onSceneLeave(@Ctx() ctx: BotContext) {
    await ctx.reply(this.i18n.t('scenes.enterEmail.leave'), {
      reply_markup: { remove_keyboard: true },
    });
  }
}
