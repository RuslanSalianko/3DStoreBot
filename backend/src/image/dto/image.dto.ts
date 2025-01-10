import { Image } from '@prisma/client';

export class ImageDto {
  uuid: string;
  isPrimary: boolean;

  constructor(image: Image) {
    this.uuid = image.uuid;
    this.isPrimary = image.isPrimary;
  }
}
