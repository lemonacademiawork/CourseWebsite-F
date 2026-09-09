import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { CourseService } from '../../../core/services/course.service';
import { CategoryService } from '../../../core/services/category.service';
import { EnrollmentService } from '../../../core/services/enrollment.service';
import { AuthService } from '../../../core/services/auth.service';
import { Course } from '../../../core/models/course.model';
import { Category } from '../../../core/models/category.model';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './courses.component.html'
})
export class CoursesComponent implements OnInit, OnDestroy {
  private courseService = inject(CourseService);
  private categoryService = inject(CategoryService);
  private enrollmentService = inject(EnrollmentService);
  public authService = inject(AuthService);
  private route = inject(ActivatedRoute);

  courses = signal<Course[]>([]);
  categories = signal<Category[]>([]);
  loading = signal<boolean>(false);
  enrolledCourseIds = signal<Set<string>>(new Set());

  // Pagination & Filtering state
  currentPage = signal<number>(1);
  pageSize = signal<number>(5);
  pagination = signal<{
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore?: boolean;
  }>({
    page: 1,
    limit: 5,
    total: 0,
    totalPages: 1,
    hasMore: false
  });

  searchQuery = signal<string>('');
  selectedCategory = signal<string>('');
  selectedLevel = signal<string>('');

  private searchDebounceTimer: any;
  private refreshHandler = () => this.fetchCourses();

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        this.selectedCategory.set(params['category']);
      }
      if (params['search']) {
        this.searchQuery.set(params['search']);
      }
      if (params['page']) {
        const p = parseInt(params['page'], 10);
        if (!isNaN(p) && p > 0) this.currentPage.set(p);
      }
      this.fetchCourses();
    });

    this.fetchCategories();
    this.fetchEnrolledCourses();

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

  fetchCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (cats) => {
        this.categories.set(cats || []);
      },
      error: () => {
        this.categories.set([]);
      }
    });
  }

  fetchCourses(): void {
    this.loading.set(true);

    const params = {
      page: this.currentPage(),
      limit: this.pageSize(),
      categoryId: this.selectedCategory() || undefined,
      search: this.searchQuery().trim() || undefined,
      level: this.selectedLevel() || undefined
    };

    this.courseService.getCoursesPaginated(params).subscribe({
      next: (res) => {
        this.courses.set(res.courses || []);
        this.pagination.set(res.pagination || {
          page: this.currentPage(),
          limit: this.pageSize(),
          total: res.courses.length,
          totalPages: Math.ceil(res.courses.length / this.pageSize()) || 1,
          hasMore: false
        });
        this.loading.set(false);

        // Smooth scroll to top on page switch
        if (typeof window !== 'undefined') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      },
      error: () => {
        this.courses.set([]);
        this.loading.set(false);
      }
    });
  }

  onSearchInput(value: string): void {
    this.searchQuery.set(value);
    clearTimeout(this.searchDebounceTimer);
    this.searchDebounceTimer = setTimeout(() => {
      this.currentPage.set(1); // Reset page on filter change
      this.fetchCourses();
    }, 350);
  }

  onCategorySelect(categorySlugOrId: string): void {
    const current = this.selectedCategory();
    const nextVal = current === categorySlugOrId ? '' : categorySlugOrId;
    this.selectedCategory.set(nextVal);
    this.currentPage.set(1); // Reset page on filter change
    this.fetchCourses();
  }

  onLevelSelect(level: string): void {
    const current = this.selectedLevel();
    const nextVal = current === level ? '' : level;
    this.selectedLevel.set(nextVal);
    this.currentPage.set(1); // Reset page on filter change
    this.fetchCourses();
  }

  setPage(pageNum: number): void {
    const total = this.pagination().totalPages || 1;
    if (pageNum < 1 || pageNum > total || pageNum === this.currentPage()) return;
    this.currentPage.set(pageNum);
    this.fetchCourses();
  }

  prevPage(): void {
    if (this.currentPage() > 1 && !this.loading()) {
      this.setPage(this.currentPage() - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.pagination().totalPages && !this.loading()) {
      this.setPage(this.currentPage() + 1);
    }
  }

  getPageNumbers(): number[] {
    const total = this.pagination().totalPages || 1;
    return Array.from({ length: total }, (_, i) => i + 1);
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

  getInitials(name: string): string {
    return (name || 'Guest').split(' ').map(n => n[0]).join('');
  }
}
