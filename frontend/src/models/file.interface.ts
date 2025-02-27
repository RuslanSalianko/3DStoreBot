import { ICategory } from './category.interface';
import { IImage } from './image.interface';
import { IUser } from './user.interface';

export interface IFile {
  id: number;
  uuid: string;
  name: string;
  description: string;
  size: number;
  format: string;
  uploadedAt: string;
  user: IUser;
  images: IImage[];
  category: null | ICategory;
}

export interface IUpdateFile {
  name: string;
  description?: string;
  categoryId?: number;
}
