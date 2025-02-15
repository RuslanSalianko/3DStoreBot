import { AxiosError } from 'axios';
import { create } from 'zustand';

import { UserService } from '@services/user.service';
import { AuthService } from '@services/auth.service';

import { IUser } from '@models/user.interface';
import { IAuthResponse, IErrorResponse } from '@models/response/auth';

export type AuthStore = {
  user: IUser | null;
  isAuthenticated: boolean;
  isGetPassword: boolean;
  errorMessage: string;
  getPassword: (email: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<IAuthResponse | undefined>;
  refreshAuthUser: (id: number | undefined) => Promise<void>;
  clearErrorMessage: () => void;
};

const defaultState = {
  user: null,
  errorMessage: '',
  isAuthenticated: false,
  isGetPassword: false,
};

export const useAuth = create<AuthStore>((set) => ({
  ...defaultState,
  getPassword: async (email: string) => {
    try {
      await AuthService.getPassword(email);

      set({ isGetPassword: true });
    } catch (error) {
      const e = error as AxiosError<IErrorResponse>;
      set({ ...defaultState, errorMessage: e.response?.data.message });
    }
  },
  login: async (email: string, password: string) => {
    try {
      const response = await AuthService.login(email, password);
      localStorage.setItem('token', response.data.accessToken);

      set({ user: response.data.user, isAuthenticated: true });
    } catch (error) {
      set({
        ...defaultState,
        isGetPassword: true,
        errorMessage: 'Invalid login or password',
      });
      console.log(error);
    }
  },
  logout: async () => {
    localStorage.removeItem('token');

    try {
      await AuthService.logout();

      set({ ...defaultState });
    } catch (error) {
      set({ ...defaultState, errorMessage: '' });
      console.log(error);
    }
  },
  checkAuth: async () => {
    try {
      const response = await AuthService.refresh();

      set({ user: response.data.user, isAuthenticated: true });
      localStorage.setItem('token', response.data.accessToken);
      return response.data;
    } catch (error) {
      set({ ...defaultState, errorMessage: '' });
      console.log(error);
    }
  },
  refreshAuthUser: async (id: number | undefined) => {
    try {
      if (!id) throw new Error('User id is required');

      const response = await UserService.user(id);
      set({ user: response.data });
      set({ user: response.data, errorMessage: '' });
    } catch (error) {
      set({ ...defaultState, errorMessage: '' });
      console.log(error);
    }
  },
  clearErrorMessage: () => set({ errorMessage: '' }),
}));
