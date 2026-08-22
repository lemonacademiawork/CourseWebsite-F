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
        const role = this.authService.userRole();
        if (role === 'admin') {
          this.router.navigate(['/admin/dashboard']);
        } else if (role === 'trainer') {
          this.router.navigate(['/trainer/dashboard']);
        } else if (this.returnUrl()) {
          this.router.navigateByUrl(this.returnUrl()!);
        } else {
          this.router.navigate(['/']);
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
