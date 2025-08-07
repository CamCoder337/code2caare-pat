'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, LoginRequest, LoginResponse, RegisterPatientRequest, RegisterProfessionalRequest } from '@/types/auth';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
  hasHydrated: boolean;
}

interface AuthActions {
  login: (credentials: LoginRequest) => Promise<void>;
  registerPatient: (data: RegisterPatientRequest) => Promise<void>;
  registerProfessional: (data: RegisterProfessionalRequest) => Promise<void>;
  logout: () => void;
  refreshAccessToken: () => Promise<void>;
  clearError: () => void;
}

type AuthStore = AuthState & AuthActions;

const API_BASE_URL = 'http://localhost:8000/api/v1';

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoading: false,
      error: null,
      hasHydrated: false,

      // Actions
      login: async (credentials: LoginRequest) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch(`${API_BASE_URL}/auth/login/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Erreur de connexion');
          }

          const data = await response.json();
          console.log('Login response:', data); // Debug log
          
          // Adapter la structure de réponse selon l'API backend
          let user;
          
          if (data.user && data.profile) {
            // Si la réponse contient user et profile séparément
            user = {
              ...data.user,
              profile: data.profile
            };
          } else if (data.user) {
            // Si la réponse contient user avec profile imbriqué
            user = data.user;
          } else {
            // Fallback
            user = data;
          }
          
          const tokens = data.tokens || data;
          
          set({
            user: user,
            accessToken: tokens.access,
            refreshToken: tokens.refresh,
            isLoading: false,
            error: null,
          });
          
          console.log('User set in store:', user); // Debug log
        } catch (error) {
          console.error('Login error:', error); // Debug log
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Erreur de connexion',
          });
          throw error;
        }
      },

      registerPatient: async (data: RegisterPatientRequest) => {
        set({ isLoading: true, error: null });
        
        try {
          console.log('Sending patient registration data:', JSON.stringify(data, null, 2)); // Debug log
          
          const response = await fetch(`${API_BASE_URL}/auth/register/patient/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          });

          console.log('Patient registration response status:', response.status); // Debug log

          if (!response.ok) {
            const errorData = await response.json();
            console.error('Patient registration error:', errorData); // Debug log
            throw new Error(errorData.detail || errorData.error || JSON.stringify(errorData));
          }

          const responseData = await response.json();
          console.log('Patient registration response:', responseData); // Debug log
          
          // Adapter la structure de réponse
          let user;
          if (responseData.user && responseData.profile) {
            user = {
              ...responseData.user,
              profile: responseData.profile
            };
          } else if (responseData.user) {
            user = responseData.user;
          } else {
            user = responseData;
          }
          
          const tokens = responseData.tokens || responseData;
          
          set({
            user: user,
            accessToken: tokens.access,
            refreshToken: tokens.refresh,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Erreur lors de l\'inscription',
          });
          throw error;
        }
      },

      registerProfessional: async (data: RegisterProfessionalRequest) => {
        set({ isLoading: true, error: null });
        
        try {
          console.log('Sending professional registration data:', JSON.stringify(data, null, 2)); // Debug log
          
          const response = await fetch(`${API_BASE_URL}/auth/register/professional/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          });

          console.log('Professional registration response status:', response.status); // Debug log

          if (!response.ok) {
            const errorData = await response.json();
            console.error('Professional registration error:', errorData); // Debug log
            throw new Error(errorData.detail || errorData.error || JSON.stringify(errorData));
          }

          const responseData = await response.json();
          console.log('Professional registration response:', responseData); // Debug log
          
          // Adapter la structure de réponse
          let user;
          if (responseData.user && responseData.profile) {
            user = {
              ...responseData.user,
              profile: responseData.profile
            };
          } else if (responseData.user) {
            user = responseData.user;
          } else {
            user = responseData;
          }
          
          const tokens = responseData.tokens || responseData;
          
          set({
            user: user,
            accessToken: tokens.access,
            refreshToken: tokens.refresh,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Erreur lors de l\'inscription',
          });
          throw error;
        }
      },

      logout: () => {
        const { refreshToken } = get();
        
        // Call logout endpoint to blacklist token
        if (refreshToken) {
          console.log('Sending logout request with refresh token:', refreshToken); // Debug log
          fetch(`${API_BASE_URL}/auth/logout/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh: refreshToken }),
          })
          .then(response => {
            console.log('Logout response status:', response.status); // Debug log
            if (!response.ok) {
              return response.json().then(data => {
                console.error('Logout error response:', data); // Debug log
              });
            }
            console.log('Logout successful'); // Debug log
          })
          .catch(error => {
            console.error('Logout API error:', error);
            // Continue with local logout even if API call fails
          });
        }

        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          error: null,
        });
      },

      refreshAccessToken: async () => {
        const { refreshToken } = get();
        
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        try {
          const response = await fetch(`${API_BASE_URL}/auth/token/refresh/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh: refreshToken }),
          });

          if (!response.ok) {
            throw new Error('Failed to refresh token');
          }

          const data = await response.json();
          set({ accessToken: data.access });
        } catch (error) {
          // If refresh fails, logout user
          get().logout();
          throw error;
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.hasHydrated = true;
        }
      },
    }
  )
);