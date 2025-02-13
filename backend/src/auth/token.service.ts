import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/database/prisma.service';
import { IToken } from './types/token.interface';
import { UserDto } from 'src/user/dto/user.dto';
import { Token } from '@prisma/client';
import { IUserData } from './types/user-data.interface';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  generateToken(payload: UserDto): IToken {
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.accessTokenSecret'),
      expiresIn: this.configService.get<string>('jwt.accessExpiresIn'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.refreshTokenSecret'),
      expiresIn: this.configService.get<string>('jwt.refreshExpiresIn'),
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async refresh(refreshToken: string): Promise<IUserData> {
    const token = await this.findRefreshTokenByToken(refreshToken);

    if (!token) {
      throw new UnauthorizedException();
    }
    const user = new UserDto(token.user);

    const newToken = this.generateToken({ ...user });
    await this.saveRefreshToken(token.user.id, newToken.refreshToken);

    return {
      ...newToken,
      user: new UserDto(token.user),
    };
  }

  async saveRefreshToken(userId: number, refreshToken: string): Promise<Token> {
    return this.prisma.token.upsert({
      where: {
        userId,
      },
      update: {
        token: refreshToken,
      },
      create: {
        userId,
        token: refreshToken,
      },
    });
  }

  async deleteToken(refreshToken: string): Promise<void> {
    await this.prisma.token.delete({
      where: {
        token: refreshToken,
      },
    });
  }

  private async findRefreshTokenByToken(refreshToken: string) {
    return this.prisma.token.findUnique({
      where: {
        token: refreshToken,
      },
      include: {
        user: true,
      },
    });
  }

  private async findRefreshTokenByUserId(userId: number) {
    return this.prisma.token.findUnique({
      where: {
        userId,
      },
    });
  }
}
