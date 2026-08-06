'use client';

import { create } from 'zustand';
import { VendorProfile } from '@/types';
import { vendorService } from '@/services/vendorService';

interface VendorState {
  profile: VendorProfile | null;
  isLoading: boolean;
  fetchProfile: (userId: string) => Promise<void>;
  updateProfile: (
    userId: string,
    data: Partial<Pick<VendorProfile, 'address' | 'companyPhone' | 'website' | 'companyDescription' | 'products'>>
  ) => Promise<void>;
}

export const useVendorStore = create<VendorState>((set) => ({
  profile: null,
  isLoading: false,

  fetchProfile: async (userId) => {
    set({ isLoading: true });
    const profile = await vendorService.getProfile(userId);
    set({ profile, isLoading: false });
  },

  updateProfile: async (userId, data) => {
    set({ isLoading: true });
    const profile = await vendorService.updateProfile(userId, data);
    set({ profile, isLoading: false });
  },
}));
