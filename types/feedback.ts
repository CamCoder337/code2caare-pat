export interface Feedback {
  feedback_id: string;
  created_at: string;
  input_type: 'text' | 'audio';
  language: 'fr' | 'en' | 'dua' | 'bas' | 'ewo';
  description: string;
  rating: 1 | 2 | 3 | 4 | 5;
  patient_id: string;
  department_id: string;
  theme?: FeedbackTheme;
  theme_name?: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
  sentiment_positive_score?: number;
  sentiment_negative_score?: number;
  sentiment_neutral_score?: number;
  is_processed: boolean;
  processed_at?: string;
}

export interface FeedbackTheme {
  theme_id: string;
  theme_name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateFeedbackRequest {
  description: string;
  language?: 'fr' | 'en' | 'dua' | 'bas' | 'ewo';
  input_type?: 'text' | 'audio';
  rating: 1 | 2 | 3 | 4 | 5;
  department_id: string;
  // patient_id est auto-assigné par l'API Gateway depuis l'authentification
}

export interface CreateFeedbackResponse {
  message: string;
  feedback: Feedback;
  processing_info: string;
}

export interface FeedbackProcessingStatus {
  feedback_id: string;
  is_processed: boolean;
  processed_at?: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
  sentiment_scores: {
    positive?: number;
    negative?: number;
    neutral?: number;
  };
  theme?: string;
  description: string;
  rating: number;
}

export interface Department {
  department_id: string;
  name: string;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface FeedbackByTheme {
  theme_name: string;
  feedback_count: number;
  feedbacks: Feedback[];
}

export interface FeedbackFilters {
  input_type?: 'text' | 'audio';
  language?: 'fr' | 'en' | 'dua' | 'bas' | 'ewo';
  rating?: 1 | 2 | 3 | 4 | 5;
  is_processed?: boolean;
  date_from?: string;
  date_to?: string;
  search?: string;
  ordering?: 'created_at' | '-created_at' | 'rating' | '-rating';
}

// Constantes utiles
export const LANGUAGE_OPTIONS = [
  { value: 'fr', label: 'Français' },
  { value: 'en', label: 'English' },
  { value: 'dua', label: 'Dua' },
  { value: 'bas', label: 'Bas' },
  { value: 'ewo', label: 'Ewo' },
] as const;

export const RATING_OPTIONS = [
  { value: 1, label: '1 - Très insatisfait' },
  { value: 2, label: '2 - Insatisfait' },
  { value: 3, label: '3 - Neutre' },
  { value: 4, label: '4 - Satisfait' },
  { value: 5, label: '5 - Très satisfait' },
] as const;

export const INPUT_TYPE_OPTIONS = [
  { value: 'text', label: 'Texte' },
  { value: 'audio', label: 'Audio' },
] as const;