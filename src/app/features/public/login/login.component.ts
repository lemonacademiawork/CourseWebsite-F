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
  otpSent = signal<boolean>(false);
  forgotEmail = signal<string>('');
  forgotOtp = signal<string>('');
  forgotNewPass = signal<string>('');
  forgotConfirmPass = signal<string>('');
  showForgotPass = signal<boolean>(false);
  forgotLoading = signal<boolean>(false);
  forgotError = signal<string>('');
  forgotOtpMessage = signal<string>('');
  forgotResendCountdown = signal<number>(0);
  private forgotTimerInterval: any = null;

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

  openForgotPassword(event?: Event): void {
    if (event) event.preventDefault();
    const initial = (this.email() || '').trim();
    this.forgotEmail.set(initial.length >= 5 ? initial : '');
    this.forgotOtp.set('');
    this.forgotNewPass.set('');
    this.forgotConfirmPass.set('');
    this.forgotError.set('');
    this.forgotOtpMessage.set('');
    this.otpSent.set(false);
    this.showForgotModal.set(true);
  }

  closeForgotPassword(): void {
    this.showForgotModal.set(false);
    this.otpSent.set(false);
    this.forgotError.set('');
    this.forgotOtpMessage.set('');
    if (this.forgotTimerInterval) {
      clearInterval(this.forgotTimerInterval);
    }
  }

  startForgotResendTimer(): void {
    this.forgotResendCountdown.set(45);
    if (this.forgotTimerInterval) clearInterval(this.forgotTimerInterval);
    this.forgotTimerInterval = setInterval(() => {
      if (this.forgotResendCountdown() > 0) {
        this.forgotResendCountdown.update(v => v - 1);
      } else {
        clearInterval(this.forgotTimerInterval);
      }
    }, 1000);
  }

  handleForgotPasswordSubmit(): void {
    if (!this.otpSent()) {
      this.handleSendOtp();
    } else {
      this.handleResetPassword();
    }
  }

  handleSendOtp(): void {
    const identifier = this.forgotEmail().trim();
    if (!identifier) {
      this.forgotError.set('Please enter your email or phone number.');
      return;
    }

    this.forgotLoading.set(true);
    this.forgotError.set('');
    this.forgotOtpMessage.set('');

    this.authService.forgotPassword(identifier).subscribe({
      next: (res: any) => {
        this.forgotLoading.set(false);
        const data = res?.data || res || {};
        const msg = data.message || res?.message || 'OTP code sent! Check your WhatsApp.';
        this.forgotOtpMessage.set(msg);
        this.otpSent.set(true);
        this.startForgotResendTimer();
      },
      error: (err: any) => {
        this.forgotLoading.set(false);
        const msg = err?.error?.message || err?.error?.error || 'User not found. Please verify your email or phone number.';
        this.forgotError.set(msg);
      }
    });
  }

  handleResetPassword(): void {
    const code = this.forgotOtp().trim();
    const phoneNum = this.forgotEmail().trim();
    const pass = this.forgotNewPass();
    const confirm = this.forgotConfirmPass();

    if (!phoneNum) {
      this.forgotError.set('Please enter your email or phone number.');
      return;
    }

    if (!code) {
      this.forgotError.set('Please enter the 6-digit OTP code.');
      return;
    }

    if (!pass || pass.length < 6) {
      this.forgotError.set('Password must be at least 6 characters long.');
      return;
    }

    if (pass !== confirm) {
      this.forgotError.set('Passwords do not match. Please re-enter.');
      return;
    }

    this.forgotLoading.set(true);
    this.forgotError.set('');

    this.authService.resetPassword(code, pass, phoneNum).subscribe({
      next: () => {
        this.forgotLoading.set(false);
        this.info.set('Password reset successfully. Please log in.');
        this.email.set(phoneNum);
        this.password.set('');
        this.closeForgotPassword();
      },
      error: (err: any) => {
        this.forgotLoading.set(false);
        const msg = err?.error?.message || err?.error?.error || (typeof err?.error === 'string' ? err.error : null) || 'Invalid or expired OTP code. Please try again.';
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
