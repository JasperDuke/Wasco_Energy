import api from './api';
import { ApiResponse, VendorProfile } from '@/types';

export const vendorService = {
  async getProfile(userId: string): Promise<VendorProfile> {
    void userId;
    const { data } = await api.get<ApiResponse<{ profile: VendorProfile }>>(
      '/vendor/profile'
    );
    return data.data!.profile;
  },

  async updateProfile(
    _userId: string,
    profileData: Partial<
      Pick<VendorProfile, 'address' | 'companyPhone' | 'website' | 'companyDescription' | 'products'>
    >
  ): Promise<VendorProfile> {
    const { data } = await api.put<ApiResponse<{ profile: VendorProfile }>>(
      '/vendor/profile',
      profileData
    );
    return data.data!.profile;
  },
};
