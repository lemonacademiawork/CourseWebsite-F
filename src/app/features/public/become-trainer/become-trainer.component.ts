import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CourseService } from '../../../core/services/course.service';

@Component({
  selector: 'app-become-trainer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './become-trainer.component.html'
})
export class BecomeTrainerComponent implements OnInit {
  private authService = inject(AuthService);
  private courseService = inject(CourseService);
  private router = inject(Router);

  submitted = signal<boolean>(false);
  loading = signal<boolean>(false);
  error = signal<string>('');

  name = signal<string>('');
  email = signal<string>('');
  course = signal<string>('');
  runningDates = signal<string>('');
  experience = signal<string>('');
  portfolioUrl = signal<string>('');

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.name.set(this.authService.userName());
      this.email.set(this.authService.userEmail());
    }
  }

  scrollToForm(): void {
    if (typeof document !== 'undefined') {
      const el = document.getElementById('application-form');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  handleApply(): void {
    this.loading.set(true);
    this.error.set('');

    const applicationData = {
      name: this.name(),
      email: this.email(),
      course: this.course(),
      runningDates: this.runningDates() || 'Awaiting Schedule',
      experience: this.experience(),
      portfolioUrl: this.portfolioUrl(),
      status: 'Pending Approval' as const
    };

    this.courseService.applyTrainer(applicationData).subscribe({
      next: () => {
        this.loading.set(false);
        this.submitted.set(true);
      },
      error: () => {
        // Fallback: save to localStorage
        if (typeof window !== 'undefined') {
          const apps = JSON.parse(localStorage.getItem('mock_applications') || '[]');
          apps.push({ id: Date.now(), ...applicationData });
          localStorage.setItem('mock_applications', JSON.stringify(apps));
        }
        this.loading.set(false);
        this.submitted.set(true);
      }
    });
  }
}
