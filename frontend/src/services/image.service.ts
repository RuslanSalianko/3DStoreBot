import { API_URL } from '../http';

export const ImageService = {
  getImageUrl: (uuid: string): string => `${API_URL}/image/${uuid}`,
};
