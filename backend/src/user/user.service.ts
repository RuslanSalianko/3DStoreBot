import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { I18nService } from 'nestjs-i18n';
import { PrismaService } from 'src/database/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly i18n: I18nService,
  ) {}

  async create(userDto: CreateUserDto): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        telegramId: userDto.telegramId,
      },
    });

    if (user) {
      throw new ConflictException(this.i18n.t('exception.userAlreadyExists'));
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
      throw new NotFoundException(this.i18n.t('exception.userNotFound'));
    }

    return user;
  }
}
