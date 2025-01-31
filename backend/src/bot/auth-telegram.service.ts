import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { createWriteStream } from 'fs';
import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';

@Injectable()
export class AuthTelegramService {
  private client: TelegramClient;
  private apiId: number;
  private apiHash: string;
  private session: StringSession;

  constructor(private readonly configService: ConfigService) {
    this.apiId = Number(this.configService.get<string>('TELEGRAM_APP_API_ID'));
    this.apiHash = this.configService.get<string>('TELEGRAM_APP_API_HASH');
    this.session = new StringSession('');
    this.client = new TelegramClient(this.session, this.apiId, this.apiHash, {
      connectionRetries: 5,
    });
  }

  async loginBot() {
    try {
      await this.client.start({
        botAuthToken: this.configService.get('TELEGRAM_BOT_TOKEN'),
      });
      console.log(this.client.session.save());
    } catch (error) {
      console.log('-----loginBot----');
      console.log(error);
    }
  }

  async downloadFile(chatId: number, messageId: number) {
    try {
      await this.client.connect();
      const message = await this.client.getMessages(chatId, {
        ids: messageId,
      });

      if (message[0].media) {
        const filePath = join(__dirname, 'downloaded_file');
        console.log(filePath);
        const writeStream = createWriteStream(filePath);
        const document = message[0].media['document'];

        const downloadResult = await this.client.downloadMedia(document, {
          //progressCallback: ({ downloaded, total }) => {
          //  console.log(
          //    `Download: ${((downloaded / total) * 100).toFixed(2)} %`,
          //  );
          //},
        });

        if (downloadResult instanceof Buffer) {
          writeStream.write(downloadResult);
          writeStream.end();
        } else {
          console.log('Файл не был скачан как Buffer');
        }

        writeStream.on('finish', () => {
          console.log('Файл успешно сохранен:', filePath);
        });

        writeStream.on('error', (err) => {
          console.error('Ошибка при записи файла:', err);
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
}
