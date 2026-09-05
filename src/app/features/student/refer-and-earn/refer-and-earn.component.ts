import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { EnrollmentService } from '../../../core/services/enrollment.service';
import { ReferralService } from '../../../core/services/referral.service';
import { ReferralSummary, ReferralCommission } from '../../../core/models/referral.model';

@Component({
  selector: 'app-refer-and-earn',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './refer-and-earn.component.html'
})
export class ReferAndEarnComponent implements OnInit {
  private authService = inject(AuthService);
  private enrollmentService = inject(EnrollmentService);
  private referralService = inject(ReferralService);

  isEligible = signal<boolean | null>(null);
  referralCode = signal<string>('');
  referralSummary = signal<ReferralSummary | null>(null);
  commissions = signal<ReferralCommission[]>([]);
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
        if (eligible) {
          this.loadReferralData();
        }
      },
      error: () => {
        this.isEligible.set(true); // Fallback to accessible
        this.loadReferralData();
      }
    });

    const email = this.authService.userEmail() || 'user';
    const code = email.split('@')[0] + '20';
    this.referralCode.set(code.toUpperCase());
  }

  loadReferralData(): void {
    this.referralService.getMyReferrals().subscribe({
      next: (summary) => {
        if (summary) {
          this.referralSummary.set(summary);
          if (summary.referralCode) {
            this.referralCode.set(summary.referralCode);
          }
        }
      }
    });

    this.referralService.getMyCommissions().subscribe({
      next: (list) => {
        if (list) {
          this.commissions.set(list);
        }
      }
    });
  }

  handleCopy(): void {
    const link = `https://course-website-f.vercel.app/signup?ref=${this.referralCode()}`;
    navigator.clipboard.writeText(link);
    this.copySuccess.set(true);
    setTimeout(() => this.copySuccess.set(false), 2000);
  }
}


