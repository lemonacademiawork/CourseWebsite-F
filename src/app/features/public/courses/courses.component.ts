import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
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
  private router = inject(Router);
  private titleService = inject(Title);
  private metaService = inject(Meta);

  // Fallback craft categories for instant display
  defaultCraftCategories: Category[] = [
    { id: 'texture-art', name: 'Texture Art', slug: 'texture-art', description: 'Modern 3D canvas and textured relief art masterclasses' },
    { id: 'lippan-art', name: 'Lippan Art', slug: 'lippan-art', description: 'Traditional Indian mud and mirror relief artwork' },
    { id: 'resin-art', name: 'Resin Art', slug: 'resin-art', description: 'Crystal-clear epoxy ocean waves, geode coasters and clocks' },
    { id: 'candle-making', name: 'Candle Making', slug: 'candle-making', description: 'Botanical soy and beeswax scented candle crafting' },
    { id: 'pipe-cleaners', name: 'Pipe Cleaners', slug: 'pipe-cleaners', description: 'Creative fuzzy wire flower bouquet and miniature art' },
    { id: 'artisan-soap-making', name: 'Artisan Soap Making', slug: 'artisan-soap-making', description: 'Cold-process and melt-and-pour natural herbal soaps' }
  ];

  // Instant first paint: read cached courses if available immediately
  courses = signal<Course[]>([]);
  allCourses = signal<Course[]>([]);
  categories = signal<Category[]>([]);
  loading = signal<boolean>(false);
  enrolledCourseIds = signal<Set<string>>(new Set());

  // Category card images mapping for artisan aesthetic (Screenshot 2 style)
  categoryImages: Record<string, string> = {
    'texture-art': 'https://i.pinimg.com/736x/04/51/1b/04511b15d6dc9c0dc1fb937862cfa820.jpg',
    'lippan-art': 'https://i.pinimg.com/736x/5f/79/50/5f7950ee34ed08c6742c9b94a28a4ada.jpg',
    'pipe-cleaners': 'https://i.pinimg.com/736x/35/73/7f/35737f65e7b60630f82c3d4f0bca1ab4.jpg',
    'resin-art': 'https://i.pinimg.com/736x/3e/6d/45/3e6d457c07029e2fd6904cf4b7beb11a.jpg',
    'candle-making': 'https://i.pinimg.com/736x/90/0e/aa/900eaaeede865070448f865f3afc9185.jpg',
    'artisan-soap-making': 'https://images.unsplash.com/photo-1607006314164-946761596700?auto=format&fit=crop&q=80&w=800'
  };

  // Waitlist pre-registration state for upcoming categories (guards dead-end navigation)
  waitlistEmail = signal<string>('');
  waitlistSubmitted = signal<boolean>(false);

  // Pagination & Filtering state
  currentPage = signal<number>(1);
  pageSize = signal<number>(8);
  pagination = signal<{
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore?: boolean;
  }>({
    page: 1,
    limit: 8,
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
    // Dynamic SEO
    this.titleService.setTitle('Craft Courses & Artisan Masterclasses | Lemon Academy');
    this.metaService.updateTag({ name: 'description', content: 'Explore curated handcrafted workshops in Lippan Art, Organic Cold Process Soap Making, Resin Geode Art, and more.' });
    this.metaService.updateTag({ property: 'og:title', content: 'Artisan Craft Masterclasses | Lemon Academy' });
    this.metaService.updateTag({ property: 'og:description', content: 'Hands-on creative courses with complete materials kits delivered to your doorstep.' });

    this.route.queryParams.subscribe(params => {
      this.selectedCategory.set(params['category'] || '');
      this.selectedLevel.set(params['level'] || '');
      this.searchQuery.set(params['search'] || '');
      const p = parseInt(params['page'], 10);
      this.currentPage.set(!isNaN(p) && p > 0 ? p : 1);
      
      if (this.selectedCategory()) {
        this.fetchCourses();
      }
    });

    this.fetchCategories();
    this.fetchAllCoursesForCounts();
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

  fetchAllCoursesForCounts(): void {
    this.courseService.getCourses().subscribe({
      next: (list) => {
        this.allCourses.set(list || []);
      },
      error: () => {
        this.allCourses.set([]);
      }
    });
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

  getDisplayCategories(): Category[] {
    const source = this.categories().length > 0 ? this.categories() : this.defaultCraftCategories;
    const list = source.filter(c => this.getCategoryCount(c.slug || c.id) > 0);
    return list.length > 0 ? list : source;
  }

  getCategoryCount(catKey: string): number {
    if (!catKey) return 0;
    const key = catKey.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
    return this.allCourses().filter(c => {
      const cSlug = (c.categorySlug || '').toLowerCase();
      const cName = (c.category || '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const cId = (c.categoryId || '').toLowerCase();
      return (
        cId === catKey.toLowerCase() ||
        cSlug === key ||
        cName === key ||
        cSlug.includes(key) ||
        key.includes(cSlug)
      );
    }).length;
  }

  getCategoryImageUrl(cat: Category): string {
    const slug = (cat.slug || '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    if (this.categoryImages[slug]) return this.categoryImages[slug];
    if (cat.imageUrl && !cat.imageUrl.includes('unsplash.com/photo-1584992236310-6edddc08acff')) {
      return cat.imageUrl;
    }
    const match = this.allCourses().find(c => {
      const cSlug = (c.categorySlug || '').toLowerCase();
      const cId = (c.categoryId || '').toLowerCase();
      return cSlug === slug || cId === (cat.id || '').toLowerCase();
    });
    if (match?.imageUrl) return match.imageUrl;
    return this.categoryImages[slug] || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800';
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
    const current = this.selectedCategory().toLowerCase().trim();
    const next = (categorySlugOrId || '').toLowerCase().trim();
    const nextVal = current === next ? '' : categorySlugOrId;
    this.selectedCategory.set(nextVal);
    this.selectedLevel.set(''); // Reset level when switching category
    this.currentPage.set(1);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { category: nextVal || null, level: null, page: null },
      queryParamsHandling: 'merge'
    });
    if (nextVal) {
      this.fetchCourses();
    }
  }

  isCategorySelected(cat: Category): boolean {
    if (!this.selectedCategory()) return false;
    const selected = this.selectedCategory().toLowerCase().trim();
    const id = (cat.id || '').toLowerCase();
    const slug = (cat.slug || '').toLowerCase();
    const name = (cat.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return selected === id || selected === slug || selected === name;
  }

  onLevelSelect(level: string): void {
    const current = this.selectedLevel();
    const nextVal = (!level || current.toLowerCase() === level.toLowerCase()) ? '' : level;
    this.selectedLevel.set(nextVal);
    this.currentPage.set(1);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { level: nextVal || null, page: null },
      queryParamsHandling: 'merge'
    });
    this.fetchCourses();
  }

  isLevelSelected(level: string): boolean {
    if (!level && !this.selectedLevel()) return true;
    if (!level || !this.selectedLevel()) return false;
    return this.selectedLevel().toLowerCase() === level.toLowerCase();
  }

  formatLevel(level?: string): string {
    if (!level) return 'All Levels';
    const l = level.toUpperCase();
    if (l === 'BEGINNER') return 'Beginner';
    if (l === 'INTERMEDIATE') return 'Intermediate';
    if (l === 'ADVANCED') return 'Advanced';
    if (l === 'ALL_LEVELS') return 'All Levels';
    return level;
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

  getCategoryDisplayName(catKey: string): string {
    if (!catKey) return 'Craft Masterclass';
    const found = this.categories().find(c => c.slug === catKey || c.id === catKey);
    if (found?.name) return found.name;
    return catKey.replace(/[-_]+/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  submitWaitlist(category: string): void {
    if (!this.waitlistEmail().trim() || !this.waitlistEmail().includes('@')) return;
    this.waitlistSubmitted.set(true);
    if (typeof window !== 'undefined') {
      try {
        const key = 'lemon_waitlists';
        const current = JSON.parse(localStorage.getItem(key) || '[]');
        current.push({ category, email: this.waitlistEmail().trim(), date: new Date().toISOString() });
        localStorage.setItem(key, JSON.stringify(current));
      } catch {}
    }
  }
}
