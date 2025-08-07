export interface User {
  id: string;
  username: string;
  user_type: 'patient' | 'professional' | 'admin';
  phone_number: string;
  is_verified: boolean;
  profile: PatientProfile | ProfessionalProfile;
}

export interface PatientProfile {
  patient_id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: 'M' | 'F' | 'O';
  preferred_language: 'fr' | 'en' | 'dua' | 'bas' | 'ewo';
  preferred_contact_method: 'sms' | 'voice' | 'whatsapp';
}

export interface ProfessionalProfile {
  professional_id: string;
  first_name: string;
  last_name: string;
  gender: 'M' | 'F' | 'O';
  date_of_birth: string;
  department_id: string;
  specialization: string;
  license_number: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface RegisterPatientRequest {
  user: {
    username: string;
    password: string;
    phone_number: string;
  };
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: 'M' | 'F' | 'O';
  preferred_language?: 'fr' | 'en' | 'dua' | 'bas' | 'ewo';
  preferred_contact_method?: 'sms' | 'voice' | 'whatsapp';
}

export interface RegisterProfessionalRequest {
  user: {
    username: string;
    password: string;
    phone_number: string;
  };
  first_name: string;
  last_name: string;
  gender: 'M' | 'F' | 'O';
  date_of_birth: string;
  specialization?: string;
  license_number?: string;
}