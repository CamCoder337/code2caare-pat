'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { 
  Feedback, 
  CreateFeedbackRequest, 
  CreateFeedbackResponse,
  FeedbackProcessingStatus,
  Department,
  FeedbackByTheme,
  FeedbackFilters 
} from '@/types/feedback';

interface FeedbackState {
  feedbacks: Feedback[];
  departments: Department[];
  currentFeedback: Feedback | null;
  isLoading: boolean;
  error: string | null;
  filters: FeedbackFilters;
}

interface FeedbackActions {
  // Feedbacks via API Gateway
  fetchMyFeedbacks: (filters?: FeedbackFilters) => Promise<void>;
  createFeedback: (data: CreateFeedbackRequest) => Promise<CreateFeedbackResponse>;
  getFeedbackStatus: (id: string) => Promise<FeedbackProcessingStatus>;
  createTestFeedback: (data?: Partial<CreateFeedbackRequest>) => Promise<CreateFeedbackResponse>;
  
  // Departments (via feedback-service direct)
  fetchDepartments: () => Promise<void>;
  
  // Filters
  setFilters: (filters: Partial<FeedbackFilters>) => void;
  clearFilters: () => void;
  
  // UI
  setCurrentFeedback: (feedback: Feedback | null) => void;
  clearError: () => void;
}

type FeedbackStore = FeedbackState & FeedbackActions;

// API Gateway pour les patients (routes sécurisées)
const API_GATEWAY_URL = 'http://localhost:8000';

// Utilitaire pour récupérer les headers d'authentification
const getAuthHeaders = () => {
  if (typeof window === 'undefined') return {};
  
  const authData = localStorage.getItem('auth-storage');
  if (!authData) return {};
  
  try {
    const parsed = JSON.parse(authData);
    const user = parsed.state?.user;
    const token = parsed.state?.accessToken;
    
    if (!user || !token) return {};
    
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  } catch {
    return {};
  }
};

export const useFeedbackStore = create<FeedbackStore>()(
  persist(
    (set, get) => ({
      // State
      feedbacks: [],
      departments: [],
      currentFeedback: null,
      isLoading: false,
      error: null,
      filters: {},

      // Actions
      fetchMyFeedbacks: async (filters?: FeedbackFilters) => {
        set({ isLoading: true, error: null });
        
        try {
          const queryParams = new URLSearchParams();
          const currentFilters = filters || get().filters;
          
          // Ajouter les filtres comme query params
          Object.entries(currentFilters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
              queryParams.append(key, String(value));
            }
          });
          
          const url = `${API_GATEWAY_URL}/api/v1/patient/feedbacks/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
          
          const response = await fetch(url, {
            method: 'GET',
            headers: getAuthHeaders(),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || errorData.detail || 'Erreur lors de la récupération de vos feedbacks');
          }

          const data = await response.json();
          set({ 
            feedbacks: Array.isArray(data) ? data : [], 
            isLoading: false 
          });
        } catch (error) {
          console.error('Fetch my feedbacks error:', error);
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Erreur lors de la récupération de vos feedbacks',
          });
        }
      },

      createFeedback: async (data: CreateFeedbackRequest) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch(`${API_GATEWAY_URL}/api/v1/patient/feedback/`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || errorData.detail || 'Erreur lors de la création du feedback');
          }

          const result: CreateFeedbackResponse = await response.json();
          
          // Ajouter le nouveau feedback à la liste
          set(state => ({ 
            feedbacks: [result.feedback, ...state.feedbacks],
            isLoading: false 
          }));
          
          return result;
        } catch (error) {
          console.error('Create feedback error:', error);
          const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la création du feedback';
          set({
            isLoading: false,
            error: errorMessage,
          });
          throw error;
        }
      },

      getFeedbackStatus: async (id: string) => {
        try {
          const response = await fetch(`${API_GATEWAY_URL}/api/v1/patient/feedback/${id}/status/`, {
            method: 'GET',
            headers: getAuthHeaders(),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || errorData.detail || 'Erreur lors de la récupération du statut');
          }

          return await response.json();
        } catch (error) {
          console.error('Get feedback status error:', error);
          throw error;
        }
      },

      createTestFeedback: async (data?: Partial<CreateFeedbackRequest>) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch(`${API_GATEWAY_URL}/api/v1/patient/feedback/test/`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data || {}),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || errorData.detail || 'Erreur lors de la création du feedback de test');
          }

          const result: CreateFeedbackResponse = await response.json();
          
          // Ajouter le feedback de test à la liste
          set(state => ({ 
            feedbacks: [result.feedback, ...state.feedbacks],
            isLoading: false 
          }));
          
          return result;
        } catch (error) {
          console.error('Create test feedback error:', error);
          const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la création du feedback de test';
          set({
            isLoading: false,
            error: errorMessage,
          });
          throw error;
        }
      },

      fetchDepartments: async () => {
        try {
          const response = await fetch(`${API_GATEWAY_URL}/api/v1/departments/`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            },
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || errorData.detail || 'Erreur lors de la récupération des départements');
          }

          const data = await response.json();
          // L'API peut retourner soit un tableau direct, soit un objet avec results
          const departments = Array.isArray(data) ? data : data.results || [];
          set({ departments });
        } catch (error) {
          console.error('Fetch departments error:', error);
          
          // Fallback vers des départements par défaut en cas d'erreur
          const fallbackDepartments = [
            {
              department_id: '87654321-4321-4321-4321-cba987654321',
              name: 'Médecine Générale',
              description: 'Consultations générales et suivi médical',
              is_active: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            },
            {
              department_id: '12345678-1234-1234-1234-123456789abc',
              name: 'Pédiatrie',
              description: 'Soins médicaux pour enfants',
              is_active: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            },
            {
              department_id: '11111111-2222-3333-4444-555555555555',
              name: 'Cardiologie',
              description: 'Spécialiste du cœur et système cardiovasculaire',
              is_active: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            },
            {
              department_id: '66666666-7777-8888-9999-000000000000',
              name: 'Gynécologie',
              description: 'Santé reproductive féminine',
              is_active: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ];
          
          set({ 
            departments: fallbackDepartments,
            error: `Utilisation des départements par défaut: ${error instanceof Error ? error.message : 'Erreur de connexion'}`
          });
        }
      },

      setFilters: (filters: Partial<FeedbackFilters>) => {
        set(state => ({ filters: { ...state.filters, ...filters } }));
      },

      clearFilters: () => {
        set({ filters: {} });
      },

      setCurrentFeedback: (feedback: Feedback | null) => {
        set({ currentFeedback: feedback });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'feedback-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        departments: state.departments, // Garder les départements en cache
      }),
    }
  )
);