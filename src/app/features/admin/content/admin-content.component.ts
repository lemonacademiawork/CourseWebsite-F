import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CourseService } from '../../../core/services/course.service';
import { Course } from '../../../core/models/course.model';

@Component({
  selector: 'app-admin-content',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <main class="p-6 max-w-container-max mx-auto text-xs text-on-surface">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-xl font-bold text-on-surface">Creative Content Management</h1>
          <p class="text-xs text-on-surface-variant mt-0.5">Manage course lesson modules, media files, and downloadable assets.</p>
        </div>
        <a routerLink="/admin/content/upload" class="bg-primary text-on-primary font-semibold px-4 py-2.5 rounded-lg hover:opacity-90 flex items-center gap-1.5 shadow-sm">
          <span class="material-symbols-outlined text-sm">upload</span>
          Upload Media
        </a>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        @for (course of courses(); track course.id) {
          <div class="bg-surface-container-lowest border border-outline-variant/35 rounded-xl p-4 shadow-sm space-y-3 flex flex-col justify-between">
            <div class="h-36 bg-surface-container-low rounded-lg overflow-hidden relative">
              <img class="w-full h-full object-cover" [src]="course.imageUrl || course.thumbnailUrl || 'https://images.unsplash.com/photo-1513364776144-60967b0f800f'" [alt]="course.title" />
              <span class="absolute top-2 left-2 bg-black/60 text-white px-2 py-0.5 rounded text-[10px] font-bold">{{ course.category || 'Workshop' }}</span>
            </div>
            <div>
              <h3 class="font-bold text-sm text-on-surface truncate">{{ course.title }}</h3>
              <p class="text-[11px] text-on-surface-variant line-clamp-2 mt-0.5">{{ course.description || 'Artisan Workshop Masterclass' }}</p>
            </div>
            <div class="pt-2 border-t border-outline-variant/20 flex justify-between items-center text-[10px] text-on-surface-variant">
              <span>Instructor: {{ course.instructor || 'Studio Master' }}</span>
              <a [routerLink]="['/courses', course.id]" class="text-primary font-bold hover:underline">View Curriculum</a>
            </div>
          </div>
        }

        @if (courses().length === 0 && !isLoading()) {
          <div class="col-span-3 p-12 text-center bg-surface-container-low rounded-2xl border border-outline-variant/30 text-on-surface-variant">
            <span class="material-symbols-outlined text-primary text-3xl mb-2">video_library</span>
            <p class="font-semibold text-xs text-on-surface">No Course Content Published Yet</p>
            <p class="text-[11px] text-on-surface-variant mt-0.5 mb-4">Upload curriculum video lessons and printable PDF blueprints.</p>
            <a routerLink="/admin/content/upload" class="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-on-primary font-semibold rounded-lg text-xs hover:opacity-90">
              <span class="material-symbols-outlined text-sm">upload</span> Upload First Content
            </a>
          </div>
        }
      </div>
    </main>
  `
})
export class AdminContentComponent implements OnInit {
  private courseService = inject(CourseService);
  courses = signal<Course[]>([]);
  isLoading = signal<boolean>(true);

  ngOnInit(): void {
    this.courseService.getCourses().subscribe({
      next: (list) => {
        this.courses.set(list || []);
        this.isLoading.set(false);
      },
      error: () => {
        this.courses.set([]);
        this.isLoading.set(false);
      }
    });
  }
}
