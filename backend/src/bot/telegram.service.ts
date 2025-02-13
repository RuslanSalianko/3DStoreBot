import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Api, TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';
import { SettingService } from 'src/setting/setting.service';
import { FileService } from 'src/util/services/file.service';
import { join } from 'node:path';
import { TEXT, TText } from 'src/bot/constants/telegram.constants';
import { _pin } from 'telegram/client/messages';

@Injectable()
export class TelegramService implements OnModuleInit {
  private client: TelegramClient;
  private apiId: number;
  private apiHash: string;
  private text: TText;

  constructor(
    private readonly configService: ConfigService,
    private readonly settingService: SettingService,
    private readonly fileService: FileService,
  ) {}

  async onModuleInit() {
    this.apiId = Number(this.configService.get<string>('telegram.apiId'));
    this.apiHash = this.configService.get<string>('telegram.apiHash');
    this.text = TEXT[this.configService.get<string>('langApp')];

    const setting =
      (await this.settingService.findByKey('telegram-session'))?.value || '';

    const session = new StringSession(setting);

    this.client = new TelegramClient(session, this.apiId, this.apiHash, {
      connectionRetries: 5,
    });

    if (setting === '') {
      await this.loginBot();
    }
    //try {
    //  const isConnected = await this.client.connect();
    //  Logger.error(`isConnected: ${isConnected}`);
    //  Logger.error(`Authorized: {${await this.client.isUserAuthorized()}}`);
    //
    //  if (!isConnected) {
    //    Logger.warn('Telegram client restart');
    //    await this.restart();
    //  }
    //} catch (error) {
    //  Logger.error('-----onModuleInit----');
    //  Logger.error(error);
    //}
  }

  async restart(): Promise<void> {
    try {
      await this.client.destroy();
      this.client = new TelegramClient(
        new StringSession(''),
        this.apiId,
        this.apiHash,
        {
          connectionRetries: 5,
        },
      );

      await this.loginBot();
    } catch (error) {
      Logger.error('-----restart----');
      Logger.error(error);
    }
  }

  async loginBot(): Promise<void> {
    try {
      await this.client.start({
        botAuthToken: this.configService.get('TELEGRAM_BOT_TOKEN'),
      });
      const sessionString = String(this.client.session.save());

      await this.settingService.upsert({
        key: 'telegram-session',
        value: sessionString,
      });
    } catch (error) {
      Logger.error('-----loginBot----');
      Logger.error(error);
    }
  }

  async downloadFiles(
    downloadsMessage: { chatId: number; messageId: number }[],
  ): Promise<string[]> {
    try {
      const filesName: string[] = [];
      const dir = this.fileService.fileDir();

      await this.client.connect();

      for (const { chatId, messageId } of downloadsMessage) {
        const message = await this.client.getMessages(chatId, {
          ids: messageId,
        });

        if (message[0].media) {
          const downloadResult = await this.downloadMedia(message[0]);

          if (downloadResult instanceof Buffer) {
            const fileName = await this.createFileName(message[0]);
            const file = await this.fileService.saveFileTelegramByBuffer(
              downloadResult,
              join(dir, fileName),
            );
            filesName.push(file);
          }
        } else {
          Logger.error('Error download file');
        }
      }

      return filesName;
    } catch (error) {
      Logger.error('-----downloadFile----');
      Logger.error(error);

      return [];
    }
  }

  private async downloadMedia(
    message: Api.Message,
  ): Promise<string | Buffer | undefined> {
    const chat = await this.client.getEntity(message.chatId);
    const messageProgress = await this.client.sendMessage(chat, {
      message: this.text.downloadingFile,
    });

    let index = 0;

    return this.client.downloadMedia(message.media, {
      progressCallback: async (downloaded, total) => {
        const progress = Number(
          (Number(downloaded) / Number(total)) * 100,
        ).toFixed(2);
        if (index % 50 === 0) {
          await this.client.editMessage(chat, {
            message: messageProgress.id,
            text: `${this.text.downloadingFile}: ${progress}%`,
          });
        }

        if (progress === '100.00') {
          await this.client.deleteMessages(chat, [messageProgress.id], {
            revoke: true,
          });
        }
        index++;
      },
    });
  }

  private async createFileName(message: Api.Message): Promise<string> {
    const chat = await this.client.getEntity(message.chatId);

    const { media } = message;
    let fileName = '';

    switch (media.className) {
      case 'MessageMediaPhoto':
        const photo = media.photo as Api.Photo;
        fileName = `photo_${photo.id}.jpg`;
        break;
      case 'MessageMediaDocument':
        const document = media.document as Api.Document;
        const mimeType = document.mimeType;
        const isVideo = document.attributes.some(
          (attr) => attr.className === 'DocumentAttributeVideo',
        );

        fileName = isVideo
          ? `video_${document.id}.${mimeType.split('/')[1]}`
          : document.attributes[0]['fileName'];
        break;

      default:
        await this.client.sendMessage(chat, {
          message: this.text.mediaTypeNotSupported,
        });
        Logger.error(`Media type not supported: ${media.className}`);
        break;
    }

    return fileName;
  }
}
