import { Injectable } from '@nestjs/common';
import { User as TelegramUser } from 'telegraf/typings/core/types/typegram';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class BotService {
  constructor(private readonly userService: UserService) {}

  transformTelegramUserIntoUserEntity(
    user: TelegramUser,
    isAdmin = false,
  ): CreateUserDto {
    return {
      telegramId: user.id,
      firstName: user.first_name,
      username: user.username,
      isActive: isAdmin,
      isAdmin,
    };
  }
  async isUserRegistered(telegramId: number): Promise<boolean> {
    return Boolean(await this.userService.findByTelegramId(telegramId));
  }
}
