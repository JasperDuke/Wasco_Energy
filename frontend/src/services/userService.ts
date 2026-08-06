import api from './api';
import { ApiResponse, StaffUser, VendorProfile } from '@/types';

export const userService = {
  async getVendorUsers(): Promise<VendorProfile[]> {
    const { data } = await api.get<ApiResponse<{ vendors: VendorProfile[] }>>('/vendors');
    return data.data!.vendors;
  },

  async approveVendor(userId: string): Promise<VendorProfile> {
    const { data } = await api.put<ApiResponse<{ vendor: VendorProfile }>>(
      `/vendors/${userId}/approve`
    );
    return data.data!.vendor;
  },

  async deactivateVendor(userId: string): Promise<VendorProfile> {
    const { data } = await api.put<ApiResponse<{ vendor: VendorProfile }>>(
      `/vendors/${userId}/deactivate`
    );
    return data.data!.vendor;
  },

  async getStaffUsers(): Promise<StaffUser[]> {
    const { data } = await api.get<ApiResponse<{ staff: StaffUser[] }>>('/staff');
    return data.data!.staff;
  },

  async createStaffUser(input: Omit<StaffUser, 'id' | 'createdAt'>): Promise<StaffUser> {
    const { data } = await api.post<ApiResponse<{ staff: StaffUser }>>('/staff', input);
    return data.data!.staff;
  },

  async updateStaffUser(id: string, input: Partial<StaffUser>): Promise<StaffUser> {
    const { data } = await api.put<ApiResponse<{ staff: StaffUser }>>(`/staff/${id}`, input);
    return data.data!.staff;
  },

  async deactivateStaff(id: string): Promise<StaffUser> {
    await api.delete(`/staff/${id}`);
    const users = await this.getStaffUsers();
    const staff = users.find((s) => s.id === id);
    if (!staff) throw new Error('Staff user not found');
    return staff;
  },
};
