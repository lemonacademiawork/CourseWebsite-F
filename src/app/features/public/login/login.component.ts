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
      } else if (reg === 'mock') {
        this.info.set('Account created (Local Mock)! Please log in.');
      }
    });
  }

  openForgotPassword(event?: Event): void {
    if (event) event.preventDefault();
    this.forgotEmail.set(this.email() || '');
    this.forgotSuccess.set('');
    this.forgotError.set('');
    this.showForgotModal.set(true);
  }

  closeForgotPassword(): void {
    this.showForgotModal.set(false);
  }

  handleForgotPasswordSubmit(): void {
    const email = this.forgotEmail().trim();
    if (!email) {
      this.forgotError.set('Please enter your registered email address.');
      return;
    }

    this.forgotLoading.set(true);
    this.forgotError.set('');
    this.forgotSuccess.set('');

    this.authService.forgotPassword(email).subscribe({
      next: (res: any) => {
        this.forgotLoading.set(false);
        const msg = res?.message || 'Password reset link and instructions have been sent to your email.';
        this.forgotSuccess.set(msg);
      },
      error: (err: any) => {
        this.forgotLoading.set(false);
        // Even if server returns 404/generic, show friendly guidance
        const msg = err?.error?.message || 'Failed to send reset link. Please verify your email address.';
        this.forgotError.set(msg);
      }
    });
  }

  handleGoogleLogin(): void {
    this.authService.loginWithGoogle();
  }


  handleLogin(): void {
    this.error.set('');
    if (!this.email().trim() || !this.password().trim()) {
      this.error.set('Please fill in all fields');
      return;
    }

    this.loading.set(true);
    this.authService.login({ email: this.email(), password: this.password() }).subscribe({
      next: (res) => {
        this.loading.set(false);
        const role = (this.authService.userRole() || '').toLowerCase();
        const returnUrl = this.returnUrl();

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
          if (returnUrl && !returnUrl.startsWith('/admin') && !returnUrl.startsWith('/trainer') && !returnUrl.startsWith('/403')) {
            this.router.navigateByUrl(returnUrl);
          } else {
            this.router.navigate(['/']);
          }
        }
      },
      error: (err) => {
        this.loading.set(false);
        const errData = err.error || {};
        this.error.set(errData.message || 'Invalid email or password.');
      }
    });
  }
}
