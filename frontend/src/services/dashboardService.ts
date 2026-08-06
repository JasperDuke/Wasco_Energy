import api from './api';
import { ApiResponse, DashboardStats } from '@/types';

export const dashboardService = {
  async getStaffStats(): Promise<DashboardStats> {
    const { data } = await api.get<ApiResponse<{ stats: DashboardStats }>>(
      '/dashboard/staff'
    );
    return data.data!.stats;
  },

  async getAdminStats(): Promise<DashboardStats> {
    const { data } = await api.get<ApiResponse<{ stats: DashboardStats }>>(
      '/dashboard/admin'
    );
    return data.data!.stats;
  },
};
