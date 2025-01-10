import { Ctx, Scene, SceneEnter, SceneLeave, Sender } from 'nestjs-telegraf';
import { UserService } from 'src/user/user.service';
import { BotService } from '../../bot.service';
import { ConfigService } from '@nestjs/config';
import { Language } from 'src/bot/language';
import { SCENE_ID } from 'src/bot/constants';
import { TEXT } from './text.constants';
import { User } from 'telegraf/typings/core/types/typegram';
import { BotContext } from 'src/bot/interface/bot-context.type';
import { KeyboardMenu } from 'src/bot/menu/keyboard';

@Scene(SCENE_ID.initialization)
export class InitializationScene extends Language {
  constructor(
    private readonly userService: UserService,
    private readonly botService: BotService,
    private readonly menu: KeyboardMenu,
  ) {
    super(new ConfigService());
  }

  @SceneEnter()
  async onSceneEnter(
    @Ctx() ctx: BotContext,
    @Sender() user: User,
  ): Promise<void> {
    const newUser = this.botService.transformUserTelegramInUserEntity(
      user,
      true,
    );
    await this.userService.create(newUser);

    await ctx.scene.leave();
  }

  @SceneLeave()
  onSceneLeave(@Ctx() ctx: BotContext) {
    ctx.reply(TEXT[this.language].leave, this.menu.enterEmail());
  }
}
