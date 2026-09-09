import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TrainerService } from '../../../core/services/trainer.service';
import { CourseService } from '../../../core/services/course.service';
import { AuthService } from '../../../core/services/auth.service';
import { Course } from '../../../core/models/course.model';

@Component({
  selector: 'app-trainer-courses',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <main class="p-6 max-w-container-max mx-auto text-xs text-on-surface">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-xl font-bold text-on-surface">Assigned Courses</h1>
          <p class="text-xs text-on-surface-variant mt-0.5">Workshops and masterclasses taught by you.</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        @for (course of courses(); track course.id) {
          <div class="bg-surface-container-lowest border border-outline-variant/35 rounded-xl overflow-hidden shadow-sm flex flex-col justify-between">
            <div class="h-40 bg-surface-container-low relative">
              <img [src]="course.imageUrl || course.thumbnailUrl" [alt]="course.title" class="w-full h-full object-cover" />
              <span class="absolute top-3 left-3 bg-primary/80 text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                {{ course.category }}
              </span>
            </div>
            <div class="p-4 space-y-2">
              <h3 class="font-bold text-sm text-on-surface">{{ course.title }}</h3>
              <p class="text-xs text-on-surface-variant line-clamp-2">{{ course.description }}</p>
              <div class="pt-3 border-t border-outline-variant/20 flex justify-between items-center text-xs">
                <span class="font-bold text-primary">Rs. {{ course.price }}</span>
                <span class="text-on-surface-variant font-medium">{{ course.studentsCount || 0 }} Enrolled Students</span>
              </div>
            </div>
            <div class="p-3 bg-surface-container-low border-t border-outline-variant/20 flex gap-2">
              <a routerLink="/trainer/classes" class="flex-1 text-center py-2 bg-primary text-on-primary font-semibold rounded-lg hover:opacity-90">
                Live Classes
              </a>
              <a routerLink="/trainer/resources" class="flex-1 text-center py-2 bg-surface-container-highest text-on-surface font-semibold rounded-lg hover:bg-surface-dim">
                Blueprints
              </a>
            </div>
          </div>
        }

        @if (courses().length === 0) {
          <div class="col-span-2 text-center py-12 bg-surface-container-low rounded-xl border border-outline-variant/30">
            <span class="material-symbols-outlined text-primary text-3xl mb-2">school</span>
            <p class="font-bold text-sm text-on-surface">No Courses Assigned Yet</p>
            <p class="text-xs text-on-surface-variant mt-1">When an administrator assigns you to a curriculum or you publish a masterclass, it will appear here.</p>
          </div>
        }
      </div>
    </main>
  `
})
export class TrainerCoursesComponent implements OnInit, OnDestroy {
  private trainerService = inject(TrainerService);
  private courseService = inject(CourseService);
  private authService = inject(AuthService);

  courses = signal<Course[]>([]);
  private refreshHandler = () => this.loadCourses();

  ngOnInit(): void {
    this.loadCourses();
    if (typeof window !== 'undefined') {
      window.addEventListener('courses_updated', this.refreshHandler);
      window.addEventListener('storage', this.refreshHandler);
      window.addEventListener('focus', this.refreshHandler);
    }
  }

  ngOnDestroy(): void {
    if (typeof window !== 'undefined') {
      window.removeEventListener('courses_updated', this.refreshHandler);
      window.removeEventListener('storage', this.refreshHandler);
      window.removeEventListener('focus', this.refreshHandler);
    }
  }

  loadCourses(): void {
    this.trainerService.getTrainerCourses().subscribe({
      next: (list) => {
        if (list && list.length > 0) {
          this.courses.set(list);
        } else {
          this.courseService.getCourses().subscribe(all => {
            const currentName = (this.authService.userName() || (typeof window !== 'undefined' ? localStorage.getItem('user_name') : '') || '').trim().toLowerCase();
            if (currentName && currentName !== 'user') {
              const matched = all.filter(c => 
                (c.instructor && c.instructor.toLowerCase().includes(currentName)) || 
                (currentName && c.instructor && currentName.includes(c.instructor.toLowerCase()))
              );
              this.courses.set(matched.length > 0 ? matched : all);
            } else {
              this.courses.set(all);
            }
          });
        }
      },
      error: () => {
        this.courseService.getCourses().subscribe(all => this.courses.set(all));
      }
    });
  }
}

