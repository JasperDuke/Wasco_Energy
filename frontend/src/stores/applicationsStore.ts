'use client';

import { create } from 'zustand';
import { Application, ApplicationStatus } from '@/types';
import { applicationService } from '@/services/applicationService';

interface ApplicationsState {
  applications: Application[];
  isLoading: boolean;
  statusFilter: ApplicationStatus | 'all';
  searchQuery: string;
  vendorFilter: string;
  setStatusFilter: (status: ApplicationStatus | 'all') => void;
  setSearchQuery: (query: string) => void;
  setVendorFilter: (vendor: string) => void;
  fetchAll: (options?: { silent?: boolean }) => Promise<void>;
  getFiltered: () => Application[];
}

export const useApplicationsStore = create<ApplicationsState>((set, get) => ({
  applications: [],
  isLoading: false,
  statusFilter: 'all',
  searchQuery: '',
  vendorFilter: 'all',

  setStatusFilter: (statusFilter) => set({ statusFilter }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setVendorFilter: (vendorFilter) => set({ vendorFilter }),

  fetchAll: async (options) => {
    if (!options?.silent) set({ isLoading: true });
    try {
      const applications = await applicationService.getAll();
      set({ applications, isLoading: false });
    } catch (error) {
      if (!options?.silent) set({ isLoading: false });
      throw error;
    }
  },

  getFiltered: () => {
    const { applications, statusFilter, searchQuery, vendorFilter } = get();
    return applications.filter((app) => {
      const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
      const matchesVendor = vendorFilter === 'all' || app.vendorId === vendorFilter;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        app.caseId.toLowerCase().includes(q) ||
        app.vendorName.toLowerCase().includes(q) ||
        app.vendorCategory.toLowerCase().includes(q);
      return matchesStatus && matchesVendor && matchesSearch;
    });
  },
}));
