import { AxiosResponse } from 'axios';
import $api from '@/api';
import { IUser } from '@models/user.interface';

export const UserService = {
  user: async (id: number): Promise<AxiosResponse<IUser>> =>
    await $api.get<IUser>(`/user/${id}`),
};
