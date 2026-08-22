import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { CourseService } from '../../../core/services/course.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <main class="min-h-screen bg-[#FBF8F1] py-12 px-margin-mobile md:px-margin-desktop max-w-xl mx-auto text-xs">
      <div class="bg-surface-container-lowest border border-outline-variant/35 rounded-2xl p-6 md:p-10 shadow-sm space-y-6">
        <div class="text-center">
          <div class="w-16 h-16 rounded-full bg-primary-container text-primary flex items-center justify-center font-bold text-xl mx-auto mb-4 border shadow-sm">
            {{ getInitials() }}
          </div>
          <h2 class="playfair text-xl font-bold text-on-surface">{{ authService.userName() }}</h2>
          <p class="text-on-surface-variant capitalize mt-0.5">{{ authService.userRole() }} Account</p>
        </div>

        <div class="border-t border-outline-variant/20 pt-4 space-y-3">
          <div class="flex justify-between py-2 border-b border-outline-variant/10">
            <span class="font-semibold text-on-surface-variant">Email Address</span>
            <span class="text-on-surface">{{ authService.userEmail() }}</span>
          </div>
          <div class="flex justify-between py-2 border-b border-outline-variant/10">
            <span class="font-semibold text-on-surface-variant">Account Type</span>
            <span class="text-on-surface capitalize">{{ authService.userRole() }}</span>
          </div>
          <div class="flex justify-between py-2 border-b border-outline-variant/10">
            <span class="font-semibold text-on-surface-variant">Active Courses</span>
            <span class="text-on-surface font-bold">{{ courseCount() }}</span>
          </div>
        </div>

        <div class="pt-4 flex flex-col gap-2">
          <a routerLink="/my-courses" class="w-full text-center bg-primary text-on-primary font-semibold py-2.5 rounded-lg hover:opacity-90 transition-opacity">
            Go to My Courses
          </a>
          <button 
            (click)="handleLogout()"
            class="w-full bg-surface-container text-on-surface font-semibold py-2.5 rounded-lg hover:bg-surface-dim transition-colors cursor-pointer">
            Sign Out
          </button>
        </div>
      </div>
    </main>
  `
})
export class ProfileComponent implements OnInit {
  authService = inject(AuthService);
  private courseService = inject(CourseService);

  courseCount = signal<number>(0);

  ngOnInit(): void {
    this.authService.fetchUserProfile().subscribe();
    const purchased = this.courseService.getPurchasedCourses();
    this.courseCount.set(purchased.length);
  }

  getInitials(): string {
    const name = this.authService.userName() || 'User';
    return name.split(' ').map(n => n[0]).join('');
  }

  handleLogout(): void {
    this.authService.logout();
  }
}
