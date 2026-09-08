import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-auth-callback',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <main class="min-h-screen bg-[#FBF8F1] text-[#1C1A17] relative flex items-center justify-center py-12 px-4">
      <div class="index-card p-8 md:p-10 max-w-md w-full text-center space-y-6 relative z-10 shadow-lg">
        <div class="card-tape"></div>
        <div class="flex flex-col items-center justify-center gap-3">
          <img src="/logo.png" alt="Lemon Academia Logo" class="w-14 h-14 rounded-full object-cover shadow-sm" />
          <h2 class="playfair font-bold text-2xl text-[#1C1A17]">Signing you in...</h2>
        </div>

        @if (error()) {
          <div class="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm space-y-3">
            <div class="flex items-center justify-center gap-2">
              <span class="material-symbols-outlined text-red-600">error</span>
              <p class="font-medium">{{ error() }}</p>
            </div>
            <a routerLink="/login" class="inline-block px-4 py-2 bg-[#6E5410] text-white font-semibold text-xs rounded hover:bg-[#5c4610] transition-colors">
              Return to Login
            </a>
          </div>
        } @else {
          <div class="space-y-4 py-4">
            <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#E8C468]/20 text-[#6E5410]">
              <span class="material-symbols-outlined animate-spin text-2xl">progress_activity</span>
            </div>
            <p class="text-sm text-[#5B5650] leading-relaxed">
              {{ statusMessage() }}
            </p>
          </div>
        }
      </div>
    </main>
  `,
  styles: [`
    .index-card {
      background: #FFFFFF;
      border: 1px solid #E7E1D3;
      border-radius: 8px;
      position: relative;
    }
    .card-tape {
      position: absolute;
      top: -12px;
      left: 50%;
      transform: translateX(-50%);
      width: 80px;
      height: 24px;
      background: rgba(232, 196, 104, 0.4);
      border: 1px dashed rgba(110, 84, 16, 0.3);
      border-radius: 2px;
    }
    .playfair {
      font-family: 'Playfair Display', serif;
    }
  `]
})
export class AuthCallbackComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  statusMessage = signal<string>('Authenticating with Google and preparing your workbench...');
  error = signal<string>('');

  ngOnInit(): void {
    this.processCallback();
  }

  private processCallback(): void {
    // 1. Check query parameters
    const qp = this.route.snapshot.queryParams;
    let token = qp['token'] || qp['accessToken'] || qp['jwt'] || qp['id_token'] || '';
    const refreshToken = qp['refreshToken'] || qp['refresh_token'] || '';
    const role = qp['role'] || '';
    const name = qp['name'] || qp['userName'] || '';
    const email = qp['email'] || '';
    const returnUrl = qp['returnUrl'] || null;
    const err = qp['error'] || qp['message'] || '';

    // 2. Check fragment / hash if not in query params (e.g., #token=... or #access_token=...)
    if (!token && typeof window !== 'undefined' && window.location.hash) {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      token = hashParams.get('token') || hashParams.get('accessToken') || hashParams.get('access_token') || hashParams.get('id_token') || '';
    }

    if (err) {
      this.error.set(decodeURIComponent(err));
      return;
    }

    if (token) {
      this.statusMessage.set('Login successful! Redirecting...');
      this.authService.handleOAuthSuccess(token, refreshToken, role, name, email);
      setTimeout(() => {
        this.authService.navigateAfterAuth(returnUrl);
      }, 400);
      return;
    }

    // Check if session was already authenticated via cookie
    this.authService.loadAuthState();
    if (this.authService.isLoggedIn()) {
      this.statusMessage.set('Welcome back! Redirecting...');
      setTimeout(() => {
        this.authService.navigateAfterAuth(returnUrl);
      }, 300);
      return;
    }

    // If no token or login detected, redirect to login
    this.error.set('No authentication token received from Google. Please try logging in again.');
  }
}
