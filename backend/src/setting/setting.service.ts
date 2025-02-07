import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { SettingDto } from './dto/setting.dto';

@Injectable()
export class SettingService {
  constructor(private readonly prisma: PrismaService) {}

  async upsert(settingDto: SettingDto) {
    return this.prisma.setting.upsert({
      where: {
        key: settingDto.key,
      },
      update: {
        value: settingDto.value,
      },
      create: {
        key: settingDto.key,
        value: settingDto.value,
      },
    });
  }

  async findByKey(key: string) {
    return this.prisma.setting.findUnique({
      where: {
        key,
      },
    });
  }
}
