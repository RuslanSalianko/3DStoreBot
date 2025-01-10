import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userDto: CreateUserDto): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        telegramId: userDto.telegramId,
      },
    });

    if (user) {
      throw new ConflictException('User already exists');
    }

    return this.prisma.user.create({
      data: userDto,
    });
  }

  async updateEmailByTelegramId(telegramId: number, email: string) {
    return this.prisma.user.update({
      where: {
        telegramId,
      },
      data: {
        email,
      },
    });
  }

  async findByTelegramId(telegramId: number): Promise<User> {
    return this.prisma.user.findUnique({
      where: {
        telegramId,
      },
    });
  }

  async findAllByisAdmin(isAdmin: boolean): Promise<User[]> {
    return this.prisma.user.findMany({
      where: {
        isAdmin,
      },
    });
  }

  async count(): Promise<number> {
    return this.prisma.user.count();
  }

  async isUserAnAdminTelegramId(telegramId: number): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: {
        telegramId,
      },
    });

    return user.isAdmin;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
