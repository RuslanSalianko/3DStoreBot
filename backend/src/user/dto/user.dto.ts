import { User } from '@prisma/client';
import { IUserDto } from '../types/user-dto.interface';

export class UserDto implements IUserDto {
  id: number;
  telegramId: string;
  firstName: string;
  username: string;
  email: string;
  isAdmin: boolean;
  isActive: boolean;

  constructor(user: User) {
    this.id = user.id;
    this.telegramId = String(user.telegramId);
    this.firstName = user.firstName;
    this.username = user.username;
    this.email = user.email;
    this.isAdmin = user.isAdmin;
    this.isActive = user.isActive;
  }
}
