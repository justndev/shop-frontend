import Cookies from 'js-cookie';

import apiClient from "@/src/lib/apiClient";
import { AuthTokens, User } from '@/src/types';

interface RegisterDto {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

const authApi = {
  async register(data: RegisterDto): Promise<{ details: string; data: { email: string } }> {
    const res = await apiClient.post('/auth/register', data);
    return res.data;
  },

  async verifyEmail(token: string): Promise<{ details: string, data: AuthTokens }> {
    const res = await apiClient.get(`/auth/verify-email?token=${token}`);
    return res.data;
  },

  async login(email: string, password: string): Promise<{ details: string; data: AuthTokens }> {
    const res = await apiClient.post('/auth/login', { email, password });
    return res.data;
  },

  async forgotPassword(email: string): Promise<{ details: string }> {
    const res = await apiClient.post('/auth/forgot-password', { email });
    return res.data;
  },

  async resetPassword(token: string, password: string): Promise<{ details: string }> {
    const res = await apiClient.post('/auth/reset-password', { token, password });
    return res.data;
  },

  async refresh(refreshToken: string): Promise<{ details: string; data: AuthTokens }> {
    const res = await apiClient.post('/auth/refresh', { refreshToken });
    return res.data;
  },

  async logout(refreshToken: string): Promise<{ details: string }> {
    const res = await apiClient.post('/auth/logout', { refreshToken });
    return res.data;
  },

  async getMe(): Promise<{ details: string; data: User }> {
    const res = await apiClient.get('/users/me');
    return res.data;
  },

  async loginWithEmailLink(email: string): Promise<{ details: string; }> {
    const res = await apiClient.post('/auth/magic-link', {email});
    return res.data;
  },

  async verifyMagicLink(token: string): Promise<{ details: string; data: AuthTokens }> {
    const res = await apiClient.get(`/auth/magic-link/verify?token=${token}`);
    return res.data;
  },

  saveTokens(tokens: AuthTokens) {
    Cookies.set('accessToken', tokens.accessToken, { expires: 1 / 24 });
    Cookies.set('refreshToken', tokens.refreshToken, { expires: 7 });
  },

  clearTokens() {
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
  },

  isAuthenticated(): boolean {
    return !!Cookies.get('accessToken') || !!Cookies.get('refreshToken');
  },

  getRefreshToken(): string | undefined {
    return Cookies.get('refreshToken');
  },
}

export default authApi;
