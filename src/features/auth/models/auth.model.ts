import type { User } from '@/models/user.model';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  phone?: string;
}

export interface AuthResponseData {
  user: User;
}

export interface ForgotPasswordCredentials {
  email: string;
}

export interface ResetPasswordCredentials {
  resetPasswordToken: string;
  password: string;
  passwordConfirmation: string;
}

export interface UpdateProfileInput {
  name?: string;
  phone?: string | null;
  avatar?: File | null;
  removeAvatar?: boolean;
}
