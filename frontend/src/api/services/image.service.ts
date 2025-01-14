import { API_URL } from '@/api';

export const ImageService = {
  getImageUrl: (uuid: string): string => `${API_URL}/image/${uuid}`,
};
