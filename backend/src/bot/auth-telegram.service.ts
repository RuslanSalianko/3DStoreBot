import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import bigInt from 'big-integer';
import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';
import { Api } from 'telegram/tl';

@Injectable()
export class AuthTelegramService {
  private client: TelegramClient;
  private apiId: number;
  private apiHash: string;
  private session: StringSession;
  private phoneCodeHash: string;

  constructor(private readonly configService: ConfigService) {
    this.apiId = this.configService.get('apiId');
    this.apiHash = this.configService.get('apiHash');
    this.session = new StringSession(''); // Пустая сессия
    this.client = new TelegramClient(this.session, this.apiId, this.apiHash, {
      connectionRetries: 5,
    });
  }
  async sendCode(phoneNumber: string) {
    await this.client.connect();

    try {
      const result = await this.client.invoke(
        new Api.auth.SendCode({
          phoneNumber,
          apiId: this.client.apiId,
          apiHash: this.client.apiHash,
          settings: new Api.CodeSettings({
            allowFlashcall: false,
            currentNumber: false,
            allowAppHash: true,
          }),
        }),
      );

      if ('phoneCodeHash' in result) {
        this.phoneCodeHash = result.phoneCodeHash;
      } else {
        throw new InternalServerErrorException(
          'Не удалось получить phoneCodeHash',
        );
      }

      return {
        message: 'Код отправлен на телефон',
        phoneCodeHash: this.phoneCodeHash,
      };
    } catch (error) {
      console.error('Ошибка при отправке кода:', error);
      throw new InternalServerErrorException('Не удалось отправить код');
    }
  }

  async login(phoneNumber: string, code: string, password?: string) {
    try {
      const result = await this.client.invoke(
        new Api.auth.SignIn({
          phoneNumber,
          phoneCode: code,
          phoneCodeHash: this.phoneCodeHash,
        }),
      );

      if (result.className === 'auth.AuthorizationSignUpRequired') {
        throw new BadRequestException(
          'Требуется регистрация нового пользователя',
        );
      }

      if (password) {
        await this.client.invoke(
          new Api.auth.CheckPassword({
            password: new Api.InputCheckPasswordSRP({
              srpId: bigInt(0),
              A: Buffer.from(password),
              M1: Buffer.from(''),
            }),
          }),
        );
      }

      return {
        message: 'Авторизация успешна!',
        session: this.client.session.save(),
      };
    } catch (error) {
      if (error.errorMessage === 'PHONE_CODE_EXPIRED') {
        throw new BadRequestException(
          'Код подтверждения истёк. Запросите новый код.',
        );
      }
      console.error('Ошибка при авторизации:', error);
      throw new InternalServerErrorException('Авторизация не удалась');
    }
  }
}
