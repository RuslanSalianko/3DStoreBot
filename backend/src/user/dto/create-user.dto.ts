import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNumber()
  telegramId: number;

  @IsString()
  username: string;

  @IsString()
  firstName: string;

  @IsBoolean()
  isAdmin: boolean;

  @IsBoolean()
  isActive: boolean;
}
