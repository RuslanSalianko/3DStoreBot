import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { randomUUID } from 'crypto';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DateService } from './date.service';
import { Errors } from '../util.constants';

@Injectable()
export class FileService {
  language = this.configService.get('langApp');
  constructor(
    private readonly configService: ConfigService,
    private readonly dateService: DateService,
  ) {}

  async saveFileTelegramByBuffer(
    byffer: Buffer,
    filePath: string,
  ): Promise<string> {
    const writeStream = createWriteStream(filePath);

    writeStream.write(byffer);
    writeStream.end();

    writeStream.on('finish', () => {
      writeStream.close();
    });

    writeStream.on('error', () => {
      Logger.error('Error download file:');
    });

    return filePath;
  }

  fileDir(): string {
    const uuid = randomUUID();
    const dir = join(
      this.configService.get('uploadDir'),
      this.dateService.nowYYYDDMM(),
      uuid,
    );

    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }

    return dir;
  }
}
