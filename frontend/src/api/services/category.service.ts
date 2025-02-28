import $api from '@/api';
import { ICategory } from '@models/category.interface';

export const CategoryService = {
  findAll: async (): Promise<ICategory[]> => {
    try {
      const responce = await $api.get('/category');

      return responce.data;
    } catch (error) {
      console.log(error);
      return [];
    }
  },
  create: async (data: { name: string }): Promise<ICategory | undefined> => {
    try {
      const responce = await $api.post('/category', data);

      return responce.data;
    } catch (error) {
      console.log(error);
    }
  },
};
