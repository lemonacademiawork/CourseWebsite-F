import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  name = signal<string>('');
  email = signal<string>('');
  phone = signal<string>('');
  password = signal<string>('');
  loading = signal<boolean>(false);
  error = signal<string>('');
  returnUrl = signal<string | null>(null);

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.returnUrl.set(params['returnUrl'] || null);

      const err = params['error'] || params['message'];
      if (err) {
        this.error.set(decodeURIComponent(err));
      }

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

  handleGoogleLogin(): void {
    this.authService.loginWithGoogle(this.returnUrl() || undefined);
  }

  handleSignup(): void {
    this.error.set('');

    if (!this.name().trim() || !this.email().trim() || !this.password().trim()) {
      this.error.set('Please fill in all required fields');
      return;
    }

    if (this.password().length < 6) {
      this.error.set('Password must be at least 6 characters long');
      return;
    }

    this.loading.set(true);
    this.authService.register({
      name: this.name().trim(),
      email: this.email().trim(),
      phone: this.phone().trim() || undefined,
      password: this.password()
    }).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/login'], { queryParams: { registered: 'true' } });
      },
      error: (err) => {
        this.loading.set(false);
        const data = err?.error || {};
        const msg = data.message || data.error || (typeof err?.error === 'string' ? err.error : null) || 'Registration failed. Please check your details.';
        this.error.set(msg);
      }
    });
  }
}

