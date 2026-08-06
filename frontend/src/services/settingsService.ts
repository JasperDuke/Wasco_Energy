import api from './api';
import { ApiResponse, SystemSettings } from '@/types';

export interface SettingsInput {
  baseUrl: string;
  accessToken: string;
  agentId: string;
  apiPublicUrl?: string;
}

export const settingsService = {
  async get(): Promise<SystemSettings | null> {
    const { data } = await api.get<ApiResponse<{ settings: SystemSettings | null }>>(
      '/settings'
    );
    return data.data!.settings;
  },

  async update(input: SettingsInput): Promise<SystemSettings> {
    const { data } = await api.put<ApiResponse<{ settings: SystemSettings }>>(
      '/settings',
      input
    );
    return data.data!.settings;
  },
};
