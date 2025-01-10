import { IUserDto } from 'src/user/types/user-dto.interface';

export interface IUserData {
  accessToken: string;
  refreshToken: string;
  user: IUserDto;
}
