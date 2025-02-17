import { Ctx, Scene, SceneEnter, SceneLeave, Sender } from 'nestjs-telegraf';
import { I18nService } from 'nestjs-i18n';
import { UserService } from 'src/user/user.service';
import { BotService } from '../../bot.service';
import { SCENE_ID } from 'src/bot/constants';
import { User } from 'telegraf/typings/core/types/typegram';
import { BotContext } from 'src/bot/interface/bot-context.type';
import { KeyboardMenu } from 'src/bot/menu/keyboard';

@Scene(SCENE_ID.initialization)
export class InitializationScene {
  constructor(
    private readonly userService: UserService,
    private readonly botService: BotService,
    private readonly i18n: I18nService,
    private readonly menu: KeyboardMenu,
  ) {}

  @SceneEnter()
  async onSceneEnter(
    @Ctx() ctx: BotContext,
    @Sender() user: User,
  ): Promise<void> {
    const newUser = this.botService.transformTelegramUserIntoUserEntity(
      user,
      true,
    );
    await this.userService.create(newUser);

    await ctx.scene.leave();
  }

  @SceneLeave()
  onSceneLeave(@Ctx() ctx: BotContext) {
    ctx.reply(this.i18n.t('scenes.initization.leave'), this.menu.enterEmail());
  }
}
