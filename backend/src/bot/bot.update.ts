import {
  Start,
  Update,
  Ctx,
  On,
  Sender,
  Message,
  Hears,
} from 'nestjs-telegraf';
import { I18nService } from 'nestjs-i18n';
import { BotContext } from './interface/bot-context.type';
import { UserService } from 'src/user/user.service';
import { SCENE_ID, MENU } from './constants';
import { BotService } from './bot.service';
import { Message as MessageTelegram } from 'telegraf/typings/core/types/typegram';
import { IMediaGroup } from './interface/media-group.interface';
import { KeyboardMenu } from './menu/keyboard';

@Update()
export class BotUpdate {
  private processedMediaGroups = new Map<string, IMediaGroup>();

  constructor(
    private readonly userService: UserService,
    private readonly botService: BotService,
    private readonly menu: KeyboardMenu,
    private readonly i18n: I18nService,
  ) {}

  @Start()
  async start(@Ctx() ctx: BotContext, @Sender('id') telegramId: number) {
    const countUser = await this.userService.count();

    if (countUser === 0) {
      await ctx.scene.enter(SCENE_ID.initialization);
      return;
    }
    const isRegisteredUser = await this.botService.isUserRegistered(telegramId);

    if (isRegisteredUser) {
      const user = await this.userService.findByTelegramId(telegramId);
      ctx.session.isAdmin = user.isAdmin;

      if (!user.email) {
        await ctx.reply(
          this.i18n.translate('bot.welcome'),
          this.menu.enterEmail(),
        );
      }

      await ctx.reply(this.i18n.t('bot.welcome'));
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
    @Message()
    message: MessageTelegram.PhotoMessage & MessageTelegram.VideoMessage,
  ) {
    if ((message.photo || message.video) && message.forward_origin) {
      if (message.media_group_id) {
        if (this.processedMediaGroups.has(message.media_group_id)) {
          this.processedMediaGroups.get(message.media_group_id).messages.push({
            messageId: message.message_id,
            chatId: message.chat.id,
          });
          return;
        }

        this.processedMediaGroups.set(message.media_group_id, {
          caption: message.caption,
          messages: [
            {
              messageId: message.message_id,
              chatId: message.chat.id,
            },
          ],
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
        await ctx.scene.enter(SCENE_ID.save, {
          message: {
            caption: message.caption,
            messages: [
              {
                messageId: message.message_id,
                chatId: message.chat.id,
              },
            ],
          },
        });
      }
    }
  }
}
