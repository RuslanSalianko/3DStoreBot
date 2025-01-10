import {
  Start,
  Update,
  Ctx,
  On,
  Sender,
  Message,
  Hears,
} from 'nestjs-telegraf';
import { BotContext } from './interface/bot-context.type';
import { UserService } from 'src/user/user.service';
import { ConfigService } from '@nestjs/config';
import { Language } from './language';
import { SCENE_ID, TEXT } from './constants';
import { BotService } from './bot.service';
import { Message as MessageTelegram } from 'telegraf/typings/core/types/typegram';
import { IMediaGroup } from './interface/media-group.interface';
import { KeyboardMenu } from './menu/keyboard';
import { MENU } from './constants/menu.constants';

@Update()
export class BotUpdate extends Language {
  private processedMediaGroups = new Map<string, IMediaGroup>();

  constructor(
    private readonly userService: UserService,
    private readonly botService: BotService,
    private readonly menu: KeyboardMenu,
  ) {
    super(new ConfigService());
  }

  @Start()
  async start(@Ctx() ctx: BotContext, @Sender('id') telegramId: number) {
    const countUser = await this.userService.count();

    if (countUser === 0) {
      await ctx.scene.enter(SCENE_ID.initialization);
      return;
    }
    const isRegisteredUser = await this.botService.verificationUser(telegramId);

    if (isRegisteredUser) {
      const user = await this.userService.findByTelegramId(telegramId);
      ctx.session.isAdmin = user.isAdmin;

      if (!user.email) {
        await ctx.reply(TEXT[this.language].enterEmail, this.menu.enterEmail());
      }

      await ctx.reply(TEXT[this.language].welcome);
    } else {
      await ctx.scene.enter(SCENE_ID.login);
    }
  }

  @Hears(MENU.keyboard.enterEmail.en)
  @Hears(MENU.keyboard.enterEmail.ru)
  async enterEmail(@Ctx() ctx: BotContext) {
    await ctx.scene.enter(SCENE_ID.enterEmail);
  }

  @On('message')
  async photo(
    @Ctx() ctx: BotContext,
    @Message() message: MessageTelegram.PhotoMessage,
  ) {
    if (message.photo && message.forward_origin) {
      if (message.media_group_id) {
        const largestPhoto = message.photo[message.photo.length - 1].file_id;

        if (this.processedMediaGroups.has(message.media_group_id)) {
          this.processedMediaGroups
            .get(message.media_group_id)
            .photos.push(largestPhoto);
          return;
        }

        this.processedMediaGroups.set(message.media_group_id, {
          caption: message.caption,
          photos: [largestPhoto],
        });

        // delete processed media group

        setTimeout(() => {
          ctx.scene.enter(SCENE_ID.save, {
            message: this.processedMediaGroups.get(message.media_group_id),
          });
        }, 2000);

        setTimeout(() => {
          this.processedMediaGroups.delete(message.media_group_id);
        }, 60000);
      } else {
        const largestPhoto = message.photo[message.photo.length - 1].file_id;
        await ctx.scene.enter(SCENE_ID.save, {
          message: {
            caption: message.caption,
            photos: [largestPhoto],
          },
        });
      }
    }
  }
}
