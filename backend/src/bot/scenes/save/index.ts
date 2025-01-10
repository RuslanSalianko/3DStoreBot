import {
  Ctx,
  Message,
  On,
  Scene,
  SceneEnter,
  SceneLeave,
} from 'nestjs-telegraf';
import { ConfigService } from '@nestjs/config';
import { FileService as FileUtilsService } from 'src/util/services/file.service';
import { FileService } from 'src/file/file.service';
import { UserService } from 'src/user/user.service';
import { Language } from 'src/bot/language';
import { SCENE_ID } from '../../constants';
import { TEXT } from './text.constants';
import { BotContext } from 'src/bot/interface/bot-context.type';
import { Message as MessageTelegram } from 'telegraf/typings/core/types/typegram';
import { IMediaGroup } from 'src/bot/interface/media-group.interface';
import { CreateFileDto } from 'src/file/dto/create-file.dto';

@Scene(SCENE_ID.save)
export class SaveScene extends Language {
  constructor(
    private readonly fileUtils: FileUtilsService,
    private readonly fileService: FileService,
    private readonly userService: UserService,
  ) {
    super(new ConfigService());
  }

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: BotContext) {
    await ctx.reply(TEXT[this.language].onSceneEnter);
  }

  @On('document')
  async zip(
    @Ctx() ctx: BotContext,
    @Message() message: MessageTelegram.DocumentMessage,
  ) {
    if (message.document.file_size > 20 * 1024 * 1024) {
      await ctx.reply(TEXT[this.language].error.fileSize);
      return;
    }

    const state = ctx.scene.state as { message: IMediaGroup };
    const user = await this.userService.findByTelegramId(ctx.from.id);

    const { file_id, file_name, file_size } = message.document;

    const fileIds = state.message.photos;
    fileIds.push(file_id);

    const files = await this.fileUtils.saveFileTelegram(fileIds);
    const fileDto: CreateFileDto = {
      name: state.message.caption,
      description: '',
      path: files[files.length - 1],
      size: file_size,
      format: file_name.split('.').pop(),
    };
    const images = files.slice(0, files.length - 1);
    await this.fileService.create(fileDto, user.id, images);
    await ctx.scene.leave();
  }

  @SceneLeave()
  async leave(@Ctx() ctx: BotContext) {
    await ctx.reply('OK');
  }
}
