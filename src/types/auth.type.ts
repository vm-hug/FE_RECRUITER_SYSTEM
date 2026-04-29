export interface AuthenticationRequest {
  email: string;
  password: string;
}

export interface AuthenticationResponse {
  token: string;
  authenticated: boolean;
}

export interface LogoutRequest {
  token: string;
}

export interface ApiResponse<T> {
  code?: number;
  message?: string;
  results: T;
}

export type CandidateFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  level: string;
  workFormat: string;
  education: string;
  location: string;
  languages: string;
  salary: string;
  objective: string;
};

export interface CandidateRegisterPayload extends CandidateFormData {
  avatarFile: File | null;
  cvFile: File | null;
}

export interface RecruiterRegisterPayload {
  email: string;
  password: string;
  name: string;
  position: string;
}
