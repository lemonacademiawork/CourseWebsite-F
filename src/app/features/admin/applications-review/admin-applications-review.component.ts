import { Component, signal, inject, OnInit } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TrainerRequestService } from '../../../core/services/trainer-request.service';
import { TrainerRequest } from '../../../core/models/trainer-request.model';

@Component({
  selector: 'app-admin-applications-review',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <main class="p-6 max-w-3xl mx-auto text-xs text-on-surface">
      <div class="mb-6 flex items-center justify-between">
        <a routerLink="/admin/applications" class="text-primary hover:underline font-semibold flex items-center gap-1">
          <span class="material-symbols-outlined text-[16px]">arrow_back</span>
          Back to Applications
        </a>
      </div>

      @if (loading()) {
        <div class="p-8 text-center bg-surface-container-low rounded-2xl text-on-surface-variant">
          <p class="font-semibold text-xs text-on-surface">Loading Application Details...</p>
        </div>
      } @else if (app()) {
        <div class="bg-surface-container-lowest border border-outline-variant/35 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
          <div class="flex justify-between items-start border-b border-outline-variant/20 pb-4">
            <div>
              <h1 class="text-xl font-bold">Application: {{ app()!.fullName || app()!.name }}</h1>
              <p class="text-xs text-on-surface-variant">{{ app()!.expertise || app()!.course }} • Submitted {{ app()!.createdAt | date:'mediumDate' }}</p>
            </div>
            <span 
              class="px-2.5 py-1 rounded-full text-xs font-bold"
              [class.bg-yellow-100]="app()!.status === 'PENDING' || app()!.status === 'Pending Approval'"
              [class.text-yellow-800]="app()!.status === 'PENDING' || app()!.status === 'Pending Approval'"
              [class.bg-green-100]="app()!.status === 'APPROVED' || app()!.status === 'Approved'"
              [class.text-green-800]="app()!.status === 'APPROVED' || app()!.status === 'Approved'"
              [class.bg-red-100]="app()!.status === 'REJECTED' || app()!.status === 'Rejected'"
              [class.text-red-800]="app()!.status === 'REJECTED' || app()!.status === 'Rejected'">
              {{ app()!.status }}
            </span>
          </div>

          @if (actionSuccess()) {
            <div class="bg-green-50 border border-green-200 text-green-700 p-3 rounded-lg text-xs">
              {{ actionSuccess() }}
            </div>
          }

          @if (actionError()) {
            <div class="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-xs">
              {{ actionError() }}
            </div>
          }

          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <span class="text-on-surface-variant font-semibold">Email</span>
                <p class="font-medium text-on-surface mt-0.5">{{ app()!.email }}</p>
              </div>
              <div>
                <span class="text-on-surface-variant font-semibold">Phone</span>
                <p class="font-medium text-on-surface mt-0.5">{{ app()!.phone || 'Not provided' }}</p>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <span class="text-on-surface-variant font-semibold">Subject / Expertise</span>
                <p class="font-medium text-on-surface mt-0.5">{{ app()!.expertise || app()!.course }}</p>
              </div>
              <div>
                <span class="text-on-surface-variant font-semibold">Experience</span>
                <p class="font-medium text-on-surface mt-0.5">{{ app()!.yearsOfExperience || app()!.experience }} Years</p>
              </div>
            </div>

            <div>
              <span class="text-on-surface-variant font-semibold">Bio / Background</span>
              <p class="text-xs text-on-surface-variant leading-relaxed mt-1 whitespace-pre-line">
                {{ app()!.bio || 'No bio provided.' }}
              </p>
            </div>

            @if (app()!.portfolioUrl) {
              <div>
                <span class="text-on-surface-variant font-semibold">Portfolio Link</span>
                <p class="mt-1">
                  <a [href]="app()!.portfolioUrl" target="_blank" rel="noopener noreferrer" class="text-primary font-semibold hover:underline">
                    {{ app()!.portfolioUrl }}
                  </a>
                </p>
              </div>
            }

            @if (app()!.sampleVideoUrl) {
              <div>
                <span class="text-on-surface-variant font-semibold">Sample Teaching Video</span>
                <p class="mt-1">
                  <a [href]="app()!.sampleVideoUrl" target="_blank" rel="noopener noreferrer" class="text-primary font-semibold hover:underline">
                    {{ app()!.sampleVideoUrl }}
                  </a>
                </p>
              </div>
            }

            @if (app()!.resumeUrl) {
              <div>
                <span class="text-on-surface-variant font-semibold">Resume / CV</span>
                <p class="mt-1">
                  <a [href]="app()!.resumeUrl" target="_blank" rel="noopener noreferrer" class="text-primary font-semibold hover:underline">
                    View Resume Document
                  </a>
                </p>
              </div>
            }

            <div class="pt-2">
              <label class="block font-semibold text-on-surface-variant mb-1">Feedback / Notes to Applicant</label>
              <textarea 
                [ngModel]="feedbackNotes()"
                (ngModelChange)="feedbackNotes.set($event)"
                placeholder="Optional comments or onboarding notes"
                rows="3"
                class="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-primary focus:outline-none">
              </textarea>
            </div>
          </div>

          <div class="pt-4 border-t border-outline-variant/20 flex gap-3">
            <button 
              (click)="handleDecision('APPROVED')"
              [disabled]="submitting()"
              class="flex-1 py-2.5 bg-primary text-on-primary font-semibold rounded-lg hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50">
              {{ submitting() ? 'Processing...' : 'Approve & Grant Trainer Role' }}
            </button>
            <button 
              (click)="handleDecision('REJECTED')"
              [disabled]="submitting()"
              class="px-5 py-2.5 bg-surface-container text-on-surface font-semibold rounded-lg hover:bg-surface-dim transition-colors cursor-pointer disabled:opacity-50">
              Decline Application
            </button>
          </div>
        </div>
      }
    </main>
  `
})
export class AdminApplicationsReviewComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private trainerRequestService = inject(TrainerRequestService);

  app = signal<TrainerRequest | null>(null);
  loading = signal<boolean>(true);
  submitting = signal<boolean>(false);
  feedbackNotes = signal<string>('');
  actionSuccess = signal<string>('');
  actionError = signal<string>('');

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.trainerRequestService.getApplicationById(id).subscribe({
        next: (data) => {
          this.app.set(data);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
        }
      });
    } else {
      // If no ID in route, load first pending or list
      this.trainerRequestService.getAllApplications().subscribe({
        next: (list) => {
          if (list.length > 0) {
            this.app.set(list[0]);
          }
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
        }
      });
    }
  }

  handleDecision(dec: 'APPROVED' | 'REJECTED'): void {
    const current = this.app();
    if (!current?.id) return;

    this.submitting.set(true);
    this.actionSuccess.set('');
    this.actionError.set('');

    this.trainerRequestService.reviewApplication(current.id, {
      status: dec,
      feedbackNotes: this.feedbackNotes() || undefined
    }).subscribe({
      next: () => {
        this.submitting.set(false);
        this.actionSuccess.set(`Application ${dec.toLowerCase()} successfully! User promoted to Trainer.`);
        this.app.update(a => a ? { ...a, status: dec } : null);
        setTimeout(() => {
          this.router.navigate(['/admin/applications']);
        }, 1500);
      },
      error: (err) => {
        this.submitting.set(false);
        this.actionError.set(err?.error?.message || `Failed to update application status.`);
      }
    });
  }
}
