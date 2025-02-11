import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateFileDto } from './dto/create-file.dto';
import { File } from '@prisma/client';
import { FileQueryDto } from './dto/query.dto';

@Injectable()
export class FileService {
  constructor(private readonly prisma: PrismaService) {}
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
      throw new NotFoundException('File not found');
    }

    return file;
  }

  async findByUuid(uuid: string): Promise<File> {
    const file = await this.prisma.file.findUnique({
      where: {
        uuid,
      },
    });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    return file;
  }
}

export type FileType = Awaited<ReturnType<FileService['findById']>>;
