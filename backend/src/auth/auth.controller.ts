import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { DateService } from 'src/util/services/date.service';
import { LocalAuthGuard } from './guard/local.guard';
import { JwtRefreshGuard } from './guard/jwt-refresh.guard';
import { UserDto } from 'src/user/dto/user.dto';
import { IUserData } from './types/user-data.interface';

@Controller('auth')
export class AuthController {
  maxAgeJwtRefreshToken: number;

  constructor(
    private readonly authService: AuthService,
    private readonly dateService: DateService,
    private readonly configService: ConfigService,
  ) {
    this.maxAgeJwtRefreshToken =
      this.dateService.parseExpirationToSeconds(
        this.configService.get('JWT_REFRESH_EXPIRATION'),
      ) * 1000;
  }

  @Post('password')
  @HttpCode(200)
  async generatePassword(@Body('email') email: string) {
    await this.authService.generatePassword(email);
  }

  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  @Post('login')
  async login(@Req() req: Request, @Res() res: Response) {
    const userDate = await this.authService.login(req.user as UserDto);
    res.cookie('refreshToken', userDate.refreshToken, {
      maxAge: this.maxAgeJwtRefreshToken,
      httpOnly: true,
    });

    return res.json(userDate);
  }

  @Post('logout')
  @HttpCode(200)
  async logout(@Req() req: Request, @Res() res: Response) {
    const { refreshToken } = req.cookies;
    await this.authService.logout(refreshToken);

    res.clearCookie('refreshToken');

    return res.json({});
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    const user = req.user as IUserData;

    res.cookie('refreshToken', user.refreshToken, {
      maxAge: this.maxAgeJwtRefreshToken,
      httpOnly: true,
    });

    return res.json(user);
  }
}
