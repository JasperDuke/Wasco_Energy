import api from './api';
import { ApiResponse } from '@/types';

export interface ServerUploadedFile {
  id: string;
  filename: string;
  originalName: string;
  path: string;
  size: number;
  mimeType: string;
  uploadedAt: string;
}

export const uploadService = {
  async uploadFile(file: File, applicationId: string): Promise<ServerUploadedFile> {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await api.post<ApiResponse<{ file: ServerUploadedFile }>>(
      `/upload/file?applicationId=${applicationId}`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return data.data!.file;
  },

  async uploadFiles(files: File[], applicationId: string): Promise<ServerUploadedFile[]> {
    if (files.length === 0) return [];
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    const { data } = await api.post<ApiResponse<{ files: ServerUploadedFile[] }>>(
      `/upload?applicationId=${applicationId}`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return data.data!.files;
  },
};
