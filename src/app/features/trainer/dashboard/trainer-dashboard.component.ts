import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { TrainerService } from '../../../core/services/trainer.service';
import { CourseService } from '../../../core/services/course.service';
import { TrainerDashboardMetrics } from '../../../core/models/trainer.model';
import { Course } from '../../../core/models/course.model';

@Component({
  selector: 'app-trainer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="relative min-h-screen pb-6 text-xs">
      <div class="absolute inset-0 pointer-events-none opacity-20" style="background-image: radial-gradient(circle at 100% 0%, #ffe17a 0%, transparent 40%), radial-gradient(circle at 0% 100%, #fe9d7a 0%, transparent 40%)"></div>
      
      <div class="max-w-container-max mx-auto px-margin-mobile md:px-6 py-4 relative z-10 text-xs space-y-6">
        <header class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-surface-variant/30 pb-3">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="bg-primary/10 text-primary px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider">
                Instructor Dashboard
              </span>
            </div>
            <h2 class="text-xl font-bold text-on-surface">
              Welcome back, {{ authService.userName() }} 👋
            </h2>
            <p class="text-[11px] text-on-surface-variant mt-0.5">Track your workshops, live sessions, and student engagements.</p>
          </div>
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-full bg-secondary-container text-on-secondary-container border-2 border-surface-lowest flex items-center justify-center font-bold text-sm shadow-sm">
              {{ authService.userName().charAt(0) || 'T' }}
            </div>
          </div>
        </header>

        <!-- Bento Grid Layout -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-3 auto-rows-min">
          <div class="md:col-span-4 bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-3.5 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between">
            <div class="flex justify-between items-start">
              <span class="font-semibold text-[10px] text-on-surface-variant uppercase tracking-wider">Total Students</span>
              <div class="w-7 h-7 rounded-lg bg-primary-container/20 flex items-center justify-center text-primary">
                <span class="material-symbols-outlined text-base">groups</span>
              </div>
            </div>
            <div class="mt-2">
              <div class="text-xl font-bold text-on-surface leading-none">
                {{ totalStudents() }}
              </div>
              <div class="flex items-center gap-1 text-[10px] text-on-surface-variant mt-1">
                <span>Enrolled students across your courses</span>
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
              <div class="text-xl font-bold text-on-surface leading-none">
                {{ activeCoursesCount() }}
              </div>
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
            <span class="font-semibold text-xs">My Courses ({{ assignedCourses().length }})</span>
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

        <!-- Assigned Courses Section on Dashboard -->
        <div class="space-y-3">
          <div class="flex justify-between items-center">
            <h3 class="font-bold text-sm text-on-surface flex items-center gap-1.5">
              <span class="material-symbols-outlined text-primary text-base">school</span>
              <span>Your Assigned Workshops &amp; Masterclasses</span>
            </h3>
            <a routerLink="/trainer/courses" class="text-primary font-bold text-xs hover:underline flex items-center gap-0.5">
              <span>View All ({{ assignedCourses().length }})</span>
              <span class="material-symbols-outlined text-xs">arrow_forward</span>
            </a>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            @for (c of assignedCourses().slice(0, 3); track c.id) {
              <div class="bg-surface-container-lowest border border-outline-variant/30 rounded-xl overflow-hidden shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
                <div class="h-32 bg-surface-container-low relative">
                  <img [src]="c.imageUrl || c.thumbnailUrl" [alt]="c.title" class="w-full h-full object-cover" />
                  <span class="absolute top-2.5 left-2.5 bg-black/60 text-white px-2 py-0.5 rounded-full text-[9px] font-bold uppercase">
                    {{ c.category }}
                  </span>
                </div>
                <div class="p-3.5 space-y-2">
                  <h4 class="font-bold text-xs text-on-surface truncate">{{ c.title }}</h4>
                  <p class="text-[11px] text-on-surface-variant line-clamp-2">{{ c.description }}</p>
                  <div class="flex items-center justify-between text-[11px] pt-2 border-t border-outline-variant/20">
                    <span class="text-on-surface-variant">{{ c.studentsCount || 0 }} Students</span>
                    <span class="font-bold text-primary">Rs. {{ c.price }}</span>
                  </div>
                </div>
                <div class="p-2.5 bg-surface-container-low/70 border-t border-outline-variant/20 flex gap-2">
                  @if (c.liveClassLink) {
                    <a [href]="c.liveClassLink" target="_blank" class="flex-1 text-center py-1.5 bg-blue-600 text-white font-bold rounded-lg text-[11px] flex items-center justify-center gap-1">
                      <span class="material-symbols-outlined text-xs">videocam</span>
                      <span>Zoom</span>
                    </a>
                  }
                  <a routerLink="/trainer/courses" class="flex-1 text-center py-1.5 bg-surface-container-highest text-on-surface font-semibold rounded-lg text-[11px]">
                    Curriculum
                  </a>
                </div>
              </div>
            }
          </div>
        </div>

      </div>
    </div>
  `
})
export class TrainerDashboardComponent implements OnInit, OnDestroy {
  authService = inject(AuthService);
  private trainerService = inject(TrainerService);
  private courseService = inject(CourseService);

  metrics = signal<TrainerDashboardMetrics | null>(null);
  assignedCourses = signal<Course[]>([]);
  totalStudents = signal<number>(0);
  activeCoursesCount = signal<number>(0);

  private refreshHandler = () => this.loadData();

  ngOnInit(): void {
    this.loadData();
    if (typeof window !== 'undefined') {
      window.addEventListener('courses_updated', this.refreshHandler);
      window.addEventListener('storage', this.refreshHandler);
    }
  }

  ngOnDestroy(): void {
    if (typeof window !== 'undefined') {
      window.removeEventListener('courses_updated', this.refreshHandler);
      window.removeEventListener('storage', this.refreshHandler);
    }
  }

  loadData(): void {
    this.trainerService.getTrainerDashboard().subscribe({
      next: (data) => {
        if (data) {
          this.metrics.set(data);
          this.totalStudents.set(data.totalStudents || 0);
          this.activeCoursesCount.set(data.activeCourses || 0);
        }
      },
      error: () => {}
    });

    this.courseService.getCourses().subscribe({
      next: (all) => {
        const currentName = (this.authService.userName() || (typeof window !== 'undefined' ? localStorage.getItem('user_name') : '') || '').trim().toLowerCase();
        const currentEmail = (this.authService.userEmail() || (typeof window !== 'undefined' ? localStorage.getItem('user_email') : '') || '').trim().toLowerCase();

        const matched = all.filter(c => {
          const trAny = c.trainer as any;
          const inst = (c.instructor || '').toLowerCase();
          const trObjName = (typeof trAny === 'string' ? trAny : trAny?.name || trAny?.user?.name || '').toLowerCase();
          const trEmail = (trAny?.email || trAny?.user?.email || '').toLowerCase();

          if (!currentName || currentName === 'user') return true;

          return (
            inst.includes(currentName) || 
            currentName.includes(inst) ||
            trObjName.includes(currentName) ||
            currentName.includes(trObjName) ||
            (currentEmail && trEmail && trEmail === currentEmail)
          );
        });

        const finalCourses = matched.length > 0 ? matched : all;
        this.assignedCourses.set(finalCourses);
        if (!this.metrics() || !this.metrics()?.activeCourses) {
          this.activeCoursesCount.set(finalCourses.length);
          this.totalStudents.set(finalCourses.reduce((acc, c) => acc + (c.studentsCount || 0), 0));
        }
      }
    });
  }
}

