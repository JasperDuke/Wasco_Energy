import api from './api';
import {
  ApiResponse,
  Application,
  HumanValidationAction,
  UploadedFile,
} from '@/types';
import { uploadService, ServerUploadedFile } from './uploadService';

async function uploadDocumentFiles(
  documents: Record<string, UploadedFile[]>,
  applicationId: string
): Promise<Record<string, ServerUploadedFile[]>> {
  const result: Record<string, ServerUploadedFile[]> = {};

  for (const [key, files] of Object.entries(documents)) {
    const localFiles = files
      .map((f) => f.file)
      .filter((f): f is File => f instanceof File);

    if (localFiles.length > 0) {
      result[key] = await uploadService.uploadFiles(localFiles, applicationId);
    } else if (files.length > 0) {
      result[key] = files.map((f) => ({
        id: f.id,
        filename: f.id,
        originalName: f.originalName,
        path: '',
        size: f.size,
        mimeType: f.mimeType,
        uploadedAt: f.uploadedAt,
      }));
    }
  }

  return result;
}

export const applicationService = {
  async getAll(): Promise<Application[]> {
    const { data } = await api.get<ApiResponse<{ applications: Application[] }>>(
      '/applications'
    );
    return data.data!.applications;
  },

  async getByVendorId(): Promise<Application[]> {
    const { data } = await api.get<ApiResponse<{ applications: Application[] }>>(
      '/applications'
    );
    return data.data!.applications;
  },

  async getById(id: string): Promise<Application> {
    const { data } = await api.get<ApiResponse<{ application: Application }>>(
      `/applications/${id}`
    );
    return data.data!.application;
  },

  async createDraft(formId: string): Promise<Application> {
    const { data } = await api.post<ApiResponse<{ application: Application }>>(
      '/applications/draft',
      { formId }
    );
    return data.data!.application;
  },

  async submit(
    _vendorId: string,
    _vendorName: string,
    _vendorCategory: string,
    formId: string,
    formData: Record<string, unknown>,
    uploadedDocuments: Record<string, UploadedFile[]>
  ): Promise<Application> {
    const draft = await this.createDraft(formId);
    const serverDocuments = await uploadDocumentFiles(uploadedDocuments, draft.id);
    const { data } = await api.post<ApiResponse<{ application: Application }>>(
      `/applications/${draft.id}/submit`,
      { formData, uploadedDocuments: serverDocuments }
    );
    return data.data!.application;
  },

  async uploadClarification(
    applicationId: string,
    fieldKey: string,
    files: UploadedFile[]
  ): Promise<Application> {
    const uploaded = await uploadDocumentFiles({ [fieldKey]: files }, applicationId);
    const { data } = await api.post<ApiResponse<{ application: Application }>>(
      `/applications/${applicationId}/clarifications`,
      { fieldKey, files: uploaded[fieldKey] ?? [] }
    );
    return data.data!.application;
  },

  async humanValidation(
    applicationId: string,
    action: HumanValidationAction,
    remarks?: string
  ): Promise<Application> {
    const { data } = await api.post<ApiResponse<{ application: Application }>>(
      `/applications/${applicationId}/validation`,
      { action, remarks }
    );
    return data.data!.application;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/applications/${id}`);
  },
};
