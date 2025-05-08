import $api, { API_URL } from '@/api';
import { IFile, IUpdateFile } from '@models/file.interface';
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
  findByUUID: async (uuid: string): Promise<IFile | undefined> => {
    try {
      const url = getFileUrl(uuid);
      const response = await $api.get(url);

      return response.data;
    } catch (error) {
      console.log(error);
    }
  },
  downloadFile: async (uuid: string, format: string): Promise<void> => {
    try {
      const urlFile = getFileUrl(uuid);
      const response = await $api.get(`${urlFile}/download`, {
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
  delete: async (uuid: string): Promise<void> => {
    try {
      const urlFile = getFileUrl(uuid);
      await $api.delete(urlFile);
    } catch (error) {
      console.log(error);
    }
  },
  update: async (
    uuid: string | undefined,
    data: IUpdateFile,
  ): Promise<IFile | undefined> => {
    try {
      if (!uuid) throw new Error('uuid not found');
      const urlFile = getFileUrl(uuid);
      const updatedFile = await $api.put<IFile>(urlFile, data);

      return updatedFile.data;
    } catch (error) {
      console.log(error);
    }
  },
};

function getFileUrl(uuid: string): string {
  return `${API_URL}/file/${uuid}`;
}
