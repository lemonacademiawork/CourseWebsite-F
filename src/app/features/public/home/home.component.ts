import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Title, Meta } from '@angular/platform-browser';
import { AuthService } from '../../../core/services/auth.service';
import { EnrollmentService } from '../../../core/services/enrollment.service';
import { environment } from '../../../../environments/environment';

export interface CarouselSlide {
  id?: string;
  title: string;
  tagline?: string;
  description?: string;
  imageUrl: string;
  route?: string;
  category?: string;
  order?: number;
  active?: boolean;
  isActive?: boolean;
  queryParams?: Record<string, string>;
}

export type HeroSlide = CarouselSlide;
export const HERO_SLIDES: CarouselSlide[] = [];

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private http = inject(HttpClient);
  public authService = inject(AuthService);
  private enrollmentService = inject(EnrollmentService);
  private titleService = inject(Title);
  private metaService = inject(Meta);

  slides = signal<CarouselSlide[]>([]);
  currentSlide = signal<number>(0);
  isLoadingCarousel = signal<boolean>(true);
  enrolledCourses = signal<any[]>([]);
  private timer: any;

  ngOnInit(): void {
    // Dynamic SEO
    this.titleService.setTitle('Lemon Academy | Learn Artisan Crafts, Lippan Art & Soap Making');
    this.metaService.updateTag({ name: 'description', content: 'Lemon Academy is the premier craft academy for artisan masterclasses in Lippan Kaam, Cold-Process Soap Making, and Epoxy Resin Art.' });
    this.metaService.updateTag({ property: 'og:title', content: 'Lemon Academy — Artisan Craft Masterclasses' });
    this.metaService.updateTag({ property: 'og:description', content: 'Learn hands-on craft skills from master instructors with full physical DIY materials kits.' });

    this.loadCarousel();
    this.loadEnrolledCourses();

    if (typeof window !== 'undefined') {
      window.addEventListener('carousel_updated', () => this.loadCarousel());
      window.addEventListener('storage', () => this.loadCarousel());
      window.addEventListener('auth_state_changed', () => this.loadEnrolledCourses());
    }
  }

  loadEnrolledCourses(): void {
    if (this.authService.isLoggedIn()) {
      this.enrollmentService.getEnrollments().subscribe({
        next: (list) => this.enrolledCourses.set(list || []),
        error: () => this.enrolledCourses.set([])
      });
    } else {
      this.enrolledCourses.set([]);
    }
  }

  ngOnDestroy(): void {
    if (this.timer) clearInterval(this.timer);
  }

  /** Parse raw slide data from backend into typed CarouselSlide array */
  private parseSlides(data: any[]): CarouselSlide[] {
    return (data || [])
      .filter((item: any) => item && item.active !== false && item.isActive !== false)
      .map((s: any, idx: number) => ({
        id: s.id || String(idx + 1),
        title: s.title || s.heading || 'Artisan Workshop',
        tagline: s.tagline || s.subtitle || s.subTitle || '',
        description: s.description || '',
        imageUrl: s.imageUrl || s.url || s.image || s.bannerUrl || s.src || '',
        route: s.route || s.link || '/courses',
        category: s.category || '',
        order: s.order !== undefined ? Number(s.order) : idx + 1,
        active: s.active !== false,
        isActive: s.isActive !== false,
        queryParams: s.category ? { category: s.category } : (s.queryParams || undefined)
      }))
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }

  loadCarousel(): void {
    this.isLoadingCarousel.set(true);
    this.http.get<any>(`${environment.apiUrl}/content/carousel`).subscribe({
      next: (res) => {
        const data = Array.isArray(res) ? res : res?.data;
        if (this.applyBackendData(data)) {
          this.isLoadingCarousel.set(false);
          return;
        }
        this.tryFallbackEndpoints();
      },
      error: () => {
        this.tryFallbackEndpoints();
      }
    });
  }

  private applyBackendData(data: any[]): boolean {
    if (!Array.isArray(data) || data.length === 0) return false;
    const activeList = this.parseSlides(data);
    if (activeList.length > 0) {
      this.slides.set(activeList);
      this.startTimer();
      return true;
    }
    return false;
  }

  private tryFallbackEndpoints(): void {
    this.http.get<any>(`${environment.apiUrl}/carousel`).subscribe({
      next: (res) => {
        const data = Array.isArray(res) ? res : res?.data;
        if (this.applyBackendData(data)) {
          this.isLoadingCarousel.set(false);
          return;
        }
        this.trySettingsFallback();
      },
      error: () => {
        this.trySettingsFallback();
      }
    });
  }

  private trySettingsFallback(): void {
    this.http.get<any>(`${environment.apiUrl}/admin/settings`).subscribe({
      next: (res) => {
        this.isLoadingCarousel.set(false);
        const settings = Array.isArray(res) ? res : res?.data || [];
        if (Array.isArray(settings)) {
          const setting = settings.find((s: any) => s.settingKey === 'homepage_carousel');
          if (setting && setting.settingValue) {
            try {
              const list = JSON.parse(setting.settingValue);
              if (this.applyBackendData(list)) return;
            } catch {}
          }
        }
      },
      error: () => {
        this.isLoadingCarousel.set(false);
      }
    });
  }

  navigateToSlide(slide: any, index: number): void {
    const route = this.getSlideRoute(slide, index);
    const queryParams = this.getSlideQueryParams(slide, index);
    if (queryParams) {
      this.router.navigate([route], { queryParams });
    } else {
      this.router.navigate([route]);
    }
  }

  getSlideUrl(slide: any, index: number): string {
    if (!slide) return '';
    if (typeof slide === 'string') return slide;
    return slide.imageUrl || slide.url || slide.image || slide.bannerUrl || slide.src || '';
  }

  getSlideRoute(slide: any, index: number): string {
    if (typeof slide === 'object' && slide?.route) return slide.route;
    if (typeof slide === 'object' && slide?.link) return slide.link;
    return '/courses';
  }

  getSlideQueryParams(slide: any, index: number): Record<string, string> | null {
    if (typeof slide === 'object' && slide?.queryParams) return slide.queryParams;
    if (typeof slide === 'object' && slide?.category) return { category: slide.category };
    return null;
  }

  getSlideTagline(slide: any, index: number): string {
    if (typeof slide === 'object' && slide?.tagline) return slide.tagline;
    return '';
  }

  getSlideTitle(slide: any, index: number): string {
    if (typeof slide === 'object' && slide?.title) return slide.title;
    return 'Artisan Masterclass';
  }

  getSlideDescription(slide: any, index: number): string {
    if (typeof slide === 'object' && slide?.description) return slide.description;
    return '';
  }

  startTimer(): void {
    if (this.timer) clearInterval(this.timer);
    if (this.slides().length <= 1) return;
    this.timer = setInterval(() => {
      this.currentSlide.update(prev => (prev + 1) % this.slides().length);
    }, 5000);
  }

  nextSlide(): void {
    if (this.slides().length <= 1) return;
    this.currentSlide.update(prev => (prev + 1) % this.slides().length);
  }

  prevSlide(): void {
    if (this.slides().length <= 1) return;
    this.currentSlide.update(prev => (prev - 1 + this.slides().length) % this.slides().length);
  }

  setSlide(index: number): void {
    this.currentSlide.set(index);
  }
}
