import { Ctx, Scene, SceneEnter, SceneLeave, Sender } from 'nestjs-telegraf';
import { ConfigService } from '@nestjs/config';
import { BotService } from 'src/bot/bot.service';
import { UserService } from 'src/user/user.service';
import { CreateMessageService } from 'src/bot/create-message.service';
import { MessageService } from 'src/bot/message.service';
import { Language } from 'src/bot/language';
import { SCENE_ID } from 'src/bot/constants';
import { TEXT } from './text.constants';
import { BotContext } from 'src/bot/interface/bot-context.type';
import { User as UserTelegram } from 'telegraf/typings/core/types/typegram';

@Scene(SCENE_ID.login)
export class LoginScene extends Language {
  constructor(
    private readonly botService: BotService,
    private readonly userService: UserService,
    private readonly createMessage: CreateMessageService,
    private readonly messageService: MessageService,
  ) {
    super(new ConfigService());
  }

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: BotContext, @Sender() user: UserTelegram) {
    const createUser = this.botService.transformUserTelegramInUserEntity(user);
    const newUser = await this.userService.create(createUser);
    await this.messageService.admins(
      `${TEXT[this.language].newUser}\n ${this.createMessage.buildUserResponse(newUser)}`,
    );
    await ctx.scene.leave();
  }

  @SceneLeave()
  async onSceneLeave(@Ctx() ctx: BotContext) {
    await ctx.reply(TEXT[this.language].leave);
  }
}
