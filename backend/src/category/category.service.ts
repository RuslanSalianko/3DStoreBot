import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { Category } from '@prisma/client';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateCategoryDto): Promise<Category> {
    return this.prisma.category.upsert({
      where: {
        name: data.name,
      },
      create: {
        name: data.name,
      },
      update: {},
    });
  }

  async findAll(): Promise<Category[]> {
    return this.prisma.category.findMany();
  }
}
