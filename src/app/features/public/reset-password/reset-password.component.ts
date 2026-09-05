import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './reset-password.component.html'
})
export class ResetPasswordComponent implements OnInit {
  mode = signal<'reset' | 'request'>('reset');
  token = signal<string>('');
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
    const tokenParam = this.route.snapshot.queryParamMap.get('token') || this.route.snapshot.paramMap.get('token');
    if (tokenParam) {
      this.token.set(tokenParam);
      this.mode.set('reset');
    } else {
      // If no token in URL, start in request mode
      this.mode.set('request');
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword.update(val => !val);
  }

  submitRequestLink(): void {
    const em = this.email().trim();
    if (!em) {
      this.errorMessage.set('Please enter your account email address.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');
    this.requestSuccess.set('');

    this.authService.forgotPassword(em).subscribe({
      next: (res: any) => {
        this.isLoading.set(false);
        this.requestSuccess.set(res?.message || 'Password reset link and token have been sent to your email.');
      },
      error: (err: any) => {
        this.isLoading.set(false);
        this.errorMessage.set(err?.error?.message || 'Failed to send reset link. Please verify your email.');
      }
    });
  }

  submitReset(): void {
    const t = this.token().trim();
    const pass = this.newPassword();
    const confirm = this.confirmPassword();

    if (!t) {
      this.errorMessage.set('Reset token is required.');
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

    this.authService.resetPassword(t, pass).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.isSuccess.set(true);
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: (err: any) => {
        this.isLoading.set(false);
        this.errorMessage.set(err?.error?.message || 'Failed to reset password. The token may have expired.');
      }
    });
  }
}

