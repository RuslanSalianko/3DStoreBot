import { Ctx, Scene, SceneEnter, SceneLeave, Sender } from 'nestjs-telegraf';
import { I18nService } from 'nestjs-i18n';
import { BotService } from 'src/bot/bot.service';
import { UserService } from 'src/user/user.service';
import { CreateMessageService } from 'src/bot/create-message.service';
import { MessageService } from 'src/bot/message.service';
import { SCENE_ID } from 'src/bot/constants';
import { BotContext } from 'src/bot/interface/bot-context.type';
import { User as UserTelegram } from 'telegraf/typings/core/types/typegram';
import { I18nTranslations } from 'src/language/type/i18n.generated';

@Scene(SCENE_ID.login)
export class LoginScene {
  constructor(
    private readonly botService: BotService,
    private readonly userService: UserService,
    private readonly createMessage: CreateMessageService,
    private readonly messageService: MessageService,
    private readonly i18n: I18nService<I18nTranslations>,
  ) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: BotContext, @Sender() user: UserTelegram) {
    const createUser =
      this.botService.transformTelegramUserIntoUserEntity(user);
    const newUser = await this.userService.create(createUser);
    await this.messageService.admins(
      `${this.i18n.t('bot.scenes.login.newUser')}\n ${this.createMessage.buildUserResponse(newUser)}`,
    );
    await ctx.scene.leave();
  }

  @SceneLeave()
  async onSceneLeave(@Ctx() ctx: BotContext) {
    await ctx.reply(this.i18n.t('bot.scenes.login.leave'));
  }
}
