import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '@/config/env';
import { ApiResponse } from '@/types';
import { getToken, removeToken } from '@/utils/tokenStorage';

function isProtectedRoute(pathname: string): boolean {
  return (
    pathname.startsWith('/vendor') ||
    pathname.startsWith('/staff') ||
    pathname.startsWith('/admin')
  );
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiResponse>) => {
    const message =
      error.response?.data?.message ??
      error.message ??
      'An unexpected error occurred';

    if (error.response?.status === 401 && typeof window !== 'undefined') {
      removeToken();
      const pathname = window.location.pathname;
      if (isProtectedRoute(pathname)) {
        window.location.href = '/login';
      }
    }

    return Promise.reject(new Error(message));
  }
);

export default api;
