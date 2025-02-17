import { Ctx, Message, On, Scene, SceneEnter } from 'nestjs-telegraf';
import { I18nService } from 'nestjs-i18n';
import { FileService } from 'src/file/file.service';
import { UserService } from 'src/user/user.service';
import { SCENE_ID } from '../../constants';
import { BotContext } from 'src/bot/interface/bot-context.type';
import { Message as MessageTelegram } from 'telegraf/typings/core/types/typegram';
import { IMediaGroup } from 'src/bot/interface/media-group.interface';
import { CreateFileDto } from 'src/file/dto/create-file.dto';
import { TelegramService } from 'src/bot/telegram.service';

@Scene(SCENE_ID.save)
export class SaveScene {
  constructor(
    private readonly fileService: FileService,
    private readonly userService: UserService,
    private readonly telegramService: TelegramService,
    private readonly i18n: I18nService,
  ) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: BotContext) {
    await ctx.reply(this.i18n.t('scenes.save.enter'));
  }

  @On('document')
  async zip(
    @Ctx() ctx: BotContext,
    @Message() message: MessageTelegram.DocumentMessage,
  ) {
    const state = ctx.scene.state as { message: IMediaGroup };
    const user = await this.userService.findByTelegramId(ctx.from.id);

    const { file_name, file_size } = message.document;

    const downloadMessages = state.message.messages;

    downloadMessages.push({
      messageId: message.message_id,
      chatId: message.chat.id,
    });

    this.telegramService.downloadFiles(downloadMessages).then((files) => {
      const fileDto: CreateFileDto = {
        name: state.message.caption || file_name,
        description: '',
        path: files[files.length - 1],
        size: file_size,
        format: file_name.split('.').pop(),
      };

      const images = files.slice(0, files.length - 1);

      this.fileService.create(fileDto, user.id, images).then(() => {
        ctx.reply(this.i18n.t('scenes.save.success'));
      });
    });

    await ctx.scene.leave();
  }
}
