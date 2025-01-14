import { create } from 'zustand';

import { UserService } from '@services/user.service';
import { AuthService } from '@services/auth.service';

import { IUser } from '@models/user.interface';
import { IAuthResponse } from '@models/response/auth';

export type AuthStore = {
  user: IUser | null;
  isAuth: boolean;
  isGetPassword: boolean;
  errorMessage: string;
  getPassword: (email: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<IAuthResponse | undefined>;
  refreshAuthUser: (id: number | undefined) => Promise<void>;
};

const defaultState = {
  user: null,
  errorMessage: '',
  isAuth: false,
  isGetPassword: false,
};

export const useAuth = create<AuthStore>((set) => ({
  ...defaultState,
  getPassword: async (email: string) => {
    try {
      await AuthService.getPassword(email);

      set({ isGetPassword: true });
    } catch (error) {
      set({ ...defaultState, errorMessage: '' });
      console.log(error);
    }
  },
  login: async (email: string, password: string) => {
    try {
      const response = await AuthService.login(email, password);
      localStorage.setItem('token', response.data.accessToken);

      set({ user: response.data.user, isAuth: true });
    } catch (error) {
      set({ ...defaultState, errorMessage: 'Invalid login or password' });
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

      set({ user: response.data.user, isAuth: true });
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
}));
