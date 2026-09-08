import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { CourseService } from '../../../core/services/course.service';
import { EnrollmentService } from '../../../core/services/enrollment.service';
import { AuthService } from '../../../core/services/auth.service';
import { Course } from '../../../core/models/course.model';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './courses.component.html'
})
export class CoursesComponent implements OnInit {
  private courseService = inject(CourseService);
  private enrollmentService = inject(EnrollmentService);
  authService = inject(AuthService);
  private route = inject(ActivatedRoute);

  courses = signal<Course[]>([]);
  loading = signal<boolean>(true);
  selectedCategories = signal<string[]>([]);
  enrolledCourseIds = signal<Set<string>>(new Set());

  categories = [
    { name: 'Lippan Art', slug: 'lippan-art' },
    { name: 'Candle Making', slug: 'candle-making' },
    { name: 'Resin Art', slug: 'resin-art' },
    { name: 'Mosaic Art', slug: 'mosaic-art' },
    { name: 'Crochet & Fiber Arts', slug: 'crochet-fiber-arts' },
    { name: 'Pottery', slug: 'pottery' }
  ];

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        this.selectedCategories.set([params['category']]);
      }
    });
    this.fetchCourses();
    this.fetchEnrolledCourses();
  }

  fetchCourses(): void {
    this.loading.set(true);
    this.courseService.getCourses().subscribe({
      next: (data) => {
        this.courses.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.courses.set([]);
        this.loading.set(false);
      }
    });
  }

  fetchEnrolledCourses(): void {
    const ids = new Set<string>();

    // 1. Local storage cache
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('purchased_courses');
      if (cached) {
        try {
          const list = JSON.parse(cached);
          if (Array.isArray(list)) {
            list.forEach((item: any) => {
              const id = typeof item === 'string' ? item : (item?.id || item?.courseId || item?.slug);
              if (id) ids.add(String(id));
            });
          }
        } catch {}
      }
    }

    // 2. Backend enrollments API
    if (this.authService.isLoggedIn()) {
      this.enrollmentService.getEnrollments().subscribe({
        next: (enrollments) => {
          enrollments.forEach(e => {
            if (e.courseId) ids.add(String(e.courseId));
            if (e.course?.id) ids.add(String(e.course.id));
            if (e.course?.slug) ids.add(String(e.course.slug));
            if (e.id) ids.add(String(e.id));
          });
          this.enrolledCourseIds.set(new Set(ids));
        },
        error: () => {
          this.enrolledCourseIds.set(new Set(ids));
        }
      });
    } else {
      this.enrolledCourseIds.set(ids);
    }
  }

  isEnrolled(course: Course): boolean {
    const ids = this.enrolledCourseIds();
    return ids.has(course.id) || (!!course.slug && ids.has(course.slug));
  }

  handleCategoryToggle(slug: string): void {
    this.selectedCategories.update(prev =>
      prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
    );
  }

  get filteredCourses(): Course[] {
    const cats = this.selectedCategories();
    if (cats.length === 0) return this.courses();

    return this.courses().filter(course => {
      return cats.includes(course.categorySlug || '') ||
        cats.some(cat => course.category.toLowerCase().includes(cat.toLowerCase()));
    });
  }

  getInitials(name: string): string {
    return (name || 'Guest').split(' ').map(n => n[0]).join('');
  }
}

