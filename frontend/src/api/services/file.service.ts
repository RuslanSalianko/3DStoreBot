import $api, { API_URL } from '@/api';
import { IFile } from '@models/file.interface';
import { buildUrlWithParams } from '@utils/url';

type QueryFindAll = {
  day?: string;
  page?: string;
  limit?: string;
};

export const FileService = {
  findAll: async (query: QueryFindAll): Promise<IFile[]> => {
    const url = buildUrlWithParams('/file', query);
    return (await $api.get<IFile[]>(url)).data;
  },
  downloadFile: async (uuid: string, format: string): Promise<void> => {
    try {
      const urlFile = getFileUrl(uuid);
      const response = await $api.get(urlFile, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;

      link.setAttribute('download', `${uuid}.${format}`);
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
    } catch (error) {
      console.log(error);
    }
  },
};

function getFileUrl(uuid: string): string {
  return `${API_URL}/file/${uuid}`;
}
