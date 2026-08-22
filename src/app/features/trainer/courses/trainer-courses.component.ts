import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CourseService } from '../../../core/services/course.service';
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
              <img [src]="course.imageUrl" [alt]="course.title" class="w-full h-full object-cover" />
              <span class="absolute top-3 left-3 bg-primary/80 text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                {{ course.category }}
              </span>
            </div>
            <div class="p-4 space-y-2">
              <h3 class="font-bold text-sm text-on-surface">{{ course.title }}</h3>
              <p class="text-xs text-on-surface-variant line-clamp-2">{{ course.description }}</p>
              <div class="pt-3 border-t border-outline-variant/20 flex justify-between items-center text-xs">
                <span class="font-bold text-primary">Rs. {{ course.price }}</span>
                <span class="text-on-surface-variant font-medium">124 Enrolled Students</span>
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
      </div>
    </main>
  `
})
export class TrainerCoursesComponent implements OnInit {
  private courseService = inject(CourseService);
  courses = signal<Course[]>([]);

  ngOnInit(): void {
    this.courseService.getCourses().subscribe({
      next: (list) => this.courses.set(list),
      error: () => this.courses.set([])
    });
  }
}
