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
  token = signal<string>('');
  newPassword = signal<string>('');
  confirmPassword = signal<string>('');
  isLoading = signal<boolean>(false);
  isSuccess = signal<boolean>(false);
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
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword.update(val => !val);
  }

  submitReset(): void {
    const t = this.token().trim();
    const pass = this.newPassword();
    const confirm = this.confirmPassword();

    if (!t) {
      this.errorMessage.set('Reset token is missing or expired. Please request a new link.');
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
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err?.error?.message || 'Failed to reset password. The link may have expired.');
      }
    });
  }
}
