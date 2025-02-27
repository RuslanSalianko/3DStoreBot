import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { PrismaService } from 'src/database/prisma.service';
import { FileService as FileUtilsService } from 'src/util/services/file.service';
import { CreateFileDto } from './dto/create-file.dto';
import { FileQueryDto } from './dto/query.dto';
import { I18nTranslations } from 'src/language/type/i18n.generated';
import { UpdateFileDto } from './dto/update-file.dto';

@Injectable()
export class FileService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileUtilsService: FileUtilsService,
    private readonly i18n: I18nService<I18nTranslations>,
  ) {}
  queryRelation = {
    include: {
      images: true,
      user: true,
      category: true,
    },
  };

  async create(fileDto: CreateFileDto, userId: number, images: string[]) {
    return this.prisma.file.create({
      data: {
        ...fileDto,
        userId,
        images: {
          createMany: {
            data: [
              ...images.map((image) => ({
                path: image,
                isPrimary: image === images[0],
              })),
            ],
          },
        },
      },
    });
  }

  async delete(uuid: string) {
    try {
      const deleteFile = this.prisma.file.delete({
        where: {
          uuid,
        },
      });

      const deleteImages = this.prisma.image.deleteMany({
        where: {
          file: {
            uuid,
          },
        },
      });

      const [, deletedFile] = await this.prisma.$transaction([
        deleteImages,
        deleteFile,
      ]);

      const pathDir = deletedFile.path.split('/').slice(0, -1).join('/');
      await this.fileUtilsService.delete(pathDir);
    } catch (error) {
      Logger.error(error);
    }
  }

  async update(uuid: string, data: UpdateFileDto) {
    await this.findByUuid(uuid);

    return this.prisma.file.update({
      where: {
        uuid,
      },
      data,
      ...this.queryRelation,
    });
  }

  async findAll(query: FileQueryDto) {
    const queryBuild = {
      where: {},
      ...this.queryRelation,
    };

    queryBuild['orderBy'] = {
      uploadedAt: 'desc',
    };

    for (const [key, value] of Object.entries(query)) {
      switch (key) {
        case 'day':
          const startDate = new Date();
          startDate.setDate(startDate.getDate() - value);
          queryBuild.where['uploadedAt'] = {
            gte: startDate,
            lte: new Date(),
          };
          break;
        case 'page':
          queryBuild['skip'] = (value - 1) * (query.limit || 10);
          break;
        case 'limit':
          queryBuild['take'] = Number(value);
          break;
      }
    }

    return this.prisma.file.findMany(queryBuild);
  }

  async findById(id: number) {
    const file = await this.prisma.file.findUnique({
      where: {
        id,
      },
      ...this.queryRelation,
    });

    if (!file) {
      throw new NotFoundException(this.i18n.t('exception.fileNotFound'));
    }

    return file;
  }

  async findByUuid(uuid: string) {
    const file = await this.prisma.file.findUnique({
      where: {
        uuid,
      },
      ...this.queryRelation,
    });

    if (!file) {
      throw new NotFoundException(this.i18n.t('exception.fileNotFound'));
    }

    return file;
  }
}

export type FileType = Awaited<ReturnType<FileService['findById']>>;
