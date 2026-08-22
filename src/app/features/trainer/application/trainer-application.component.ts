import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-trainer-application',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <main class="p-6 max-w-3xl mx-auto text-xs text-on-surface">
      <div class="bg-surface-container-lowest border border-outline-variant/35 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
        <div class="flex justify-between items-start border-b border-outline-variant/20 pb-4">
          <div>
            <h1 class="text-xl font-bold">Trainer Status: Approved Instructor</h1>
            <p class="text-xs text-on-surface-variant">Applicant: {{ authService.userName() }} • {{ authService.userEmail() }}</p>
          </div>
          <span class="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800">
            Active Trainer
          </span>
        </div>

        <p class="text-xs text-on-surface-variant leading-relaxed">
          Your trainer profile and background checks have been verified. You have full instructor permissions to schedule live Zoom masterclasses, upload course materials, and review student gallery projects.
        </p>

        <div class="pt-2 flex gap-3">
          <a routerLink="/trainer/dashboard" class="px-5 py-2.5 bg-primary text-on-primary font-semibold rounded-lg hover:opacity-90">
            Open Trainer Workspace
          </a>
        </div>
      </div>
    </main>
  `
})
export class TrainerApplicationComponent {
  authService = inject(AuthService);
}
