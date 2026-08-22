import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-applications-review',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <main class="p-6 max-w-3xl mx-auto text-xs text-on-surface">
      <div class="mb-6 flex items-center justify-between">
        <a routerLink="/admin/applications" class="text-primary hover:underline font-semibold flex items-center gap-1">
          <span class="material-symbols-outlined text-[16px]">arrow_back</span>
          Back to Applications
        </a>
      </div>

      <div class="bg-surface-container-lowest border border-outline-variant/35 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
        <div class="flex justify-between items-start border-b border-outline-variant/20 pb-4">
          <div>
            <h1 class="text-xl font-bold">Application Review: Rohit Verma</h1>
            <p class="text-xs text-on-surface-variant">Ceramic Pottery Basics • Submitted Aug 18, 2026</p>
          </div>
          <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800">
            {{ decision() }}
          </span>
        </div>

        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <span class="text-on-surface-variant font-semibold">Email</span>
              <p class="font-medium text-on-surface mt-0.5">rohit.verma&#64;example.com</p>
            </div>
            <div>
              <span class="text-on-surface-variant font-semibold">Experience</span>
              <p class="font-medium text-on-surface mt-0.5">6 Years of Studio Teaching</p>
            </div>
          </div>

          <div>
            <span class="text-on-surface-variant font-semibold">Proposed Syllabus</span>
            <p class="text-xs text-on-surface-variant leading-relaxed mt-1">
              Introduction to clay throwing, wedging, centering on the electric wheel, trimming, bisque firing, and glaze formulation for stoneware pottery.
            </p>
          </div>

          <div>
            <span class="text-on-surface-variant font-semibold">Portfolio Link</span>
            <p class="mt-1">
              <a href="#" class="text-primary font-semibold hover:underline">https://rohitpottery.art/showcase</a>
            </p>
          </div>
        </div>

        <div class="pt-4 border-t border-outline-variant/20 flex gap-3">
          <button 
            (click)="handleDecision('Approved')"
            class="flex-1 py-2.5 bg-primary text-on-primary font-semibold rounded-lg hover:opacity-90 transition-opacity cursor-pointer">
            Approve &amp; Grant Trainer Role
          </button>
          <button 
            (click)="handleDecision('Rejected')"
            class="px-5 py-2.5 bg-surface-container text-on-surface font-semibold rounded-lg hover:bg-surface-dim transition-colors cursor-pointer">
            Decline Application
          </button>
        </div>
      </div>
    </main>
  `
})
export class AdminApplicationsReviewComponent {
  decision = signal<'Pending Approval' | 'Approved' | 'Rejected'>('Pending Approval');

  handleDecision(dec: 'Approved' | 'Rejected'): void {
    this.decision.set(dec);
  }
}
