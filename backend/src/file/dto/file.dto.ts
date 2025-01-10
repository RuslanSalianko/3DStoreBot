import { UserDto } from 'src/user/dto/user.dto';
import { FileType } from '../file.service';
import { ImageDto } from 'src/image/dto/image.dto';
import { CategoryDto } from 'src/category/dto/category.dto';

export class FileDto {
  id: number;
  uuid: string;
  name: string;
  description: string;
  size: number;
  format: string;
  uploadedAt: Date;
  user: UserDto;
  images: ImageDto[];
  category: CategoryDto | null;

  constructor(file: FileType) {
    this.id = file.id;
    this.uuid = file.uuid;
    this.name = file.name;
    this.description = file.description;
    this.size = file.size;
    this.format = file.format;
    this.uploadedAt = file.uploadedAt;
    this.user = new UserDto(file.user);
    this.images = file.images.map((image) => new ImageDto(image));

    file.category
      ? (this.category = new CategoryDto(file.category))
      : (this.category = null);
  }
}
