import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EnrollmentService } from '../../../core/services/enrollment.service';
import { CourseService } from '../../../core/services/course.service';
import { StudentService } from '../../../core/services/student.service';
import { Course } from '../../../core/models/course.model';
import { Enrollment } from '../../../core/models/enrollment.model';

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

        <!-- Loading State -->
        @if (isLoading()) {
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            @for (i of [1,2]; track i) {
              <div class="bg-surface-container-lowest rounded-xl overflow-hidden border border-outline-variant/35 shadow-sm animate-pulse">
                <div class="h-40 bg-surface-container-high"></div>
                <div class="p-4 space-y-3">
                  <div class="h-4 bg-surface-container-high rounded w-3/4"></div>
                  <div class="h-3 bg-surface-container-high rounded w-1/2"></div>
                  <div class="h-2 bg-surface-container-high rounded w-full mt-4"></div>
                </div>
              </div>
            }
          </div>
        } @else {
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            @for (course of courses(); track course.id) {
              <div class="bg-surface-container-lowest rounded-xl overflow-hidden border border-outline-variant/35 shadow-sm flex flex-col h-full hover:shadow-md transition-all">
                <a [routerLink]="['/my-courses', course.id]" class="block relative h-40 w-full bg-surface-container overflow-hidden group cursor-pointer">
                  <img 
                    [alt]="course.title" 
                    class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    [src]="course.imageUrl" 
                  />
                  <div class="absolute top-3 left-3 bg-primary/20 backdrop-blur-md border border-white/20 px-2.5 py-0.5 rounded-full text-[10px] text-white font-bold uppercase tracking-wider">
                    {{ course.category }}
                  </div>
                </a>
                <div class="p-4 flex flex-col flex-grow">
                  <h3 class="text-sm font-bold text-on-surface leading-snug hover:text-primary transition-colors cursor-pointer">
                    <a [routerLink]="['/my-courses', course.id]">{{ course.title }}</a>
                  </h3>
                  <div class="flex items-center justify-between gap-2 mt-1">
                    <p class="text-[10px] text-on-surface-variant">Instructor: {{ course.instructor }}</p>
                    @if (course.startDate || course.endDate) {
                      <span class="text-[9px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                        📅 {{ formatDateRange(course.startDate, course.endDate) }}
                      </span>
                    }
                  </div>
                  
                  <div class="mt-4 space-y-1.5">
                    <div class="flex justify-between text-[10px] text-on-surface-variant">
                      <span>Progress: {{ course.lessonsCompleted || 0 }}/{{ course.totalLessons || 4 }} Lessons</span>
                      <span class="font-bold text-primary">{{ course.progress || 0 }}%</span>
                    </div>
                    <div class="w-full bg-surface-variant h-2 rounded-full overflow-hidden">
                      <div class="bg-primary h-full rounded-full transition-all duration-500" [style.width.%]="course.progress || 0"></div>
                    </div>
                  </div>

                  <div class="mt-4 pt-3 border-t border-outline-variant/20 flex gap-2">
                    <a 
                      [routerLink]="['/my-courses', course.id]"
                      class="flex-1 text-center bg-primary text-on-primary font-semibold text-xs py-2.5 rounded-lg hover:opacity-95 transition-opacity shadow-xs">
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
        }
      </div>
    </main>
  `
})
export class MyCoursesComponent implements OnInit {
  private enrollmentService = inject(EnrollmentService);
  private courseService = inject(CourseService);
  private studentService = inject(StudentService);

  courses = signal<Course[]>([]);
  isLoading = signal<boolean>(true);

  ngOnInit(): void {
    this.loadEnrolledCourses();
  }

  loadEnrolledCourses(): void {
    this.isLoading.set(true);
    this.enrollmentService.getEnrollments().subscribe({
      next: (enrollments: Enrollment[]) => {
        const mappedCourses: Course[] = enrollments
          .filter(e => e.course || e.courseId)
          .map(e => {
            const c = e.course;
            if (c) {
              const category = typeof c.category === 'string' ? c.category : c.category?.name || 'General Craft';
              const instructor = typeof c.trainer === 'string' ? c.trainer : c.trainer?.name || 'Instructor';
              return {
                id: c.id,
                title: c.title || 'Untitled Course',
                slug: c.slug || '',
                category,
                instructor,
                description: c.description || '',
                imageUrl: c.thumbnailUrl || 'https://images.unsplash.com/photo-1584992236310-6edddc08acff',
                thumbnailUrl: c.thumbnailUrl || '',
                price: c.price || 0,
                discountedPrice: c.discountedPrice || 0,
                startDate: c.startDate || c.start_date || null,
                endDate: c.endDate || c.end_date || null,
                totalLessons: (c as any).totalLessons || 4,
                lessonsCompleted: (c as any).lessonsCompleted || 0,
                progress: (c as any).progress || 0
              } as Course;
            }
            return { id: e.courseId, title: 'Loading...', category: '', instructor: '', description: '', imageUrl: '', price: 0 } as Course;
          });
        this.courses.set(mappedCourses);
        this.isLoading.set(false);

        // Fetch student progress to update dynamic percentages
        this.studentService.getStudentProgress().subscribe({
          next: (progressList) => {
            if (progressList && Array.isArray(progressList)) {
              const completedCount = progressList.filter(p => p.isCompleted).length;
              this.courses.update(list => list.map(c => {
                const total = c.totalLessons || 4;
                const completed = Math.min(completedCount, total);
                const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
                return {
                  ...c,
                  lessonsCompleted: completed,
                  progress: progress
                };
              }));
            }
          },
          error: () => {}
        });

        // For enrollments that only have courseId (no nested course), fetch course details
        mappedCourses.forEach((course, index) => {
          if (course.title === 'Loading...' && course.id) {
            this.courseService.getCourse(course.id).subscribe(found => {
              if (found) {
                this.courses.update(list => {
                  const copy = [...list];
                  copy[index] = found;
                  return copy;
                });
              }
            });
          }
        });
      },
      error: () => {
        this.courses.set([]);
        this.isLoading.set(false);
      }
    });
  }

  formatDateRange(start?: string | null, end?: string | null): string {
    if (!start && !end) return '';
    if (start && end) {
      const s = new Date(start);
      const e = new Date(end);
      const sStr = s.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
      const eStr = e.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
      const diffDays = Math.max(1, Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1);
      return `${sStr} – ${eStr} (${diffDays} Days)`;
    }
    if (end) {
      return `Ends ${new Date(end).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}`;
    }
    return `Starts ${new Date(start!).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}`;
  }
}
