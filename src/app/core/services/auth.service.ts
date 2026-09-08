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

  private normalizeRole(role: any): 'admin' | 'trainer' | 'student' | '' {
    if (!role) return '';
    const r = String(role).trim().toLowerCase();
    if (r === 'admin') return 'admin';
    if (r === 'trainer') return 'trainer';
    if (r === 'student') return 'student';
    return 'student';
  }

  capitalizeWords(str: string): string {
    if (!str) return '';
    return str
      .split(/\s+/)
      .filter(w => w.length > 0)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
  }

  resolveDisplayName(data: any, fallbackEmail?: string): string {
    const email = fallbackEmail || data?.email || data?.user?.email || '';

    // 1. Direct name fields
    let candidate = data?.name || data?.fullName || data?.userName || data?.user?.name || data?.user?.fullName;

    // 2. Profile name fields (studentProfile, trainerProfile)
    if (!candidate || candidate === 'null' || candidate === 'undefined' || candidate === 'User') {
      candidate = data?.studentProfile?.name ||
                  data?.trainerProfile?.name ||
                  data?.user?.studentProfile?.name ||
                  data?.user?.trainerProfile?.name ||
                  data?.profile?.name ||
                  data?.user?.profile?.name;
    }

    // 3. If candidate exists and is valid
    if (candidate && typeof candidate === 'string' && candidate.trim() && candidate.toLowerCase() !== 'null' && candidate.toLowerCase() !== 'undefined' && candidate.toLowerCase() !== 'user') {
      return this.capitalizeWords(candidate.trim());
    }

    // 4. Derive from email (e.g. manishi23nigam06@gmail.com -> Manishi Nigam)
    if (email && email.includes('@')) {
      const localPart = email.split('@')[0];
      const cleaned = localPart.replace(/[._-]/g, ' ').replace(/[0-9]+/g, ' ').trim();
      if (cleaned) {
        return this.capitalizeWords(cleaned);
      }
      return this.capitalizeWords(localPart);
    }

    return candidate && candidate !== 'null' ? candidate : 'User';
  }

  loadAuthState(): void {
    if (typeof window === 'undefined') return;

    const loggedIn = localStorage.getItem('is_logged_in') === 'true' || this.getCookie('is_logged_in') === 'true';
    const rawRole = localStorage.getItem('user_role') || this.getCookie('user_role') || '';
    const role = this.normalizeRole(rawRole);
    let name = localStorage.getItem('user_name') || this.getCookie('user_name') || '';
    const email = localStorage.getItem('user_email') || this.getCookie('user_email') || '';

    if ((!name || name === 'User') && email) {
      name = this.resolveDisplayName(null, email);
      localStorage.setItem('user_name', name);
      this.setCookie('user_name', name);
    } else if (!name) {
      name = 'User';
    }

    this.isLoggedIn.set(loggedIn);
    this.userRole.set(role);
    this.userName.set(name);
    this.userEmail.set(email);
  }

  /** POST /api/v1/auth/login */
  login(credentials: { email?: string; phone?: string; phoneNumber?: string; password: string } | any): Observable<any> {
    const rawIdentifier = String(credentials.email || credentials.phone || credentials.phoneNumber || credentials.identifier || '').trim();
    const payload = {
      email: rawIdentifier,
      phone: credentials.phone || credentials.phoneNumber || rawIdentifier,
      phoneNumber: credentials.phoneNumber || credentials.phone || rawIdentifier,
      identifier: rawIdentifier,
      phoneOrEmail: rawIdentifier,
      username: rawIdentifier,
      password: credentials.password
    };

    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, payload).pipe(
      tap((res) => {
        const data = (res as any).data || res;
        const user = data.user || data;
        const role = this.normalizeRole(user.role || data.role || 'student');
        const email = user.email || data.email || rawIdentifier;
        const name = this.resolveDisplayName(user, email);
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
  register(userData: { name: string; email: string; password: string; phone?: string }): Observable<any> {
    const payload = {
      name: userData.name,
      fullName: userData.name,
      email: userData.email,
      phone: userData.phone || '+910000000000',
      phoneNumber: userData.phone || '+910000000000',
      password: userData.password
    };
    return this.http.post(`${this.apiUrl}/auth/register`, payload);
  }

  /** GET /api/v1/auth/google — redirect to Google OAuth */
  loginWithGoogle(returnUrl?: string): void {
    if (typeof window !== 'undefined') {
      const targetUrl = returnUrl || window.location.pathname;
      if (targetUrl && !targetUrl.startsWith('/login') && !targetUrl.startsWith('/signup')) {
        sessionStorage.setItem('oauth_return_url', targetUrl);
        localStorage.setItem('oauth_return_url', targetUrl);
      }
    }
    window.location.href = `${this.apiUrl}/auth/google`;
  }

  /** Decode JWT payload safely */
  parseJwt(token: string): any {
    if (!token) return null;
    try {
      const parts = token.split('.');
      if (parts.length < 2) return null;
      const base64Url = parts[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch {
      return null;
    }
  }

  /** Complete OAuth authentication from token and optional metadata */
  handleOAuthSuccess(token: string, refreshToken?: string, explicitRole?: string, explicitName?: string, explicitEmail?: string): void {
    if (!token) return;

    let role = explicitRole ? this.normalizeRole(explicitRole) : '';
    let name = explicitName || '';
    let email = explicitEmail || '';

    // If metadata wasn't passed in query params, extract from JWT payload
    const decoded = this.parseJwt(token);
    if (decoded) {
      if (!role) {
        role = this.normalizeRole(decoded.role || decoded.userRole || decoded.user?.role || 'student');
      }
      if (!name) {
        name = this.resolveDisplayName(decoded, email);
      }
      if (!email) {
        email = decoded.email || decoded.userEmail || decoded.user?.email || '';
      }
    }

    if (!role) role = 'student';
    name = this.resolveDisplayName({ name }, email);

    this.persistAuth(true, role, name, email, token);

    if (refreshToken) {
      this.storeRefreshToken(refreshToken);
    }

    // Refresh profile details in background
    this.fetchUserProfile().subscribe({ error: () => {} });
  }

  /** Navigate user to the proper screen after authentication */
  navigateAfterAuth(customReturnUrl?: string | null): void {
    let returnUrl = customReturnUrl;

    if (!returnUrl && typeof window !== 'undefined') {
      returnUrl = sessionStorage.getItem('oauth_return_url') || localStorage.getItem('oauth_return_url');
      sessionStorage.removeItem('oauth_return_url');
      localStorage.removeItem('oauth_return_url');
    }

    const role = (this.userRole() || '').toLowerCase();

    if (role === 'admin') {
      if (returnUrl && returnUrl.startsWith('/admin')) {
        this.router.navigateByUrl(returnUrl);
      } else {
        this.router.navigate(['/admin/dashboard']);
      }
    } else if (role === 'trainer') {
      if (returnUrl && returnUrl.startsWith('/trainer')) {
        this.router.navigateByUrl(returnUrl);
      } else {
        this.router.navigate(['/trainer/dashboard']);
      }
    } else {
      if (
        returnUrl &&
        !returnUrl.startsWith('/admin') &&
        !returnUrl.startsWith('/trainer') &&
        !returnUrl.startsWith('/login') &&
        !returnUrl.startsWith('/signup') &&
        !returnUrl.startsWith('/auth') &&
        !returnUrl.startsWith('/403')
      ) {
        this.router.navigateByUrl(returnUrl);
      } else {
        this.router.navigate(['/']);
      }
    }
  }

  /** GET /api/v1/auth/me */
  getAuthMe(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/auth/me`).pipe(
      tap((res) => {
        const profile = res.data || res;
        if (profile) {
          const email = profile.email || profile.user?.email || this.userEmail();
          const name = this.resolveDisplayName(profile, email) || this.userName();
          const role = this.normalizeRole(profile.role || profile.user?.role || this.userRole());
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
        if (profile) {
          const email = profile.email || profile.user?.email || this.userEmail();
          const name = this.resolveDisplayName(profile, email) || this.userName();
          const role = this.normalizeRole(profile.role || profile.user?.role || this.userRole());
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

  /** PATCH /api/v1/users/me/password */
  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/users/me/password`, { currentPassword, newPassword });
  }

  /** POST /api/v1/auth/whatsapp/send-otp — Send WhatsApp OTP directly */
  sendWhatsAppOtp(phone: string, code?: string): Observable<any> {
    const payload: { phone: string; code?: string } = { phone: phone.trim() };
    if (code) payload.code = code.trim();
    return this.http.post(`${this.apiUrl}/auth/whatsapp/send-otp`, payload).pipe(
      catchError(() => this.http.post(`${this.apiUrl}/auth/whatsapp-otp`, payload))
    );
  }

  /** POST /api/v1/auth/forgot-password — Sends 6-digit WhatsApp/Email OTP */
  forgotPassword(identifier: string): Observable<any> {
    const clean = identifier.trim();
    const isPhone = !clean.includes('@') && /[0-9]{7,15}/.test(clean.replace(/\D/g, ''));
    const payload = isPhone
      ? { phone: clean.replace(/\D/g, ''), identifier: clean }
      : { email: clean, identifier: clean };

    return this.http.post(`${this.apiUrl}/auth/forgot-password`, payload);
  }

  /** POST /api/v1/auth/reset-password — Reset password using 6-digit OTP token */
  resetPassword(token: string, newPassword: string, phone?: string): Observable<any> {
    const payload: { token: string; newPassword: string; phone?: string } = {
      token: token.trim(),
      newPassword
    };
    if (phone && phone.trim()) {
      payload.phone = phone.trim().replace(/\D/g, '');
    }
    return this.http.post(`${this.apiUrl}/auth/reset-password`, payload);
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

  persistAuth(loggedIn: boolean, role: 'admin' | 'trainer' | 'student' | string, name: string, email: string, token: string): void {
    if (typeof window === 'undefined') return;

    const normalizedRole = this.normalizeRole(role) || 'student';

    localStorage.setItem('is_logged_in', String(loggedIn));
    localStorage.setItem('user_role', normalizedRole);
    localStorage.setItem('user_name', name);
    localStorage.setItem('user_email', email);
    if (token) {
      localStorage.setItem('auth_token', token);
      this.setCookie('auth_token', token);
    }

    this.setCookie('is_logged_in', String(loggedIn));
    this.setCookie('user_role', normalizedRole);
    this.setCookie('user_name', name);
    this.setCookie('user_email', email);

    this.isLoggedIn.set(loggedIn);
    this.userRole.set(normalizedRole);
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
