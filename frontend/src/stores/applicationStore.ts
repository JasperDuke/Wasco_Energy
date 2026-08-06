'use client';

import { create } from 'zustand';
import { Application, UploadedFile } from '@/types';
import { applicationService } from '@/services/applicationService';

interface ApplicationState {
  applications: Application[];
  currentApplication: Application | null;
  isLoading: boolean;
  fetchByVendor: (vendorId: string) => Promise<void>;
  fetchById: (id: string) => Promise<void>;
  submitApplication: (
    vendorId: string,
    vendorName: string,
    vendorCategory: string,
    formId: string,
    formData: Record<string, unknown>,
    uploadedDocuments: Record<string, UploadedFile[]>
  ) => Promise<Application>;
  uploadClarification: (appId: string, fieldKey: string, files: UploadedFile[]) => Promise<void>;
}

export const useApplicationStore = create<ApplicationState>((set) => ({
  applications: [],
  currentApplication: null,
  isLoading: false,

  fetchByVendor: async (vendorId) => {
    set({ isLoading: true });
    const applications = await applicationService.getByVendorId();
    set({ applications, isLoading: false });
  },

  fetchById: async (id) => {
    set({ isLoading: true });
    const currentApplication = await applicationService.getById(id);
    set({ currentApplication, isLoading: false });
  },

  submitApplication: async (vendorId, vendorName, vendorCategory, formId, formData, uploadedDocuments) => {
    const app = await applicationService.submit(
      vendorId,
      vendorName,
      vendorCategory,
      formId,
      formData,
      uploadedDocuments
    );
    set((state) => ({
      applications: [app, ...state.applications],
      currentApplication: app,
    }));
    return app;
  },

  uploadClarification: async (appId, fieldKey, files) => {
    const updated = await applicationService.uploadClarification(appId, fieldKey, files);
    set((state) => ({
      currentApplication: updated,
      applications: state.applications.map((a) => (a.id === appId ? updated : a)),
    }));
  },
}));
