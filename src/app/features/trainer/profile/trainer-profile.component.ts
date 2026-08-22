import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-trainer-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <main class="p-6 max-w-xl mx-auto text-xs text-on-surface">
      <div class="bg-surface-container-lowest border border-outline-variant/35 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
        <div class="text-center">
          <div class="w-16 h-16 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-xl mx-auto mb-3">
            {{ authService.userName().charAt(0) || 'T' }}
          </div>
          <h2 class="playfair text-xl font-bold text-on-surface">{{ authService.userName() }}</h2>
          <p class="text-on-surface-variant capitalize mt-0.5">Certified Master Instructor</p>
        </div>

        <div class="border-t border-outline-variant/20 pt-4 space-y-3">
          <div class="flex justify-between py-2 border-b border-outline-variant/10">
            <span class="font-semibold text-on-surface-variant">Email Address</span>
            <span>{{ authService.userEmail() }}</span>
          </div>
          <div class="flex justify-between py-2 border-b border-outline-variant/10">
            <span class="font-semibold text-on-surface-variant">Teaching Craft</span>
            <span>Traditional Lippan Art &amp; Mud Work</span>
          </div>
          <div class="flex justify-between py-2 border-b border-outline-variant/10">
            <span class="font-semibold text-on-surface-variant">Active Students</span>
            <span class="font-bold">450</span>
          </div>
        </div>

        <button 
          (click)="authService.logout()"
          class="w-full bg-surface-container text-on-surface font-semibold py-2.5 rounded-lg hover:bg-surface-dim transition-colors cursor-pointer">
          Sign Out
        </button>
      </div>
    </main>
  `
})
export class TrainerProfileComponent {
  authService = inject(AuthService);
}
