import { Category } from '@prisma/client';

export class CategoryDto {
  id: number;
  name: string;

  constructor(category: Category) {
    this.id = category.id;
    this.name = category.name;
  }
}
