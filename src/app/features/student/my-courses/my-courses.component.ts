import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CourseService } from '../../../core/services/course.service';
import { Course } from '../../../core/models/course.model';

@Component({
  selector: 'app-my-courses',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <main class="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 text-xs min-h-screen">
      <div class="space-y-6">
        <div>
          <h2 class="text-xl font-bold text-on-surface">My Courses</h2>
          <p class="text-xs text-on-surface-variant mt-1">Access your purchased workshops, tutorials, and certificates.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          @for (course of courses(); track course.id) {
            <div class="bg-surface-container-lowest rounded-xl overflow-hidden border border-outline-variant/35 shadow-sm flex flex-col h-full">
              <div class="relative h-40 w-full bg-surface-container">
                <img 
                  [alt]="course.title" 
                  class="w-full h-full object-cover" 
                  [src]="course.imageUrl" 
                />
                <div class="absolute top-3 left-3 bg-primary/20 backdrop-blur-md border border-white/20 px-2.5 py-0.5 rounded-full text-[10px] text-white font-bold uppercase tracking-wider">
                  {{ course.category }}
                </div>
              </div>
              <div class="p-4 flex flex-col flex-grow">
                <h3 class="text-sm font-bold text-on-surface leading-snug">{{ course.title }}</h3>
                <p class="text-[10px] text-on-surface-variant mt-1">Instructor: {{ course.instructor }}</p>
                
                <div class="mt-6 space-y-1.5">
                  <div class="flex justify-between text-[10px] text-on-surface-variant">
                    <span>Progress: {{ course.lessonsCompleted || 13 }}/{{ course.totalLessons || 20 }} Lessons</span>
                    <span class="font-bold">{{ course.progress || 65 }}%</span>
                  </div>
                  <div class="w-full bg-surface-variant h-1.5 rounded-full overflow-hidden">
                    <div class="bg-primary h-full rounded-full" [style.width.%]="course.progress || 65"></div>
                  </div>
                </div>

                <div class="mt-4 pt-3 border-t border-outline-variant/20 flex gap-2">
                  <a 
                    [routerLink]="['/my-courses', course.id]"
                    class="flex-1 text-center bg-primary text-on-primary font-semibold text-xs py-2 rounded-lg hover:opacity-95 transition-opacity">
                    Resume Course
                  </a>
                </div>
              </div>
            </div>
          }

          @if (courses().length === 0) {
            <div class="col-span-2 py-12 text-center text-on-surface-variant bg-surface-container-low rounded-xl">
              <p class="mb-4">You are not enrolled in any courses yet.</p>
              <a routerLink="/courses" class="bg-primary text-on-primary px-6 py-2.5 rounded-lg font-semibold shadow-sm hover:opacity-90 transition-opacity inline-block">
                Explore Courses
              </a>
            </div>
          }
        </div>
      </div>
    </main>
  `
})
export class MyCoursesComponent implements OnInit {
  private courseService = inject(CourseService);
  courses = signal<Course[]>([]);

  ngOnInit(): void {
    const purchased = this.courseService.getPurchasedCourses();
    this.courses.set(purchased);
  }
}
