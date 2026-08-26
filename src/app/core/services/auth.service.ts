import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, of, throwError } from 'rxjs';
import { AuthResponse, User, UpdateProfilePayload } from '../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  isLoggedIn = signal<boolean>(false);
  userRole = signal<'admin' | 'trainer' | 'student' | ''>('');
  userName = signal<string>('');
  userEmail = signal<string>('');

  constructor(private http: HttpClient, private router: Router) {
    this.loadAuthState();
  }

  loadAuthState(): void {
    if (typeof window === 'undefined') return;

    const loggedIn = localStorage.getItem('is_logged_in') === 'true' || this.getCookie('is_logged_in') === 'true';
    const role = (localStorage.getItem('user_role') || this.getCookie('user_role') || '') as any;
    const name = localStorage.getItem('user_name') || this.getCookie('user_name') || 'User';
    const email = localStorage.getItem('user_email') || this.getCookie('user_email') || '';

    this.isLoggedIn.set(loggedIn);
    this.userRole.set(role);
    this.userName.set(name);
    this.userEmail.set(email);
  }

  /** POST /api/v1/auth/login */
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap((res) => {
        const data = (res as any).data || res;
        const user = data.user || data;
        const role = user.role || data.role || 'student';
        const name = user.name || data.name || credentials.email.split('@')[0];
        const email = user.email || data.email || credentials.email;
        const token = data.token || data.accessToken || res.token || '';
        const refreshToken = data.refreshToken || res.refreshToken || '';

        this.persistAuth(true, role, name, email, token);
        if (refreshToken) {
          this.storeRefreshToken(refreshToken);
        }
      })
    );
  }

  /** POST /api/v1/auth/register */
  register(userData: { name: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, userData);
  }

  /** GET /api/v1/auth/google — redirect to Google OAuth */
  loginWithGoogle(): void {
    window.location.href = 'https://lemonwebsite-backend.onrender.com/api/v1/auth/google';
  }

  /** GET /api/v1/auth/me */
  getAuthMe(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/auth/me`).pipe(
      tap((res) => {
        const profile = res.data || res;
        if (profile && (profile.name || profile.email)) {
          const name = profile.name || this.userName();
          const email = profile.email || this.userEmail();
          const role = profile.role || this.userRole();
          this.persistAuth(true, role, name, email, this.getToken());
        }
      })
    );
  }

  /** GET /api/v1/users/me */
  fetchUserProfile(): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return of({
        name: this.userName(),
        email: this.userEmail(),
        role: this.userRole()
      });
    }
    return this.http.get<any>(`${this.apiUrl}/users/me`).pipe(
      tap((res) => {
        const profile = res.data || res;
        if (profile && (profile.name || profile.email)) {
          const name = profile.name || this.userName();
          const email = profile.email || this.userEmail();
          const role = profile.role || this.userRole();
          this.persistAuth(true, role, name, email, this.getToken());
        }
      })
    );
  }

  /** PATCH /api/v1/users/me */
  updateProfile(payload: UpdateProfilePayload): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/users/me`, payload).pipe(
      tap((res) => {
        const profile = res.data || res;
        if (profile && profile.name) {
          this.userName.set(profile.name);
          if (typeof window !== 'undefined') {
            localStorage.setItem('user_name', profile.name);
            this.setCookie('user_name', profile.name);
          }
        }
      })
    );
  }

  /** POST /api/v1/auth/refresh */
  refreshToken(): Observable<any> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }
    return this.http.post<any>(`${this.apiUrl}/auth/refresh`, { refreshToken }).pipe(
      tap((res) => {
        const data = res.data || res;
        const newToken = data.token || data.accessToken;
        if (newToken) {
          if (typeof window !== 'undefined') {
            localStorage.setItem('auth_token', newToken);
            this.setCookie('auth_token', newToken);
          }
          if (data.refreshToken) {
            this.storeRefreshToken(data.refreshToken);
          }
        }
      })
    );
  }

  /** POST /api/v1/auth/logout */
  logout(): void {
    if (typeof window === 'undefined') return;

    // Call the backend logout endpoint to invalidate the session on backend
    const token = this.getToken();
    if (token) {
      this.http.post(`${this.apiUrl}/auth/logout`, {}).subscribe({
        error: () => {}
      });
    }

    localStorage.removeItem('is_logged_in');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_name');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');

    this.deleteCookie('is_logged_in');
    this.deleteCookie('user_role');
    this.deleteCookie('user_email');
    this.deleteCookie('user_name');
    this.deleteCookie('auth_token');

    this.isLoggedIn.set(false);
    this.userRole.set('');
    this.userName.set('');
    this.userEmail.set('');

    window.dispatchEvent(new Event('auth_state_changed'));
    this.router.navigate(['/']);
  }

  persistAuth(loggedIn: boolean, role: 'admin' | 'trainer' | 'student', name: string, email: string, token: string): void {
    if (typeof window === 'undefined') return;

    localStorage.setItem('is_logged_in', String(loggedIn));
    localStorage.setItem('user_role', role);
    localStorage.setItem('user_name', name);
    localStorage.setItem('user_email', email);
    if (token) {
      localStorage.setItem('auth_token', token);
      this.setCookie('auth_token', token);
    }

    this.setCookie('is_logged_in', String(loggedIn));
    this.setCookie('user_role', role);
    this.setCookie('user_name', name);
    this.setCookie('user_email', email);

    this.isLoggedIn.set(loggedIn);
    this.userRole.set(role);
    this.userName.set(name);
    this.userEmail.set(email);

    window.dispatchEvent(new Event('auth_state_changed'));
  }

  getToken(): string {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem('auth_token') || this.getCookie('auth_token') || '';
  }

  getRefreshToken(): string {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem('refresh_token') || '';
  }

  storeRefreshToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('refresh_token', token);
  }

  getCookie(name: string): string {
    if (typeof document === 'undefined') return '';
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]*)'));
    return match ? decodeURIComponent(match[2]) : '';
  }

  setCookie(name: string, value: string, days = 7): void {
    if (typeof document === 'undefined') return;
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
  }

  deleteCookie(name: string): void {
    if (typeof document === 'undefined') return;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }
}
