export interface User {
  id?: string;
  name: string;
  email: string;
  role: 'admin' | 'trainer' | 'student';
  token?: string;
  phone?: string;
  bio?: string;
  avatarUrl?: string;
}

export interface UpdateProfilePayload {
  name?: string;
  phone?: string;
  bio?: string;
  avatarUrl?: string;
}

export interface AuthResponse {
  success?: boolean;
  message?: string;
  token?: string;
  refreshToken?: string;
  name?: string;
  email?: string;
  role?: 'admin' | 'trainer' | 'student';
  data?: {
    id?: string;
    name?: string;
    email?: string;
    role?: 'admin' | 'trainer' | 'student';
    token?: string;
    refreshToken?: string;
  };
}
