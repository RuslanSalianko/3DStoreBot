import {
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Query,
  Res,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { FileService } from './file.service';
import { FileQueryDto } from './dto/query.dto';
import { FileDto } from './dto/file.dto';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Query() query: FileQueryDto) {
    const files = await this.fileService.findAll(query);
    return files.map((file) => new FileDto(file));
  }

  @UseGuards(JwtAuthGuard)
  @Get(':uuid')
  async file(@Param('uuid') uuid: string) {
    const file = await this.fileService.findByUuid(uuid);

    return new FileDto(file);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':uuid/download')
  getFile(@Param('uuid') uuid: string, @Res() res: Response) {
    const file = this.fileService.findByUuid(uuid);

    file
      .then(({ path }) => {
        return res.sendFile(join(process.cwd(), path));
      })
      .catch((error) => {
        console.log(error);
        const e = error as HttpException;
        res.status(e.getStatus()).send(e.message);
      });
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':uuid')
  async delete(@Param('uuid') uuid: string) {
    try {
      await this.fileService.delete(uuid);
    } catch (error) {
      Logger.log(error);
    }
  }
}
