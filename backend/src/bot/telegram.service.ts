import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Api, TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';
import { SettingService } from 'src/setting/setting.service';
import { FileService } from 'src/util/services/file.service';
import { join } from 'node:path';

@Injectable()
export class TelegramService implements OnModuleInit {
  private client: TelegramClient;

  constructor(
    private readonly configService: ConfigService,
    private readonly settingService: SettingService,
    private readonly fileService: FileService,
  ) {}

  async onModuleInit() {
    const apiId = Number(this.configService.get<string>('TELEGRAM_APP_API_ID'));
    const apiHash = this.configService.get<string>('TELEGRAM_APP_API_HASH');

    const setting =
      (await this.settingService.findByKey('telegram-session'))?.value || '';
    const session = new StringSession(setting);

    this.client = new TelegramClient(session, apiId, apiHash, {
      connectionRetries: 5,
    });
  }

  async loginBot() {
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
  ) {
    try {
      const filesName: string[] = [];
      const dir = this.fileService.fileDir();

      for (const { chatId, messageId } of downloadsMessage) {
        await this.client.connect();
        const message = await this.client.getMessages(chatId, {
          ids: messageId,
        });

        if (message[0].media) {
          const { media } = message[0];
          const downloadResult = await this.client.downloadMedia(
            message[0].media,
            {
              progressCallback: (downloaded, total) => {
                //console.log(
                //  `Progress: ${Number((Number(downloaded) / Number(total)) * 100).toFixed(2)}%`,
                //);
              },
            },
          );

          if (downloadResult instanceof Buffer) {
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
                Logger.warn('Media type not supported');
                break;
            }

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
    }
  }
}
