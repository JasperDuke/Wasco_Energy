'use client';

import { create } from 'zustand';
import { StaffUser, VendorProfile } from '@/types';
import { userService } from '@/services/userService';

interface UserManagementState {
  vendorUsers: VendorProfile[];
  staffUsers: StaffUser[];
  isLoading: boolean;
  fetchVendorUsers: () => Promise<void>;
  fetchStaffUsers: () => Promise<void>;
  approveVendor: (userId: string) => Promise<void>;
  deactivateVendor: (userId: string) => Promise<void>;
  createStaff: (input: Omit<StaffUser, 'id' | 'createdAt'>) => Promise<void>;
  updateStaff: (id: string, input: Partial<StaffUser>) => Promise<void>;
  deactivateStaff: (id: string) => Promise<void>;
}

export const useUserStore = create<UserManagementState>((set, get) => ({
  vendorUsers: [],
  staffUsers: [],
  isLoading: false,

  fetchVendorUsers: async () => {
    set({ isLoading: true });
    const vendorUsers = await userService.getVendorUsers();
    set({ vendorUsers, isLoading: false });
  },

  fetchStaffUsers: async () => {
    set({ isLoading: true });
    const staffUsers = await userService.getStaffUsers();
    set({ staffUsers, isLoading: false });
  },

  approveVendor: async (userId) => {
    await userService.approveVendor(userId);
    await get().fetchVendorUsers();
  },

  deactivateVendor: async (userId) => {
    await userService.deactivateVendor(userId);
    await get().fetchVendorUsers();
  },

  createStaff: async (input) => {
    await userService.createStaffUser(input);
    await get().fetchStaffUsers();
  },

  updateStaff: async (id, input) => {
    await userService.updateStaffUser(id, input);
    await get().fetchStaffUsers();
  },

  deactivateStaff: async (id) => {
    await userService.deactivateStaff(id);
    await get().fetchStaffUsers();
  },
}));
