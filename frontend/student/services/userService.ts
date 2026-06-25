import api from './api';

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar_url?: string;
  date_of_birth?: string;
  school?: string;
  grade?: string;
  parent_guardian_name?: string;
  parent_guardian_phone?: string;
  phone?: string;
  location?: string;
  age?: number;
  created_at?: string;
  updated_at?: string;
}

export const userService = {
  getProfile: async (): Promise<UserProfile> => {
    const response = await api.get('/users/profile');
    return response.data.user;
  },

  updateProfile: async (data: Partial<UserProfile>): Promise<UserProfile> => {
    const response = await api.put('/users/profile', data);
    return response.data.user;
  },

  changePassword: async (oldPassword: string, newPassword: string, confirmPassword: string): Promise<any> => {
    const response = await api.post('/users/change-password', { oldPassword, newPassword, confirmPassword });
    return response.data;
  },

  uploadProfilePhoto: async (file: File): Promise<{ avatar_url: string; user: UserProfile }> => {
    const formData = new FormData();
    formData.append('photo', file);
    const response = await api.post('/users/profile-photo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteProfilePhoto: async (): Promise<{ user: UserProfile }> => {
    const response = await api.delete('/users/profile-photo');
    return response.data;
  },

  logout: async () => {
    if (typeof window !== 'undefined') {
      // Try to call backend logout endpoint to clear session server-side
      try {
        await api.post('/auth/logout');
      } catch (error) {
        // Continue with client-side logout even if server-side fails
        console.debug('Server-side logout failed, continuing with client-side cleanup');
      }
      
      // Clear all authentication data from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('sessionToken');
      
      // Clear all authentication data from sessionStorage
      sessionStorage.removeItem('auth_session');
      sessionStorage.removeItem('page_loaded');
      
      // Set logout flag to prevent bfcache access
      sessionStorage.setItem('logout_initiated', 'true');
      
      // Clear any cached data from browser caches
      if ('caches' in window) {
        caches.keys().then((names) => {
          names.forEach((name) => {
            caches.delete(name);
          });
        });
      }
      
      // Clear any IndexedDB or other storage
      if ('indexedDB' in window) {
        try {
          indexedDB.databases?.().then((databases) => {
            databases.forEach((db) => {
              if (db.name) {
                indexedDB.deleteDatabase(db.name);
              }
            });
          });
        } catch (e) {
          // IndexedDB operations may fail in some browsers
          console.debug('IndexedDB cleanup skipped');
        }
      }
      
      // Dispatch custom event for other components
      window.dispatchEvent(new Event('auth:logout'));
      
      // Use window.location.href with cache-busting to force full page reload
      // This prevents bfcache from restoring the previous page
      // Redirect directly to home page (not login page)
      window.location.href = `/?logout=${Date.now()}`;
    }
  },
};
