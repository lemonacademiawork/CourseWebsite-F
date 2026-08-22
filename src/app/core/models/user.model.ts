export interface User {
  id?: string;
  name: string;
  email: string;
  role: 'admin' | 'trainer' | 'student';
  token?: string;
}

export interface AuthResponse {
  success?: boolean;
  message?: string;
  token?: string;
  name?: string;
  email?: string;
  role?: 'admin' | 'trainer' | 'student';
  data?: {
    id?: string;
    name?: string;
    email?: string;
    role?: 'admin' | 'trainer' | 'student';
    token?: string;
  };
}
