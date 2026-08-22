import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
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
export class SignupComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  name = signal<string>('');
  email = signal<string>('');
  password = signal<string>('');
  loading = signal<boolean>(false);
  error = signal<string>('');

  handleSignup(): void {
    this.error.set('');

    if (!this.name().trim() || !this.email().trim() || !this.password().trim()) {
      this.error.set('Please fill in all fields');
      return;
    }

    if (this.password().length < 6) {
      this.error.set('Password must be at least 6 characters long');
      return;
    }

    this.loading.set(true);
    this.authService.register({
      name: this.name(),
      email: this.email(),
      password: this.password()
    }).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/login'], { queryParams: { registered: 'true' } });
      },
      error: (err) => {
        this.loading.set(false);
        const data = err.error || {};
        this.error.set(data.message || 'Registration failed. The server returned an error.');
      }
    });
  }
}
