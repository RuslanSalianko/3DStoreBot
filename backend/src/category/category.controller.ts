import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async categories() {
    return this.categoryService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() body: CreateCategoryDto) {
    return this.categoryService.create(body);
  }
}
