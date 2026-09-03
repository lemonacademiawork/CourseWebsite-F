import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { EnrollmentService } from '../../../core/services/enrollment.service';

@Component({
  selector: 'app-refer-and-earn',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './refer-and-earn.component.html'
})
export class ReferAndEarnComponent implements OnInit {
  private authService = inject(AuthService);
  private enrollmentService = inject(EnrollmentService);

  isEligible = signal<boolean | null>(null);
  referralCode = signal<string>('');
  copySuccess = signal<boolean>(false);

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.isEligible.set(false);
      return;
    }

    // Check eligibility via real enrollment API
    this.enrollmentService.getEnrollments().subscribe({
      next: (enrollments) => {
        const eligible = Array.isArray(enrollments) && enrollments.length > 0;
        this.isEligible.set(eligible);
      },
      error: () => {
        this.isEligible.set(false);
      }
    });

    const email = this.authService.userEmail() || 'user';
    const code = email.split('@')[0] + '20';
    this.referralCode.set(code.toUpperCase());
  }

  handleCopy(): void {
    const link = `https://course-website-f.vercel.app/signup?ref=${this.referralCode()}`;
    navigator.clipboard.writeText(link);
    this.copySuccess.set(true);
    setTimeout(() => this.copySuccess.set(false), 2000);
  }
}

