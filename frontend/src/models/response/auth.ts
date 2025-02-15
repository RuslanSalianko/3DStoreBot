import { IUser } from '@/models/user.interface';

export interface IAuthResponse {
  accessToken: string;
  refreshToken: string;
  user: IUser;
}

export interface IErrorResponse {
  error: string;
  message: string;
  statusCode: number;
}
