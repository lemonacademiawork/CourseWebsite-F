import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-trainer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="relative min-h-screen pb-4 text-xs">
      <div class="absolute inset-0 pointer-events-none opacity-20" style="background-image: radial-gradient(circle at 100% 0%, #ffe17a 0%, transparent 40%), radial-gradient(circle at 0% 100%, #fe9d7a 0%, transparent 40%)"></div>
      
      <div class="max-w-container-max mx-auto px-margin-mobile md:px-6 py-4 relative z-10 text-xs">
        <header class="mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-surface-variant/30 pb-3">
          <div>
            <h2 class="text-xl font-bold text-on-surface">
              Welcome back, {{ authService.userName() }} 👋
            </h2>
          </div>
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-full bg-secondary-container text-on-secondary-container border-2 border-surface-lowest flex items-center justify-center font-bold text-sm shadow-sm">
              {{ authService.userName().charAt(0) || 'T' }}
            </div>
          </div>
        </header>

        <!-- Bento Grid Layout -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-3 auto-rows-min mb-6">
          <div class="md:col-span-4 bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-3.5 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between">
            <div class="flex justify-between items-start">
              <span class="font-semibold text-[10px] text-on-surface-variant uppercase tracking-wider">Total Students</span>
              <div class="w-7 h-7 rounded-lg bg-primary-container/20 flex items-center justify-center text-primary">
                <span class="material-symbols-outlined text-base">groups</span>
              </div>
            </div>
            <div class="mt-2">
              <div class="text-xl font-bold text-on-surface leading-none">450</div>
              <div class="flex items-center gap-1 text-[10px] text-on-surface-variant mt-1">
                <span class="text-primary font-semibold">+12 this week</span>
                <span>• growing community</span>
              </div>
            </div>
          </div>

          <div class="md:col-span-4 bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-3.5 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between">
            <div class="flex justify-between items-start">
              <span class="font-semibold text-[10px] text-on-surface-variant uppercase tracking-wider">Active Curricula</span>
              <div class="w-7 h-7 rounded-lg bg-tertiary-container/30 flex items-center justify-center text-tertiary">
                <span class="material-symbols-outlined text-base">menu_book</span>
              </div>
            </div>
            <div class="mt-2">
              <div class="text-xl font-bold text-on-surface leading-none">4</div>
              <div class="flex items-center gap-1 text-[10px] text-on-surface-variant mt-1">
                <span>Published active workshops</span>
              </div>
            </div>
          </div>

          <div class="md:col-span-4 bg-secondary-fixed/5 border border-secondary/15 rounded-xl p-3.5 flex flex-col justify-between shadow-sm">
            <div class="flex items-center gap-1.5 mb-1.5 border-b border-secondary/10 pb-1">
              <span class="material-symbols-outlined text-secondary text-xs font-bold">priority_high</span>
              <span class="font-semibold text-[10px] text-on-surface uppercase tracking-wider">Quick Actions</span>
            </div>
            <div class="space-y-1.5 flex-grow flex flex-col justify-center">
              <a routerLink="/trainer/classes" class="flex justify-between items-center bg-surface-container-lowest px-2.5 py-1 rounded-lg border border-outline-variant/15 hover:border-outline-variant/30 transition-colors">
                <div class="flex items-center gap-1.5">
                  <span class="material-symbols-outlined text-on-surface-variant text-sm">video_camera_front</span>
                  <span class="text-[11px] font-medium text-on-surface">Join Live Class</span>
                </div>
                <span class="bg-primary/20 text-primary text-[9px] px-1.5 py-0.5 rounded-full font-bold">Zoom</span>
              </a>
              <a routerLink="/trainer/resources" class="flex justify-between items-center bg-surface-container-lowest px-2.5 py-1 rounded-lg border border-outline-variant/15 hover:border-outline-variant/30 transition-colors">
                <div class="flex items-center gap-1.5">
                  <span class="material-symbols-outlined text-on-surface-variant text-sm">folder</span>
                  <span class="text-[11px] font-medium text-on-surface">Manage Blueprints</span>
                </div>
                <span class="bg-surface-variant text-on-surface-variant text-[9px] px-1.5 py-0.5 rounded-full font-bold">PDFs</span>
              </a>
            </div>
          </div>
        </div>

        <!-- Links Grid -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <a routerLink="/trainer/courses" class="p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/30 hover:bg-surface-container-low transition-colors flex items-center gap-2.5 shadow-sm">
            <span class="material-symbols-outlined text-primary text-xl">school</span>
            <span class="font-semibold text-xs">My Courses</span>
          </a>
          <a routerLink="/trainer/students" class="p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/30 hover:bg-surface-container-low transition-colors flex items-center gap-2.5 shadow-sm">
            <span class="material-symbols-outlined text-primary text-xl">group</span>
            <span class="font-semibold text-xs">Students</span>
          </a>
          <a routerLink="/trainer/blogs" class="p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/30 hover:bg-surface-container-low transition-colors flex items-center gap-2.5 shadow-sm">
            <span class="material-symbols-outlined text-primary text-xl">article</span>
            <span class="font-semibold text-xs">Blog Articles</span>
          </a>
          <a routerLink="/trainer/gallery" class="p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/30 hover:bg-surface-container-low transition-colors flex items-center gap-2.5 shadow-sm">
            <span class="material-symbols-outlined text-primary text-xl">photo_library</span>
            <span class="font-semibold text-xs">Creations Gallery</span>
          </a>
        </div>
      </div>
    </div>
  `
})
export class TrainerDashboardComponent {
  authService = inject(AuthService);
}
