import {
  Controller,
  Get,
  HttpException,
  Param,
  Query,
  Res,
  UseGuards,
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
}
