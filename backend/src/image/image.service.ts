import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { Image } from '@prisma/client';

@Injectable()
export class ImageService {
  constructor(private readonly prisma: PrismaService) {}

  async findByUuid(uuid: string): Promise<Image> {
    const image = this.prisma.image.findUnique({
      where: {
        uuid,
      },
    });

    if (!image) {
      throw new NotFoundException('Image not found');
    }

    return image;
  }
}
