import { IsNumberString, IsOptional } from 'class-validator';

export class FileQueryDto {
  @IsOptional()
  @IsNumberString()
  day?: number;

  @IsOptional()
  @IsNumberString()
  page?: number;

  @IsOptional()
  @IsNumberString()
  limit?: number;
}
