import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { CourseService } from '../../../core/services/course.service';

@Component({
  selector: 'app-refer-and-earn',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './refer-and-earn.component.html'
})
export class ReferAndEarnComponent implements OnInit {
  private authService = inject(AuthService);
  private courseService = inject(CourseService);

  isEligible = signal<boolean | null>(null);
  referralCode = signal<string>('');
  copySuccess = signal<boolean>(false);

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.isEligible.set(false);
      return;
    }

    const purchased = this.courseService.getPurchasedCourses();
    const eligible = Array.isArray(purchased) && purchased.length > 0;
    this.isEligible.set(eligible);

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
