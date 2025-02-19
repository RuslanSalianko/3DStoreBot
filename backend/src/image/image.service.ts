import { Injectable, NotFoundException } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { PrismaService } from 'src/database/prisma.service';
import { Image } from '@prisma/client';

@Injectable()
export class ImageService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly i18m: I18nService,
  ) {}

  async findByUuid(uuid: string): Promise<Image> {
    const image = this.prisma.image.findUnique({
      where: {
        uuid,
      },
    });

    if (!image) {
      throw new NotFoundException(this.i18m.t('exception.imageNotFound'));
    }

    return image;
  }
}
