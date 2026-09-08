import { Component, OnInit, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  // Step 1: Send OTP to phone/email
  // Step 2: Enter OTP code + New Password
  step = signal<1 | 2>(1);

  phone = signal<string>('');
  token = signal<string>('');
  newPassword = signal<string>('');
  confirmPassword = signal<string>('');

  isLoading = signal<boolean>(false);
  isSuccess = signal<boolean>(false);
  stepSuccessMessage = signal<string>('');
  errorMessage = signal<string>('');
  showPassword = signal<boolean>(false);

  // Resend countdown timer
  resendCountdown = signal<number>(0);
  private timerInterval: any = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const tokenParam = params['token'] || this.route.snapshot.paramMap.get('token');
      const phoneParam = params['phone'];
      const emailParam = params['email'];

      if (phoneParam) {
        this.phone.set(phoneParam);
      } else if (emailParam) {
        this.phone.set(emailParam);
      }

      if (tokenParam) {
        this.token.set(tokenParam);
        this.step.set(2);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword.update(val => !val);
  }

  goToStep(s: 1 | 2): void {
    this.errorMessage.set('');
    this.step.set(s);
  }

  startResendTimer(): void {
    this.resendCountdown.set(45);
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      if (this.resendCountdown() > 0) {
        this.resendCountdown.update(v => v - 1);
      } else {
        clearInterval(this.timerInterval);
      }
    }, 1000);
  }

  submitSendOtp(): void {
    const identifier = this.phone().trim();
    if (!identifier) {
      this.errorMessage.set('Please enter your mobile number or email address.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');
    this.stepSuccessMessage.set('');

    this.authService.forgotPassword(identifier).subscribe({
      next: (res: any) => {
        this.isLoading.set(false);
        const data = res?.data || res || {};
        const msg = data.message || res?.message || 'A 6-digit WhatsApp OTP code has been sent!';
        this.stepSuccessMessage.set(msg);
        if (data.resetToken || data.otpCode) {
          this.token.set(data.resetToken || data.otpCode);
        }
        this.step.set(2);
        this.startResendTimer();
      },
      error: (err: any) => {
        this.isLoading.set(false);
        this.errorMessage.set(err?.error?.message || err?.error?.error || 'User not found. Please check your mobile number or email.');
      }
    });
  }

  submitReset(): void {
    const t = this.token().trim();
    const phoneNum = this.phone().trim();
    const pass = this.newPassword();
    const confirm = this.confirmPassword();

    if (!phoneNum) {
      this.errorMessage.set('Please provide your registered mobile number or email.');
      return;
    }

    if (!t) {
      this.errorMessage.set('Please enter the 6-digit OTP code received on WhatsApp.');
      return;
    }

    if (!pass || pass.length < 6) {
      this.errorMessage.set('Password must be at least 6 characters long.');
      return;
    }

    if (pass !== confirm) {
      this.errorMessage.set('Passwords do not match. Please re-enter.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.authService.resetPassword(t, pass, phoneNum).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.isSuccess.set(true);
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2500);
      },
      error: (err: any) => {
        this.isLoading.set(false);
        const msg = err?.error?.message || err?.error?.error || (typeof err?.error === 'string' ? err.error : null) || 'Invalid or expired OTP code. Please request a new code.';
        this.errorMessage.set(msg);
      }
    });
  }
}

