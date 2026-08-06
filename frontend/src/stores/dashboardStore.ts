'use client';

import { create } from 'zustand';
import { DashboardStats } from '@/types';
import { dashboardService } from '@/services/dashboardService';

interface DashboardState {
  stats: DashboardStats | null;
  isLoading: boolean;
  fetchStaffStats: () => Promise<void>;
  fetchAdminStats: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  stats: null,
  isLoading: false,

  fetchStaffStats: async () => {
    set({ isLoading: true });
    const stats = await dashboardService.getStaffStats();
    set({ stats, isLoading: false });
  },

  fetchAdminStats: async () => {
    set({ isLoading: true });
    const stats = await dashboardService.getAdminStats();
    set({ stats, isLoading: false });
  },
}));
