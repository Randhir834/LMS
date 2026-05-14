import api from './api';

export type PortalRole = 'student' | 'instructor' | 'admin';

export const authService = {
  register: async (data: {
    name: string;
    email: string;
    password: string;
    role: PortalRole;
    date_of_birth?: string;
    school?: string;
    grade?: string;
    parent_guardian_name?: string;
    phone?: string;
    location?: string;
  }) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  login: async (data: { email: string; password: string; expectedRole: PortalRole }) => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  refreshToken: async (token: string) => {
    const response = await api.post('/auth/refresh-token', { token });
    return response.data;
  },

  forgotPassword: async (data: { email: string; expectedRole: PortalRole; clientOrigin: string }) => {
    const response = await api.post('/auth/forgot-password', data);
    return response.data;
  },

  resetPassword: async (data: { token: string; password: string }) => {
    const response = await api.post('/auth/reset-password', data);
    return response.data;
  },
};
