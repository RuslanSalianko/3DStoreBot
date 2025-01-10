import { createWriteStream, existsSync, mkdirSync, unlink } from 'fs';
import { join } from 'path';
import { randomUUID } from 'crypto';
import * as https from 'https';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DateService } from './date.service';
import { Errors } from '../util.constants';

@Injectable()
export class FileService {
  language = this.configService.get('LANGUAGE');
  constructor(
    private readonly configService: ConfigService,
    private readonly dateService: DateService,
  ) {}

  async saveFileTelegram(fileIds: string[]): Promise<string[]> {
    const pathFiles: string[] = [];
    const dir = this.fileDir();

    for (const fileId of fileIds) {
      const response = await fetch(
        `https://api.telegram.org/bot${this.configService.get('TELEGRAM_BOT_TOKEN')}/getFile?file_id=${fileId}`,
      );

      const data = await response.json();
      if (!data.ok) {
        throw new Error(Errors[this.language].notFoundFileTelegram);
      }

      const fileUrl = `https://api.telegram.org/file/bot${this.configService.get('TELEGRAM_BOT_TOKEN')}/${data.result.file_path}`;
      const file = await this.saveFile(fileUrl, dir);

      pathFiles.push(file);
    }

    return pathFiles;
  }

  private async saveFile(url: string, dir: string): Promise<string> {
    const fileName = url.split('/').pop();
    const filePath = join(dir, fileName);
    const file = createWriteStream(filePath);

    https
      .get(url, (response) => {
        response.pipe(file);

        file.on('finish', () => {
          file.close();
        });
      })
      .on('error', (err) => {
        unlink(filePath, () => {});
        Logger.error('Error download file:', err.message);
      });
    return filePath;
  }

  private fileDir(): string {
    const uuid = randomUUID();
    const dir = join(
      this.configService.get('UPLOAD_DIR'),
      this.dateService.nowYYYDDMM(),
      uuid,
    );

    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }

    return dir;
  }
}
