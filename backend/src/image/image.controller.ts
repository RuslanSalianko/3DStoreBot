import {
  Controller,
  Get,
  HttpException,
  Param,
  Res,
  UseGuards,
} from '@nestjs/common';
import { join } from 'path';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { ImageService } from './image.service';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  //@UseGuards(JwtAuthGuard)
  @Get(':uuid')
  async findByUuid(@Param('uuid') uuid: string, @Res() res: Response) {
    const image = this.imageService.findByUuid(uuid);

    image
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
