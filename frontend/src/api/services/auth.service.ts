import { AxiosResponse } from 'axios';
import $api from '@/api';
import { IAuthResponse } from '@/models/response/auth';

export const AuthService = {
  getPassword: async (email: string): Promise<AxiosResponse<boolean>> => {
    return $api.post<boolean>('/auth/password', { email });
  },
  login: async (
    email: string,
    password: string,
  ): Promise<AxiosResponse<IAuthResponse>> => {
    return $api.post<IAuthResponse>('/auth/login', { email, password });
  },
  logout: async (): Promise<AxiosResponse<IAuthResponse>> => {
    return $api.post<IAuthResponse>('/auth/logout');
  },
  refresh: async (): Promise<AxiosResponse<IAuthResponse>> => {
    return $api.get<IAuthResponse>('/auth/refresh', {
      withCredentials: true,
    });
  },
};
