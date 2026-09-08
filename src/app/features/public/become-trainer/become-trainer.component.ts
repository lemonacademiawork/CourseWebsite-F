import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { TrainerRequestService } from '../../../core/services/trainer-request.service';

@Component({
  selector: 'app-become-trainer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './become-trainer.component.html'
})
export class BecomeTrainerComponent implements OnInit {
  private authService = inject(AuthService);
  private trainerRequestService = inject(TrainerRequestService);
  private router = inject(Router);

  submitted = signal<boolean>(false);
  loading = signal<boolean>(false);
  error = signal<string>('');

  name = signal<string>('');
  email = signal<string>('');
  phone = signal<string>('');
  course = signal<string>('');
  runningDates = signal<string>('');
  experience = signal<string>('');
  bio = signal<string>('');
  portfolioUrl = signal<string>('');
  sampleVideoUrl = signal<string>('');

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.name.set(this.authService.userName() || '');
      this.email.set(this.authService.userEmail() || '');
    }
  }

  scrollToForm(): void {
    if (typeof document !== 'undefined') {
      const el = document.getElementById('application-form');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  handleApply(): void {
    if (!this.name().trim() || !this.email().trim() || !this.course().trim()) {
      this.error.set('Please fill in all required fields.');
      return;
    }

    this.loading.set(true);
    this.error.set('');

    const expNumber = parseInt(String(this.experience() || '').replace(/\D/g, ''), 10) || 1;

    const applicationData = {
      name: this.name().trim(),
      fullName: this.name().trim(),
      email: this.email().trim(),
      phone: this.phone().trim() || '+910000000000',
      course: this.course().trim(),
      expertise: this.course().trim(),
      experience: String(this.experience() || expNumber),
      yearsOfExperience: expNumber,
      runningDates: this.runningDates().trim() || 'Flexible Schedule',
      bio: this.bio().trim() || `Trainer application for ${this.course().trim()}.${this.runningDates() ? ' Proposed schedule: ' + this.runningDates().trim() : ''}`,
      portfolioUrl: this.portfolioUrl().trim() || undefined,
      portfolio: this.portfolioUrl().trim() || undefined,
      sampleVideoUrl: this.sampleVideoUrl().trim() || undefined,
      videoUrl: this.sampleVideoUrl().trim() || undefined
    };

    this.trainerRequestService.submitApplication(applicationData).subscribe({
      next: () => {
        this.loading.set(false);
        this.submitted.set(true);
      },
      error: (err) => {
        this.loading.set(false);
        const msg = err?.error?.message || err?.error?.error || (typeof err?.error === 'string' ? err.error : null) || 'Failed to submit application. Please try again.';
        this.error.set(msg);
      }
    });
  }
}
