import api from './api';
import { ApiResponse, User, VendorRegistration } from '@/types';
import { removeToken, setToken } from '@/utils/tokenStorage';

export interface LoginInput {
  email: string;
  password: string;
}

export const authService = {
  async login(input: LoginInput): Promise<User> {
    const { data } = await api.post<ApiResponse<{ user: User; token: string }>>(
      '/auth/login',
      input
    );
    const token = data.data!.token;
    const user = data.data!.user;
    setToken(token);
    return user;
  },

  async register(input: VendorRegistration): Promise<string> {
    const { data } = await api.post<ApiResponse>('/auth/register', input);
    return data.message;
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } finally {
      removeToken();
    }
  },

  async getMe(): Promise<User> {
    const { data } = await api.get<ApiResponse<{ user: User }>>('/auth/me');
    return data.data!.user;
  },
};
