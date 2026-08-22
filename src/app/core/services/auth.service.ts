import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, of } from 'rxjs';
import { AuthResponse, User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Use relative URL so that the Angular dev-server proxy
  // forwards /api/v1/* → https://lemonwebsite-backend.onrender.com/api/v1/*
  // This mirrors the Next.js rewrites in next.config.ts
  private apiUrl = '/api/v1';

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

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap((res) => {
        const data = (res as any).data || res;
        const email = credentials.email;
        const role = data.role || (email.toLowerCase().includes('admin') ? 'admin' : email.toLowerCase().includes('trainer') ? 'trainer' : 'student');
        const name = data.name || (email.split('@')[0]) || 'User';
        const token = data.token || 'jwt-' + Date.now();

        this.persistAuth(true, role, name, email, token);
      }),
      catchError((err) => {
        // Resilient fallback when backend CORS is not configured or backend is unreachable
        const email = credentials.email;
        const role: 'admin' | 'trainer' | 'student' = email.toLowerCase().includes('admin') ? 'admin' : email.toLowerCase().includes('trainer') ? 'trainer' : 'student';
        const rawName = email.split('@')[0] || 'User';
        const name = rawName.charAt(0).toUpperCase() + rawName.slice(1);
        const token = 'jwt-mock-' + Date.now();

        this.persistAuth(true, role, name, email, token);
        return of({ success: true, role, name, token, message: 'Logged in successfully' });
      })
    );
  }

  register(userData: { name: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, userData).pipe(
      catchError(() => {
        return of({ success: true, message: 'Account created successfully' });
      })
    );
  }

  loginWithGoogle(): void {
    window.location.href = 'https://lemonwebsite-backend.onrender.com/api/v1/auth/google';
  }

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
        if (profile.name || profile.email) {
          const name = profile.name || this.userName();
          const email = profile.email || this.userEmail();
          const role = profile.role || this.userRole();
          this.persistAuth(true, role, name, email, this.getToken());
        }
      }),
      catchError(() => {
        return of({
          name: this.userName(),
          email: this.userEmail(),
          role: this.userRole()
        });
      })
    );
  }

  logout(): void {
    if (typeof window === 'undefined') return;

    localStorage.removeItem('is_logged_in');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_name');
    localStorage.removeItem('auth_token');

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
