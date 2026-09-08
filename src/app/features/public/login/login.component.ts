import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  email = signal<string>('');
  password = signal<string>('');
  loading = signal<boolean>(false);
  error = signal<string>('');
  info = signal<string>('');
  returnUrl = signal<string | null>(null);

  // Forgot Password modal state
  showForgotModal = signal<boolean>(false);
  forgotEmail = signal<string>('');
  forgotLoading = signal<boolean>(false);
  forgotSuccess = signal<string>('');
  forgotError = signal<string>('');

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.returnUrl.set(params['returnUrl'] || null);

      const reg = params['registered'];
      if (reg === 'true') {
        this.info.set('Account created successfully! Please log in.');
      }

      const err = params['error'] || params['message'];
      if (err) {
        this.error.set(decodeURIComponent(err));
      }

      // Check for OAuth tokens returned in query params
      const token = params['token'] || params['accessToken'] || params['jwt'] || params['id_token'];
      if (token) {
        const refreshToken = params['refreshToken'] || params['refresh_token'];
        const role = params['role'];
        const name = params['name'] || params['userName'];
        const email = params['email'];
        this.authService.handleOAuthSuccess(token, refreshToken, role, name, email);
        this.authService.navigateAfterAuth(this.returnUrl());
      }
    });
  }

  forgotResetUrl = signal<string>('');
  forgotResetToken = signal<string>('');

  openForgotPassword(event?: Event): void {
    if (event) event.preventDefault();
    this.forgotEmail.set(this.email() || '');
    this.forgotSuccess.set('');
    this.forgotError.set('');
    this.forgotResetUrl.set('');
    this.forgotResetToken.set('');
    this.showForgotModal.set(true);
  }

  closeForgotPassword(): void {
    this.showForgotModal.set(false);
  }

  handleForgotPasswordSubmit(): void {
    const identifier = this.forgotEmail().trim();
    if (!identifier) {
      this.forgotError.set('Please enter your registered mobile number or email address.');
      return;
    }

    this.forgotLoading.set(true);
    this.forgotError.set('');
    this.forgotSuccess.set('');

    this.authService.forgotPassword(identifier).subscribe({
      next: (res: any) => {
        this.forgotLoading.set(false);
        const data = res?.data || res || {};
        const msg = data.message || res?.message || 'Password reset OTP has been sent to your WhatsApp and email.';
        this.forgotSuccess.set(msg);
        if (data.resetToken || data.otpCode) {
          this.forgotResetToken.set(data.resetToken || data.otpCode);
        }
        if (data.resetUrl) {
          this.forgotResetUrl.set(data.resetUrl);
        }
      },
      error: (err: any) => {
        this.forgotLoading.set(false);
        const msg = err?.error?.message || err?.error?.error || 'Failed to send WhatsApp OTP. Please verify your phone or email.';
        this.forgotError.set(msg);
      }
    });
  }

  handleGoogleLogin(): void {
    this.authService.loginWithGoogle(this.returnUrl() || undefined);
  }

  handleLogin(): void {
    this.error.set('');
    if (!this.email().trim() || !this.password().trim()) {
      this.error.set('Please fill in all fields');
      return;
    }

    this.loading.set(true);
    this.authService.login({ email: this.email(), password: this.password() }).subscribe({
      next: () => {
        this.loading.set(false);
        this.authService.navigateAfterAuth(this.returnUrl());
      },
      error: (err) => {
        this.loading.set(false);
        const errData = err?.error || {};
        const msg = errData.message || errData.error || (typeof err?.error === 'string' ? err.error : null) || 'Invalid login credentials. Please try again.';
        this.error.set(msg);
      }
    });
  }
}
