import { Component, OnInit, signal } from '@angular/core';
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

export class ResetPasswordComponent implements OnInit {
  mode = signal<'reset' | 'request'>('reset');
  token = signal<string>('');
  phone = signal<string>('');
  email = signal<string>('');
  newPassword = signal<string>('');
  confirmPassword = signal<string>('');
  isLoading = signal<boolean>(false);
  isSuccess = signal<boolean>(false);
  requestSuccess = signal<string>('');
  errorMessage = signal<string>('');
  showPassword = signal<boolean>(false);

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

      if (tokenParam) {
        this.token.set(tokenParam);
        this.mode.set('reset');
      } else {
        this.mode.set('request');
      }

      if (phoneParam) {
        this.phone.set(phoneParam);
      }
      if (emailParam) {
        this.email.set(emailParam);
      }
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword.update(val => !val);
  }

  submitRequestLink(): void {
    const identifier = this.phone().trim() || this.email().trim();
    if (!identifier) {
      this.errorMessage.set('Please enter your mobile number or email address.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');
    this.requestSuccess.set('');

    this.authService.forgotPassword(identifier).subscribe({
      next: (res: any) => {
        this.isLoading.set(false);
        const data = res?.data || res || {};
        const msg = data.message || res?.message || 'A 6-digit verification OTP has been sent to your WhatsApp!';
        this.requestSuccess.set(msg);
        if (data.resetToken || data.otpCode) {
          this.token.set(data.resetToken || data.otpCode);
        }
      },
      error: (err: any) => {
        this.isLoading.set(false);
        this.errorMessage.set(err?.error?.message || 'Failed to send WhatsApp OTP. Please check your number.');
      }
    });
  }

  submitReset(): void {
    const t = this.token().trim();
    const phoneNum = this.phone().trim();
    const pass = this.newPassword();
    const confirm = this.confirmPassword();

    if (!t) {
      this.errorMessage.set('6-digit OTP code / reset token is required.');
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

    this.authService.resetPassword(t, pass, phoneNum || undefined).subscribe({
      next: (res: any) => {
        this.isLoading.set(false);
        this.isSuccess.set(true);
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: (err: any) => {
        this.isLoading.set(false);
        this.errorMessage.set(err?.error?.message || 'Failed to reset password. The OTP code may have expired or is incorrect.');
      }
    });
  }
}

